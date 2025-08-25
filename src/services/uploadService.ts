import { apiFetch } from "../lib/apiClient";

export interface PresignResponse {
  uploadUrl: string;
  fileId: string;
  publicUrl: string;
}

export interface ImageUploadResponse {
  uploadUrl: string;
  fileName: string;
  publicUrl: string;
  expiresAt: string;
  maxFileSizeMB: number;
}

/**
 * 기존 GCS 업로드 URL 생성
 */
export async function getGcsUploadUrl(
  fileName: string,
  mimeType: string
): Promise<PresignResponse> {
  const res = await fetch(`/api/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, mimeType }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload URL request failed: ${res.status}`);
  }
  return (await res.json()) as PresignResponse;
}

/**
 * 새로운 이미지 업로드 URL 생성 API
 */
export async function getImageUploadUrl(
  contentType?: string,
  maxSizeMB?: number
): Promise<ImageUploadResponse> {
  const params = new URLSearchParams();
  if (contentType) {
    params.append("contentType", contentType);
  }
  if (maxSizeMB) {
    params.append("maxSizeMB", maxSizeMB.toString());
  }

  const url = params.toString()
    ? `/api/images/upload-url?${params.toString()}`
    : "/api/images/upload-url";

  const response = await apiFetch<{ data: ImageUploadResponse }>(url, {
    method: "POST",
    withAuth: true,
  });
  return response.data;
}

/**
 * presigned URL로 이미지 직접 업로드
 */
export async function uploadImageToPresignedUrl(
  presignedUrl: string,
  file: File
): Promise<void> {
  try {
    console.log("업로드 시작:", {
      url: presignedUrl,
      fileType: file.type,
      fileSize: file.size,
      fileName: file.name,
    });

    // Content-Type 헤더를 명시적으로 제거하여 브라우저가 자동으로 설정하도록 함
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      // headers를 완전히 제거하거나 빈 객체로 설정
      headers: {},
    });

    console.log("업로드 응답:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "알 수 없는 오류");
      console.error("업로드 실패 응답:", errorText);
      throw new Error(`이미지 업로드 실패 (${response.status}): ${errorText}`);
    }

    console.log("업로드 성공!");
  } catch (error) {
    console.error("업로드 오류 상세:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "네트워크 연결 오류: CORS 또는 네트워크 문제가 발생했습니다."
      );
    }
    throw error;
  }
}

/**
 * 서버를 통한 프록시 업로드 (CORS 우회)
 */
export async function uploadImageViaProxy(
  uploadUrl: string,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("uploadUrl", uploadUrl);

  const response = await apiFetch<{ message: string }>(
    "/api/images/proxy-upload",
    {
      method: "POST",
      body: formData,
      withAuth: true,
      headers: {}, // FormData의 경우 Content-Type을 자동으로 설정하도록 빈 객체
    }
  );

  if (!response || response.message !== "Upload successful") {
    throw new Error("프록시 업로드 실패");
  }
}

/**
 * 전체 이미지 업로드 프로세스 (URL 생성 + 업로드)
 * 브라우저 CORS 제한으로 인해 프록시 업로드를 우선 사용
 */
export async function uploadImageComplete(file: File): Promise<string> {
  console.log("이미지 업로드 시작:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  const uploadInfo = await getImageUploadUrl(file.type);
  console.log("업로드 URL 생성 완료:", {
    fileName: uploadInfo.fileName,
    maxFileSizeMB: uploadInfo.maxFileSizeMB,
  });

  // 파일 크기 체크
  if (file.size > uploadInfo.maxFileSizeMB * 1024 * 1024) {
    throw new Error(`파일 크기가 ${uploadInfo.maxFileSizeMB}MB를 초과합니다.`);
  }

  try {
    // Google Cloud Storage CORS 정책으로 인해 브라우저에서 직접 업로드가 제한됨
    // 프록시 업로드를 우선 시도
    console.log("프록시 업로드 시도");
    await uploadImageViaProxy(uploadInfo.uploadUrl, file);
    console.log("프록시 업로드 성공");
    return uploadInfo.publicUrl;
  } catch (proxyError) {
    console.warn("프록시 업로드 실패, 직접 업로드 시도:", proxyError);

    try {
      // 프록시 실패 시 직접 업로드 시도 (성공률 낮음)
      await uploadImageToPresignedUrl(uploadInfo.uploadUrl, file);
      console.log("직접 업로드 성공");
      return uploadInfo.publicUrl;
    } catch (directError) {
      console.error("모든 업로드 방법 실패:", { proxyError, directError });
      throw new Error(
        `이미지 업로드 실패: ${
          proxyError instanceof Error ? proxyError.message : "알 수 없는 오류"
        }`
      );
    }
  }
}

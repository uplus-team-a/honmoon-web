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
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "알 수 없는 오류");
      throw new Error(`이미지 업로드 실패 (${response.status}): ${errorText}`);
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "네트워크 연결 오류: CORS 또는 네트워크 문제가 발생했습니다."
      );
    }
    throw error;
  }
}

/**
 * 전체 이미지 업로드 프로세스 (URL 생성 + 업로드)
 */
export async function uploadImageComplete(file: File): Promise<string> {
  const uploadInfo = await getImageUploadUrl(file.type);
  await uploadImageToPresignedUrl(uploadInfo.uploadUrl, file);
  return uploadInfo.publicUrl;
}

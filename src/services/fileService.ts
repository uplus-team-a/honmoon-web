import { apiFetch } from "../lib/apiClient";

export type UploadType = "MISSION" | "PROFILE";

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileName: string;
  expiresAt: string; // ISO date-time
}

export interface ResponseBodyPresignedUrlResponse {
  data?: PresignedUrlResponse;
  status: number;
  message: string;
}

export interface ResponseBodyString {
  data?: string;
  status: number;
  message: string;
}

export interface ResponseBodyBoolean {
  data?: boolean;
  status: number;
  message: string;
}

export async function createUploadUrl(params: {
  fileName: string;
  uploadType: UploadType;
  contentType?: string;
  userId: string;
  useDevBasic?: boolean;
}): Promise<PresignedUrlResponse> {
  const { fileName, uploadType, contentType, userId, useDevBasic } = params;
  const search = new URLSearchParams();
  search.set("fileName", fileName);
  search.set("uploadType", uploadType);
  if (contentType) search.set("contentType", contentType);
  search.set("userId", userId);

  const res = await apiFetch<ResponseBodyPresignedUrlResponse>(
    `/api/v1/files/upload-url?${search.toString()}`,
    {
      method: "POST",
      basicAuth: useDevBasic
        ? { username: "jiwondev", password: "jiwondev" }
        : undefined,
    }
  );

  if (!res.data) {
    throw new Error(res.message || "업로드 URL 생성 실패");
  }
  return res.data;
}

export async function uploadToPresignedUrl(params: {
  uploadUrl: string;
  file: File | Blob;
  contentType?: string;
}): Promise<void> {
  const { uploadUrl, file, contentType } = params;
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = contentType;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: file,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `파일 업로드 실패: ${response.status}`);
  }
}

export async function getPublicFileUrl(fileName: string): Promise<string> {
  const res = await apiFetch<ResponseBodyString>(
    `/api/v1/files/url/${encodeURIComponent(fileName)}`,
    { method: "GET" }
  );
  if (!res.data) {
    throw new Error(res.message || "파일 URL 조회 실패");
  }
  return res.data;
}

export async function deleteFile(params: {
  fileName: string;
  userId: string;
  useDevBasic?: boolean;
}): Promise<boolean> {
  const { fileName, userId, useDevBasic } = params;
  const search = new URLSearchParams();
  search.set("userId", userId);

  const res = await apiFetch<ResponseBodyBoolean>(
    `/api/v1/files/${encodeURIComponent(fileName)}?${search.toString()}`,
    {
      method: "DELETE",
      basicAuth: useDevBasic
        ? { username: "jiwondev", password: "jiwondev" }
        : undefined,
    }
  );
  return Boolean(res.data);
}

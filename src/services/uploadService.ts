export interface PresignResponse {
  uploadUrl: string;
  fileId: string;
  publicUrl: string;
}

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

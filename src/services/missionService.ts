/**
 * 미션 및 장소 서비스
 * - 미션 장소/미션 상세 조회 및 퀴즈 제출, 이미지 업로드 URL 발급을 처리한다.
 */
import { apiFetch } from "../lib/apiClient";
import { getSessionToken, startGoogleLogin } from "./authService";

export interface MissionPlaceSummary {
  id: number;
  title: string; // 호환: name -> title 매핑
  lat: number; // 호환: latitude -> lat
  lng: number; // 호환: longitude -> lng
  imageUrl?: string; // 호환: image -> imageUrl
  description?: string; // 호환: location -> description
  missions?: MissionSummary[]; // 상세 포함 응답
}

export type MissionPlaceDetail = MissionPlaceSummary;

export interface MissionSummary {
  id: number;
  title: string;
  description?: string;
  quizType?: "TEXT" | "CHOICE" | "IMAGE" | string;
}
export type MissionListItem = MissionSummary;

export interface MissionDetail {
  id: number;
  title: string;
  description?: string;
  quizType?: "TEXT" | "CHOICE" | "IMAGE" | string;
  question?: string;
  choices?: {
    choices: string[];
  };
  correctAnswer?: string;
  imageUrl?: string;
  pointsReward?: number;
}

export interface ApiListResponse<T> {
  data: T[];
  status: number;
  message: string;
}

export interface ApiItemResponse<T> {
  data: T;
  status: number;
  message: string;
}

/**
 * 로그인 전(dev)에는 Basic 인증을 사용하도록 옵션을 구성한다.
 */
function authOptionsForRequest(): {
  withAuth?: boolean;
  basicAuth?: { username: string; password: string };
  headers?: Record<string, string>;
} {
  const token = getSessionToken();
  if (token) return {};
  const envBasic = process.env.NEXT_PUBLIC_BASIC_AUTH_TOKEN;
  if (envBasic) {
    return { withAuth: false, headers: { Authorization: envBasic } };
  }
  return {
    withAuth: false,
    basicAuth: { username: "jiwondev", password: "jiwondev" },
  };
}

async function handleAuthRedirectOn401(error: unknown): Promise<void> {
  if (typeof window === "undefined") return;
  if (error instanceof Error && error.message === "AUTH_REQUIRED") {
    try {
      await startGoogleLogin(window.location.pathname || "/");
    } catch {
      // ignore
    }
  }
}

export async function fetchMissionPlaces(): Promise<MissionPlaceSummary[]> {
  try {
    const res = await apiFetch<ApiListResponse<MissionPlaceSummary>>(
      "/api/mission-places",
      { method: "GET", ...authOptionsForRequest() }
    );
    return res.data;
  } catch (e) {
    await handleAuthRedirectOn401(e);
    throw e;
  }
}

export async function fetchMissionPlaceById(
  id: number
): Promise<MissionPlaceDetail> {
  try {
    const res = await apiFetch<ApiItemResponse<MissionPlaceDetail>>(
      `/api/mission-places/${id}`,
      { method: "GET", ...authOptionsForRequest() }
    );
    return res.data;
  } catch (e) {
    await handleAuthRedirectOn401(e);
    throw e;
  }
}

export async function fetchMissionsByPlaceId(
  id: number
): Promise<MissionDetail[]> {
  try {
    const res = await apiFetch<ApiListResponse<MissionDetail>>(
      `/api/mission-places/${id}/missions`,
      { method: "GET", ...authOptionsForRequest() }
    );
    return res.data;
  } catch (e) {
    await handleAuthRedirectOn401(e);
    throw e;
  }
}

export interface SubmitQuizResult {
  isCorrect: boolean;
  pointsEarned: number;
}

export async function submitQuizText(
  missionId: number,
  textAnswer: string
): Promise<SubmitQuizResult> {
  const res = await fetch(`/api/missions/${missionId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ textAnswer }),
  });
  if (!res.ok) throw new Error("submit failed");
  const json = (await res.json()) as ApiItemResponse<SubmitQuizResult>;
  return json.data;
}

export async function submitQuizChoice(
  missionId: number,
  selectedChoiceIndex: number
): Promise<SubmitQuizResult> {
  const res = await fetch(`/api/missions/${missionId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selectedChoiceIndex }),
  });
  if (!res.ok) throw new Error("submit failed");
  const json = (await res.json()) as ApiItemResponse<SubmitQuizResult>;
  return json.data;
}

export async function submitQuizImage(
  missionId: number,
  uploadedImageUrl: string
): Promise<SubmitQuizResult> {
  const res = await fetch(`/api/missions/${missionId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uploadedImageUrl }),
  });
  if (!res.ok) throw new Error("submit failed");
  const json = (await res.json()) as ApiItemResponse<SubmitQuizResult>;
  return json.data;
}

/**
 * 입력값 없이 퀴즈 제출 (PLACE_VISIT 등)
 */
export async function submitQuizNoInput(
  missionId: number
): Promise<SubmitQuizResult> {
  const res = await fetch(`/api/missions/${missionId}/submit`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("submit failed");
  const json = (await res.json()) as ApiItemResponse<SubmitQuizResult>;
  return json.data;
}

export async function fetchMissionById(id: number): Promise<MissionDetail> {
  try {
    const res = await apiFetch<ApiItemResponse<MissionDetail>>(
      `/api/missions/${id}`,
      { method: "GET", ...authOptionsForRequest() }
    );
    return res.data;
  } catch (e) {
    await handleAuthRedirectOn401(e);
    throw e;
  }
}

export async function submitMissionAnswer(
  missionId: number,
  answer: string
): Promise<SubmitQuizResult> {
  const res = await apiFetch<ApiItemResponse<SubmitQuizResult>>(
    `/api/missions/${missionId}/submit-answer`,
    {
      method: "POST",
      body: JSON.stringify({ answer }),
      ...authOptionsForRequest(),
    }
  );
  return res.data;
}

export async function submitMissionImageAnswer(
  missionId: number,
  imageUrl: string
): Promise<SubmitQuizResult> {
  const res = await apiFetch<ApiItemResponse<SubmitQuizResult>>(
    `/api/missions/${missionId}/submit-image-answer`,
    {
      method: "POST",
      body: JSON.stringify({ imageUrl }),
      ...authOptionsForRequest(),
    }
  );
  return res.data;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileName: string;
}

export async function getMissionImageUploadUrl(
  missionId: number,
  fileName: string
): Promise<PresignedUrlResponse> {
  try {
    const res = await apiFetch<ApiItemResponse<PresignedUrlResponse>>(
      `/api/missions/${missionId}/image/upload-url?fileName=${encodeURIComponent(
        fileName
      )}`,
      { method: "POST", ...authOptionsForRequest() }
    );
    return res.data;
  } catch (e) {
    await handleAuthRedirectOn401(e);
    throw e;
  }
}

export async function searchMissionPlaces(
  title: string
): Promise<MissionPlaceSummary[]> {
  try {
    const res = await apiFetch<ApiListResponse<MissionPlaceSummary>>(
      `/api/mission-places/search?title=${encodeURIComponent(title)}`,
      { method: "GET", ...authOptionsForRequest() }
    );
    return res.data;
  } catch (e) {
    await handleAuthRedirectOn401(e);
    throw e;
  }
}

export async function fetchNearbyMissionPlaces(
  lat: number,
  lng: number,
  radius = 1000
): Promise<MissionPlaceSummary[]> {
  try {
    const res = await apiFetch<ApiListResponse<MissionPlaceSummary>>(
      `/api/mission-places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      { method: "GET", ...authOptionsForRequest() }
    );
    return res.data;
  } catch (e) {
    await handleAuthRedirectOn401(e);
    throw e;
  }
}

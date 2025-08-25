import { apiFetch } from "../lib/apiClient";
import { getImageUploadUrl } from "./uploadService";

export interface MissionPlaceSummary {
  id: number;
  title: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  description?: string;
  missions?: MissionSummary[];
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
  // 새로운 API 응답 필드들
  points?: number;
  missionType?: string;
  placeId?: number;
  answer?: string;
  answerExplanation?: string;
  correctImageUrl?: string;
  imageUploadInstruction?: string;
  createdAt?: string;
  modifiedAt?: string;
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

export async function fetchMissionPlaces(): Promise<MissionPlaceSummary[]> {
  const res = await apiFetch<ApiListResponse<MissionPlaceSummary>>(
    "/api/mission-places",
    { method: "GET", withAuth: true }
  );
  return res.data;
}

export async function fetchMissionPlaceById(
  id: number
): Promise<MissionPlaceDetail> {
  const res = await apiFetch<ApiItemResponse<MissionPlaceDetail>>(
    `/api/mission-places/${id}`,
    { method: "GET", withAuth: true }
  );
  return res.data;
}

export async function fetchMissionsByPlaceId(
  id: number
): Promise<MissionDetail[]> {
  const res = await apiFetch<ApiListResponse<MissionDetail>>(
    `/api/mission-places/${id}/missions`,
    { method: "GET", withAuth: true }
  );
  return res.data;
}

export interface SubmitQuizResult {
  isCorrect: boolean;
  pointsEarned: number;
}

export interface MissionCompleteResponse {
  missionDetail: MissionDetail;
  userActivity: {
    id: number;
    userId: string;
    placeId: number;
    missionId: number;
    description?: string;
    isCorrect: boolean;
    isCompleted: boolean;
    pointsEarned: number;
    textAnswer?: string;
    selectedChoiceIndex?: number;
    uploadedImageUrl?: string;
    createdAt: string;
    modifiedAt: string;
    aiResult?: string;
    alreadyExists?: boolean;
  };
  message: string;
}

export async function submitQuizText(
  missionId: number,
  textAnswer: string
): Promise<SubmitQuizResult> {
  const res = await apiFetch<ApiItemResponse<SubmitQuizResult>>(
    `/api/missions/${missionId}/submit-quiz?textAnswer=${encodeURIComponent(
      textAnswer
    )}`,
    {
      method: "POST",
      withAuth: true,
    }
  );
  return res.data;
}

export async function submitQuizChoice(
  missionId: number,
  selectedChoiceIndex: number
): Promise<SubmitQuizResult> {
  const res = await apiFetch<ApiItemResponse<SubmitQuizResult>>(
    `/api/missions/${missionId}/submit-quiz?selectedChoiceIndex=${selectedChoiceIndex}`,
    {
      method: "POST",
      withAuth: true,
    }
  );
  return res.data;
}

export async function submitQuizImage(
  missionId: number,
  uploadedImageUrl: string
): Promise<SubmitQuizResult> {
  const res = await apiFetch<ApiItemResponse<SubmitQuizResult>>(
    `/api/missions/${missionId}/submit-quiz?uploadedImageUrl=${encodeURIComponent(
      uploadedImageUrl
    )}`,
    {
      method: "POST",
      withAuth: true,
    }
  );
  return res.data;
}

export async function submitQuizNoInput(
  missionId: number
): Promise<SubmitQuizResult> {
  const res = await apiFetch<ApiItemResponse<SubmitQuizResult>>(
    `/api/missions/${missionId}/submit-quiz`,
    {
      method: "POST",
      withAuth: true,
    }
  );
  return res.data;
}

export async function fetchMissionById(id: number): Promise<MissionDetail> {
  const res = await apiFetch<ApiItemResponse<MissionDetail>>(
    `/api/missions/${id}`,
    { method: "GET", withAuth: true }
  );
  return res.data;
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
      withAuth: true,
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
  const res = await apiFetch<ApiItemResponse<PresignedUrlResponse>>(
    `/api/missions/${missionId}/image/upload-url?fileName=${encodeURIComponent(
      fileName
    )}`,
    { method: "POST", withAuth: true }
  );
  return res.data;
}

export async function searchMissionPlaces(
  title: string
): Promise<MissionPlaceSummary[]> {
  const res = await apiFetch<ApiListResponse<MissionPlaceSummary>>(
    `/api/mission-places/search?title=${encodeURIComponent(title)}`,
    { method: "GET", withAuth: true }
  );
  return res.data;
}

export async function fetchNearbyMissionPlaces(
  lat: number,
  lng: number,
  radius = 1000
): Promise<MissionPlaceSummary[]> {
  const res = await apiFetch<ApiListResponse<MissionPlaceSummary>>(
    `/api/mission-places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    { method: "GET", withAuth: true }
  );
  return res.data;
}

// 새로운 미션 이미지 답변 제출 API
export async function submitMissionImageAnswer(
  missionId: number,
  imageUrl: string
): Promise<SubmitQuizResult> {
  const res = await apiFetch<ApiItemResponse<SubmitQuizResult>>(
    `/api/missions/${missionId}/submit-image-answer`,
    {
      method: "POST",
      body: JSON.stringify({ imageUrl }),
      withAuth: true,
    }
  );
  return res.data;
}

// 새로운 미션 상세 조회 API (정답 포함)
export async function fetchMissionDetailWithAnswer(
  missionId: number
): Promise<MissionDetail> {
  const res = await apiFetch<ApiItemResponse<MissionDetail>>(
    `/api/missions/${missionId}`,
    { method: "GET", withAuth: true }
  );
  return res.data;
}

// 새로운 미션 완료 API
export async function completeMission(
  missionId: number
): Promise<MissionCompleteResponse> {
  const res = await apiFetch<ApiItemResponse<MissionCompleteResponse>>(
    `/api/missions/${missionId}/complete`,
    { method: "POST", withAuth: true }
  );
  return res.data;
}

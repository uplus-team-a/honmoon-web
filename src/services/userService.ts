/**
 * 사용자/프로필 서비스
 * - 서버 API 스펙에 따라 사용자 정보 및 통계를 조회/수정한다.
 */
import { apiFetch } from "../lib/apiClient";

export interface UserSummary {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
}

export interface PointsInfo {
  totalPoints: number;
  availablePoints: number;
}

export interface QuizStats {
  totalAnswered: number;
  correctCount: number;
}

export interface MissionStats {
  totalMissions: number;
  completedMissions: number;
}

export interface ApiItemResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface ApiListResponse<T> {
  data: T[];
  status: number;
  message: string;
}

/**
 * 내 프로필 조회
 * - GET /api/users/me
 */
export async function fetchMe(): Promise<UserSummary> {
  const res = await apiFetch<ApiItemResponse<UserSummary>>("/api/users/me", {
    method: "GET",
  });
  return res.data;
}

export async function fetchMyPoints(): Promise<PointsInfo> {
  const res = await apiFetch<ApiItemResponse<PointsInfo>>(
    "/api/users/me/points",
    { method: "GET" }
  );
  return res.data;
}

export async function fetchMyQuizStats(): Promise<QuizStats> {
  const res = await apiFetch<ApiItemResponse<QuizStats>>(
    "/api/users/me/quiz-stats",
    { method: "GET" }
  );
  return res.data;
}

export async function fetchMyMissionStats(): Promise<MissionStats> {
  const res = await apiFetch<ApiItemResponse<MissionStats>>(
    "/api/users/me/mission-stats",
    { method: "GET" }
  );
  return res.data;
}

/**
 * 내 프로필 이미지 업데이트
 * - PUT /api/users/me/profile-image
 */
export async function updateMyProfileImage(imageUrl: string): Promise<boolean> {
  const res = await apiFetch<ApiItemResponse<boolean>>(
    `/api/users/me/profile-image`,
    { method: "PUT", body: JSON.stringify({ imageUrl }) }
  );
  return Boolean(res.data);
}

/**
 * 내 프로필 정보 수정 (닉네임/이미지)
 * - PATCH /api/users/me
 */
export async function updateMyProfile(params: {
  nickname?: string;
  profileImageUrl?: string;
}): Promise<UserSummary> {
  const res = await apiFetch<ApiItemResponse<UserSummary>>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(params),
  });
  return res.data;
}

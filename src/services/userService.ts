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

export interface UserProfileResponse {
  id: string;
  email: string;
  nickname?: string;
  totalPoints: number;
  totalActivities: number;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface UserProfileSummaryResponse {
  profile: UserProfileResponse;
  pointsSummary: {
    currentPoints: number;
    totalEarned: number;
    totalUsed: number;
  };
  recentActivities: Array<{
    id: number;
    userId: string;
    placeId?: number | null;
    missionId?: number | null;
    description?: string | null;
    isCorrect?: boolean | null;
    isCompleted?: boolean;
    pointsEarned?: number;
    uploadedImageUrl?: string | null;
    createdAt: string;
  }>;
  recentPointHistory: Array<{
    id: number;
    userId: string;
    points: number;
    description: string;
    createdAt: string;
  }>;
}

export type UserProfileDetailResponse = UserProfileSummaryResponse;

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

/**
 * 내 프로필 수정 (새로운 PUT API)
 * - PUT /api/users/me/profile
 */
export async function updateMyProfilePut(params: {
  nickname?: string;
  profileImageUrl?: string;
}): Promise<UserProfileResponse> {
  const res = await apiFetch<ApiItemResponse<UserProfileResponse>>(
    "/api/users/me/profile",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      withAuth: true,
    }
  );
  return res.data;
}

export async function fetchMyProfileSummary(): Promise<UserProfileSummaryResponse> {
  const res = await apiFetch<ApiItemResponse<UserProfileSummaryResponse>>(
    "/api/users/me/profile/summary",
    { method: "GET" }
  );
  return res.data;
}

export async function fetchMyProfileDetail(): Promise<UserProfileDetailResponse> {
  const res = await apiFetch<ApiItemResponse<UserProfileDetailResponse>>(
    "/api/users/me/profile/detail",
    { method: "GET" }
  );
  return res.data;
}

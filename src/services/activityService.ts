/**
 * 사용자 활동 내역 서비스
 * - 서버 API 스펙에 따라 활동 조회/생성 기능을 제공한다.
 */
import { apiFetch } from "../lib/apiClient";

export interface UserActivity {
  id: number;
  userId: string;
  placeId: number;
  placeName: string;
  placeImageUrl?: string;
  description?: string;
  visitedAt: string;
  createdAt: string;
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
 * 활동 상세 조회
 * - GET /api/user-activities/{id}
 */
export async function fetchUserActivityById(id: number): Promise<UserActivity> {
  const res = await apiFetch<ApiItemResponse<UserActivity>>(
    `/api/user-activities/${id}`,
    { method: "GET" }
  );
  return res.data;
}

/**
 * 장소별 활동 목록 조회
 * - GET /api/user-activities/place/{placeId}
 */
export async function fetchActivitiesByPlace(
  placeId: number
): Promise<UserActivity[]> {
  const res = await apiFetch<ApiListResponse<UserActivity>>(
    `/api/user-activities/place/${placeId}`,
    { method: "GET" }
  );
  return res.data;
}

/**
 * 활동 기록 생성 (세션 사용자 기준)
 * - POST /api/user-activities?placeId=...&description=...
 */
export async function createActivity(
  placeId: number,
  description: string
): Promise<UserActivity> {
  const query = new URLSearchParams({
    placeId: String(placeId),
    description,
  });

  const res = await apiFetch<ApiItemResponse<UserActivity>>(
    `/api/user-activities?${query.toString()}`,
    { method: "POST" }
  );
  return res.data;
}

/**
 * 내 활동 목록 조회
 * - GET /api/user-activities/me
 */
export async function fetchMyActivities(): Promise<UserActivity[]> {
  const res = await apiFetch<ApiListResponse<UserActivity>>(
    "/api/user-activities/me",
    { method: "GET" }
  );
  return res.data;
}

/**
 * 내 최근 활동 조회
 * - GET /api/user-activities/me/recent?limit=...
 */
export async function fetchMyRecentActivities(
  limit = 10
): Promise<UserActivity[]> {
  const res = await apiFetch<ApiListResponse<UserActivity>>(
    `/api/user-activities/me/recent?limit=${limit}`,
    { method: "GET" }
  );
  return res.data;
}

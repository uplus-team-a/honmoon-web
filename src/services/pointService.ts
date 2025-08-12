/**
 * 포인트 서비스
 * - 포인트 내역 및 사용 가능 여부를 조회한다.
 */
import { apiFetch } from "../lib/apiClient";

export interface PointHistory {
  id: number;
  userId: string;
  amount: number;
  type: "EARNED" | "USED";
  description?: string;
  createdAt: string;
}

export interface PointCheckResponse {
  success: boolean;
  availablePoints: number;
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

export async function fetchPointHistoryById(id: number): Promise<PointHistory> {
  const res = await apiFetch<ApiItemResponse<PointHistory>>(
    `/api/point-history/${id}`,
    { method: "GET" }
  );
  return res.data;
}

export async function fetchMyPointHistory(): Promise<PointHistory[]> {
  const res = await apiFetch<ApiListResponse<PointHistory>>(
    "/api/point-history/me",
    { method: "GET" }
  );
  return res.data;
}

export async function fetchMyEarnedPointHistory(): Promise<PointHistory[]> {
  const res = await apiFetch<ApiListResponse<PointHistory>>(
    "/api/point-history/me/earned",
    { method: "GET" }
  );
  return res.data;
}

export async function fetchMyUsedPointHistory(): Promise<PointHistory[]> {
  const res = await apiFetch<ApiListResponse<PointHistory>>(
    "/api/point-history/me/used",
    { method: "GET" }
  );
  return res.data;
}

export async function checkPointUsage(
  requiredPoints: number
): Promise<PointCheckResponse> {
  const res = await apiFetch<ApiItemResponse<PointCheckResponse>>(
    `/api/point-history/use/check?requiredPoints=${requiredPoints}`,
    { method: "GET" }
  );
  return res.data;
}

/**
 * 래플 서비스
 * - 래플 상품/응모/추첨 관련 기능을 제공한다.
 */
import { apiFetch } from "../lib/apiClient";

export interface RaffleProductSummary {
  id: number | string;
  name: string;
  imageUrl?: string;
  deadline?: string;
  description?: string;
  pointsRequired?: number;
}

export interface RaffleApplication {
  id: number;
  userId: string;
  raffleProductId: number | string;
  appliedAt: string;
  status: "PENDING" | "WON" | "LOST";
}

export interface ApplicantCount {
  count: number;
}

export interface ApplicationStatus {
  hasApplied: boolean;
  applicationId?: number;
  status?: "PENDING" | "WON" | "LOST";
}

export interface DrawResult {
  winners: Array<{
    userId: string;
    applicationId: number;
  }>;
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

export async function fetchRaffleProducts(): Promise<RaffleProductSummary[]> {
  const res = await apiFetch<ApiListResponse<RaffleProductSummary>>(
    "/api/raffle-products",
    { method: "GET" }
  );
  return res.data;
}

export async function fetchRaffleProductById(
  id: string | number
): Promise<RaffleProductSummary> {
  const res = await apiFetch<ApiItemResponse<RaffleProductSummary>>(
    `/api/raffle-products/${id}`,
    { method: "GET" }
  );
  return res.data;
}

export async function applyRaffle(id: string | number): Promise<boolean> {
  const res = await apiFetch<ApiItemResponse<boolean>>(
    `/api/raffle-applications/me?raffleProductId=${id}`,
    { method: "POST" }
  );
  return Boolean(res.data);
}

export async function searchRaffleProducts(
  name: string
): Promise<RaffleProductSummary[]> {
  const res = await apiFetch<ApiListResponse<RaffleProductSummary>>(
    `/api/raffle-products/search?name=${encodeURIComponent(name)}`,
    { method: "GET" }
  );
  return res.data;
}

export async function fetchRaffleProductsByPoints(
  minPoints?: number,
  maxPoints?: number
): Promise<RaffleProductSummary[]> {
  const query = new URLSearchParams();
  if (minPoints !== undefined) query.set("minPoints", String(minPoints));
  if (maxPoints !== undefined) query.set("maxPoints", String(maxPoints));

  const res = await apiFetch<ApiListResponse<RaffleProductSummary>>(
    `/api/raffle-products/by-points${
      query.toString() ? `?${query.toString()}` : ""
    }`,
    { method: "GET" }
  );
  return res.data;
}

export async function fetchRaffleApplicantCount(
  productId: string | number
): Promise<number> {
  const res = await apiFetch<ApiItemResponse<ApplicantCount>>(
    `/api/raffle-products/${productId}/applicants-count`,
    { method: "GET" }
  );
  return res.data.count;
}

export async function fetchRaffleApplicationById(
  id: number
): Promise<RaffleApplication> {
  const res = await apiFetch<ApiItemResponse<RaffleApplication>>(
    `/api/raffle-applications/${id}`,
    { method: "GET" }
  );
  return res.data;
}

export async function fetchMyRaffleApplications(): Promise<
  RaffleApplication[]
> {
  const res = await apiFetch<ApiListResponse<RaffleApplication>>(
    "/api/raffle-applications/me",
    { method: "GET" }
  );
  return res.data;
}

export async function fetchRaffleApplicationsByProduct(
  productId: string | number
): Promise<RaffleApplication[]> {
  const res = await apiFetch<ApiListResponse<RaffleApplication>>(
    `/api/raffle-applications/product/${productId}`,
    { method: "GET" }
  );
  return res.data;
}

export async function applyRaffleGeneral(
  productId: string | number
): Promise<boolean> {
  const res = await apiFetch<ApiItemResponse<boolean>>(
    `/api/raffle-applications?raffleProductId=${productId}`,
    { method: "POST" }
  );
  return Boolean(res.data);
}

export async function drawRaffleWinners(
  productId: string | number,
  winnerCount: number
): Promise<DrawResult> {
  const res = await apiFetch<ApiItemResponse<DrawResult>>(
    `/api/raffle-applications/${productId}/draw?winnerCount=${winnerCount}`,
    { method: "POST" }
  );
  return res.data;
}

export async function fetchMyApplicationStatus(
  productId: string | number
): Promise<ApplicationStatus> {
  const res = await apiFetch<ApiItemResponse<ApplicationStatus>>(
    `/api/raffle-applications/me/product/${productId}`,
    { method: "GET" }
  );
  return res.data;
}

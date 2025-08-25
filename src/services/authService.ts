import { apiFetch } from "../lib/apiClient";

/**
 * 새로운 인증 API 인터페이스 타입 정의
 */

// 회원가입 이메일 발송 요청
export interface SignupEmailRequest {
  email: string;
}

// 회원가입 이메일 발송 응답
export interface SignupEmailResponse {
  success: boolean;
  message: string;
}

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  success: boolean;
  userId: string;
  token: string;
  message: string;
  email: string;
  nickname: string;
}

// 토큰 검증 요청 (회원가입 완료)
export interface VerifyTokenRequest {
  token: string;
  nickname: string;
  password: string;
}

// 토큰 검증 응답 (회원가입 완료)
export interface VerifyTokenResponse {
  success: boolean;
  userId: string;
  token: string;
  message: string;
  email: string;
  nickname: string;
}

// 프로필 정보
export interface ProfileSummary {
  id: string;
  email: string;
  nickname: string;
  totalPoints: number;
  totalActivities: number;
  profileImageUrl: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface PointsSummary {
  currentPoints: number;
  totalEarned: number;
  totalUsed: number;
}

export interface ProfileSummaryResponse {
  profile: ProfileSummary;
  pointsSummary: PointsSummary;
  recentActivities: unknown[];
  recentPointHistory: unknown[];
}

export interface Activity {
  id: number;
  userId: string;
  type: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

export interface PointHistory {
  id: number;
  userId: string;
  points: number;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ProfileDetailResponse {
  profile: ProfileSummary;
  pointsSummary: PointsSummary;
  activities: Activity[];
  pointHistory: PointHistory[];
}

/**
 * 회원가입 이메일 발송
 * POST /api/auth/signup/email?callbackUrl=...
 */
export async function sendSignupEmail(
  email: string,
  callbackUrl?: string
): Promise<SignupEmailResponse> {
  const params = callbackUrl
    ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "";
  const response = await apiFetch<{ data: SignupEmailResponse }>(
    `/api/auth/signup/email${params}`,
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify({ email }),
    }
  );
  return response.data;
}

/**
 * 이메일/비밀번호 로그인
 * POST /api/auth/login
 */
export async function loginWithEmailPassword(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiFetch<{ data: LoginResponse }>("/api/auth/login", {
    method: "POST",
    withAuth: false,
    body: JSON.stringify({ email, password }),
  });
  return response.data;
}

/**
 * 토큰 검증 (회원가입 완료)
 * POST /api/auth/verify
 */
export async function verifySignupToken(
  token: string,
  nickname: string,
  password: string
): Promise<VerifyTokenResponse> {
  const response = await apiFetch<{ data: VerifyTokenResponse }>(
    "/api/auth/verify",
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify({ token, nickname, password }),
    }
  );
  return response.data;
}

/**
 * 내 프로필 조회 (간략)
 * GET /api/users/me/profile/summary
 */
export async function getMyProfileSummary(): Promise<ProfileSummaryResponse> {
  const response = await apiFetch<{ data: ProfileSummaryResponse }>(
    "/api/users/me/profile/summary",
    {
      method: "GET",
      withAuth: true,
    }
  );
  return response.data;
}

/**
 * 내 프로필 조회 (상세)
 * GET /api/users/me/profile/detail
 */
export async function getMyProfileDetail(): Promise<ProfileDetailResponse> {
  const response = await apiFetch<{ data: ProfileDetailResponse }>(
    "/api/users/me/profile/detail",
    {
      method: "GET",
      withAuth: true,
    }
  );
  return response.data;
}

/**
 * 내 프로필 수정
 * PUT /api/users/me/profile
 */
export async function updateMyProfile(data: {
  nickname?: string;
  profileImageUrl?: string;
}): Promise<ProfileSummary> {
  const response = await apiFetch<{ data: ProfileSummary }>(
    "/api/users/me/profile",
    {
      method: "PUT",
      withAuth: true,
      body: JSON.stringify(data),
    }
  );
  return response.data;
}

/**
 * 토큰 저장
 */
export function saveAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

/**
 * 토큰 조회
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

/**
 * 토큰 삭제 (로그아웃)
 */
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

/**
 * 인증 상태 확인
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * 로그아웃
 */
export function logout(): void {
  removeAuthToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

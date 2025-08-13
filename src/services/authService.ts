import { apiFetch } from "../lib/apiClient";
import { GOOGLE_CALLBACK_URL } from "../constants";

/**
 * 인증 관련 타입 정의
 * - 서버 응답 스펙과 1:1로 매핑되도록 유지한다.
 */
export interface AuthUrlResponse {
  provider: string;
  authorizationUrl: string;
  state: string;
}

export interface GoogleUserInfo {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface JwtTokenResponse {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  tokenType?: string;
}

export interface AuthLoginResponse {
  provider: string;
  google?: GoogleUserInfo;
  appSessionToken?: string;
  jwt?: JwtTokenResponse;
}

export interface ProfileResponse {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  provider: string;
}

export interface EmailLoginRequest {
  email: string;
}

export interface EmailSignupRequest {
  email: string;
  name: string;
}

export interface EmailPasswordLoginRequest {
  email: string;
  password: string;
}

export interface SetPasswordRequest {
  password: string;
}

export interface EmailLoginByUserRequest {
  userId: string;
}

export interface EmailMagicLinkResponse {
  email: string;
  magicLink: string;
  expiresAt: string;
}

export interface EmailCallbackResponse {
  email: string;
  isValid: boolean;
  appSessionToken?: string;
}

export interface TestTokenResponse {
  token: string;
}

/**
 * Google OAuth 인증 URL 발급
 * - GET /api/auth/google/url
 * - 요청 파라미터: scope, redirectAfter, frontendCallbackUrl
 * - 서버가 반환한 authorizationUrl로 브라우저를 이동시켜 인증을 시작한다.
 */
export async function getGoogleAuthUrl(params: {
  redirectAfter?: string;
  frontendCallbackUrl: string;
  scope?: string;
}): Promise<AuthUrlResponse> {
  const {
    redirectAfter,
    frontendCallbackUrl,
    scope = "openid email profile",
  } = params;
  const query = new URLSearchParams();
  if (scope) query.set("scope", scope);
  if (redirectAfter) query.set("redirectAfter", redirectAfter);
  query.set("frontendCallbackUrl", frontendCallbackUrl);
  const res = await apiFetch<{ data: AuthUrlResponse }>(
    `/api/auth/google/url?${query.toString()}`,
    { method: "GET", withAuth: false }
  );
  return res.data;
}

/**
 * Google OAuth 콜백 코드 교환
 * - POST /api/auth/google/exchange
 * - 요청 바디: { code, state }
 * - 성공 시 세션 토큰 또는 JWT 정보를 반환한다.
 */
export async function exchangeGoogleCode(params: {
  code: string;
  state: string;
}): Promise<AuthLoginResponse> {
  const res = await apiFetch<{ data: AuthLoginResponse }>(
    `/api/auth/google/exchange`,
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify(params),
    }
  );
  return res.data;
}

/**
 * 이메일 로그인(사용자 식별자 기반) 매직 링크 요청
 * - POST /api/auth/login/email/by-user
 * - 요청 바디: { userId }
 * - redirectUrl 쿼리 사용 시 인증 완료 후 이동 경로를 지정할 수 있다.
 */
export async function requestEmailLoginByUser(
  body: EmailLoginByUserRequest,
  redirectUrl?: string
): Promise<EmailMagicLinkResponse> {
  const query = new URLSearchParams();
  if (redirectUrl) query.set("redirectUrl", redirectUrl);
  const res = await apiFetch<{ data: EmailMagicLinkResponse }>(
    `/api/auth/login/email/by-user${
      query.toString() ? `?${query.toString()}` : ""
    }`,
    { method: "POST", withAuth: false, body: JSON.stringify(body) }
  );
  return res.data;
}

/**
 * 이메일 회원가입용 매직 링크 요청
 * - POST /api/auth/signup/email
 * - 요청 바디: { email, name }
 * - redirectUrl 쿼리 사용 시 인증 완료 후 이동 경로를 지정할 수 있다.
 */
export async function requestEmailSignup(
  body: EmailSignupRequest,
  redirectUrl?: string
): Promise<EmailMagicLinkResponse> {
  const query = new URLSearchParams();
  if (redirectUrl) query.set("redirectUrl", redirectUrl);
  const res = await apiFetch<{ data: EmailMagicLinkResponse }>(
    `/api/auth/signup/email${query.toString() ? `?${query.toString()}` : ""}`,
    { method: "POST", withAuth: false, body: JSON.stringify(body) }
  );
  return res.data;
}

/**
 * 이메일 토큰 교환 (콜백 토큰 → 세션 발급)
 * - POST /api/auth/email/exchange
 * - 요청 바디: { token, purpose: "signup" | "login" }
 * - 서버가 세션을 생성하고 토큰을 반환한다.
 */
export async function exchangeEmailToken(params: {
  token: string;
  purpose: "signup" | "login";
}): Promise<EmailCallbackResponse> {
  const res = await apiFetch<{ data: EmailCallbackResponse }>(
    `/api/auth/email/exchange`,
    { method: "POST", withAuth: false, body: JSON.stringify(params) }
  );
  return res.data;
}

/**
 * 이메일/비밀번호 로그인
 * - POST /api/auth/login/email/password
 */
export async function loginWithEmailPassword(
  body: EmailPasswordLoginRequest
): Promise<AuthLoginResponse> {
  const res = await apiFetch<{ data: AuthLoginResponse }>(
    "/api/auth/login/email/password",
    { method: "POST", withAuth: false, body: JSON.stringify(body) }
  );
  return res.data;
}

/**
 * (세션 사용자) 비밀번호 설정/변경
 * - POST /api/auth/password/set
 */
export async function setPassword(body: SetPasswordRequest): Promise<boolean> {
  const res = await apiFetch<{ data: { success: boolean } }>(
    "/api/auth/password/set",
    { method: "POST", body: JSON.stringify(body) }
  );
  return !!res?.data?.success;
}

/**
 * 현재 로그인한 사용자 프로필 조회
 * - GET /api/auth/me
 */
export async function getMe(): Promise<ProfileResponse> {
  const res = await apiFetch<{ data: ProfileResponse }>("/api/auth/me", {
    method: "GET",
  });
  return res.data;
}

/**
 * 로그아웃
 * - POST /api/auth/logout
 */
export async function logout(): Promise<boolean> {
  const res = await apiFetch<{ data: boolean }>("/api/auth/logout", {
    method: "POST",
  });
  return !!res?.data;
}

/**
 * 개발용 테스트 토큰 발급 (Basic 인증 필요)
 * - POST /api/auth/test-token
 */
export async function getTestToken(): Promise<string> {
  const res = await apiFetch<{ data: TestTokenResponse }>(
    "/api/auth/test-token",
    {
      method: "POST",
      withAuth: false,
      basicAuth: { username: "jiwondev", password: "jiwondev" },
    }
  );
  return res.data.token;
}

/**
 * 세션 토큰 저장
 * - 브라우저 로컬스토리지에 세션 토큰을 기록한다.
 */
export function saveSessionToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("appSessionToken", token);
  }
}

/**
 * 세션 토큰 조회
 * - 로컬스토리지에서 토큰을 읽어온다.
 */
export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("appSessionToken");
  } catch {
    return null;
  }
}

/**
 * 세션 토큰 삭제
 * - 로컬스토리지에서 토큰을 제거한다.
 */
export function removeSessionToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("appSessionToken");
  }
}

/**
 * 인증 상태 확인
 */
export function isAuthenticated(): boolean {
  return !!getSessionToken();
}

/**
 * Google OAuth 로그인 시작
 * - 서버에서 발급받은 authorizationUrl로 브라우저 이동
 */
export async function startGoogleLogin(redirectAfter = "/"): Promise<void> {
  if (typeof window === "undefined") return;
  const frontendCallbackUrl = GOOGLE_CALLBACK_URL;
  const { authorizationUrl } = await getGoogleAuthUrl({
    redirectAfter,
    frontendCallbackUrl,
  });
  window.location.href = authorizationUrl;
}

/**
 * Google OAuth 콜백 처리 및 세션 토큰 저장
 * - 콜백에서 받은 code/state를 서버로 교환하여 세션을 확립한다.
 */
export async function handleGoogleCallback(
  code: string,
  state: string
): Promise<AuthLoginResponse> {
  const authResponse = await exchangeGoogleCode({ code, state });
  if (authResponse.appSessionToken) {
    saveSessionToken(authResponse.appSessionToken);
  }
  return authResponse;
}

/**
 * 서버 로그아웃 및 로컬 세션 정리
 */
export async function performLogout(): Promise<void> {
  try {
    await logout();
  } catch (error) {
    console.warn("Server logout failed:", error);
  } finally {
    removeSessionToken();
  }
}

/**
 * 개발용 테스트 토큰 발급 (Basic 인증)
 * - 로컬에서 서버 API 호출 점검 시 사용
 */
export async function getTestTokenForDev(): Promise<string> {
  const res = await apiFetch<{ data: TestTokenResponse }>(
    "/api/auth/test-token",
    {
      method: "POST",
      withAuth: false,
      basicAuth: { username: "jiwondev", password: "jiwondev" },
    }
  );
  return res.data.token;
}

/**
 * 개발용 토큰으로 즉시 로그인
 */
export async function loginWithTestToken(): Promise<void> {
  const token = await getTestTokenForDev();
  saveSessionToken(token);
}

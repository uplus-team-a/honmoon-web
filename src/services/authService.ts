// 인증 관련 서비스
// Google OAuth URL 생성, 콜백 교환, 현재 사용자, 로그아웃, 이메일 매직 링크 요청/콜백 등을 제공합니다.

import { apiFetch } from "../lib/apiClient";

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

export async function getGoogleAuthUrl(
  redirectAfter?: string
): Promise<AuthUrlResponse> {
  const query = new URLSearchParams();
  if (redirectAfter) query.set("redirectAfter", redirectAfter);
  const res = await apiFetch<{ data: AuthUrlResponse }>(
    `/api/auth/google/url${query.toString() ? `?${query.toString()}` : ""}`,
    {
      method: "GET",
      withAuth: false,
    }
  );
  return res.data;
}

export async function exchangeGoogleCode(params: {
  code: string;
  state: string;
}): Promise<AuthLoginResponse> {
  const { code, state } = params;
  const query = new URLSearchParams({ code, state });
  const res = await apiFetch<{ data: AuthLoginResponse }>(
    `/api/auth/google/callback?${query.toString()}`,
    {
      method: "GET",
      withAuth: false,
    }
  );
  return res.data;
}

export async function requestEmailMagicLink(
  body: EmailLoginRequest
): Promise<EmailMagicLinkResponse> {
  const res = await apiFetch<{ data: EmailMagicLinkResponse }>(
    `/api/auth/email/magic-link`,
    {
      method: "POST",
      withAuth: false,
      body: JSON.stringify(body),
    }
  );
  return res.data;
}

export async function verifyEmailMagicToken(
  token: string
): Promise<EmailCallbackResponse> {
  const query = new URLSearchParams({ token });
  const res = await apiFetch<{ data: EmailCallbackResponse }>(
    `/api/auth/email/callback?${query.toString()}`,
    {
      method: "GET",
      withAuth: false,
    }
  );
  return res.data;
}

export async function getMe(): Promise<ProfileResponse> {
  // /api/auth/me는 ProfileResponse를 그대로 반환
  const res = await apiFetch<ProfileResponse>("/api/auth/me", {
    method: "GET",
  });
  return res;
}

export async function logout(): Promise<boolean> {
  const res = await apiFetch<{ data: boolean }>("/api/auth/logout", {
    method: "POST",
  });
  return !!res?.data;
}

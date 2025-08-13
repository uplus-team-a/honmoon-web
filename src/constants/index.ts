// constants/
// 상수 값들을 정의하고 관리하는 폴더입니다.

// API 베이스 URL: 환경변수 우선, 없으면 운영 기본값
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.honmoon-api.site";

// 프론트엔드 오리진: 환경변수 → 브라우저 오리진 → NODE_ENV 분기 기본값
export const FRONTEND_ORIGIN =
  process.env.NEXT_PUBLIC_FRONTEND_ORIGIN ||
  (typeof window !== "undefined"
    ? window.location.origin
    : process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.honmoon.site");

// 콜백 경로
export const GOOGLE_CALLBACK_PATH = "/auth/google/callback";
export const EMAIL_CALLBACK_PATH = "/auth/email/callback";

// 전체 콜백 URL
export const GOOGLE_CALLBACK_URL = `${FRONTEND_ORIGIN}${GOOGLE_CALLBACK_PATH}`;
export const EMAIL_CALLBACK_URL = `${FRONTEND_ORIGIN}${EMAIL_CALLBACK_PATH}`;

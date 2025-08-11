import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  getGoogleAuthUrl,
  exchangeGoogleCode,
  getMe,
  logout,
  requestEmailMagicLink,
  verifyEmailMagicToken,
  type ProfileResponse,
} from "../services/authService";

/**
 * 인증 상태를 관리하는 Zustand 스토어
 */
export interface AuthState {
  token: string | null;
  user: ProfileResponse | null;
  loading: boolean;
  error: string | null;
  initializeFromStorage: () => void;
  fetchProfile: () => Promise<void>;
  loginWithGoogle: (redirectAfter?: string) => Promise<void>;
  handleGoogleCallback: (code: string, state: string) => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  handleEmailCallback: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const parseErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string") return maybeMessage;
  }
  return "알 수 없는 오류가 발생했습니다";
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: false,
  error: null,

  initializeFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const storedToken = window.localStorage.getItem("appSessionToken");
      if (storedToken) {
        set({ token: storedToken });
      }
    } catch {}
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getMe();
      set({ user, loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "프로필 조회 실패",
        loading: false,
      });
    }
  },

  loginWithGoogle: async (redirectAfter?: string) => {
    set({ loading: true, error: null });
    try {
      const { authorizationUrl } = await getGoogleAuthUrl(
        redirectAfter || "/my-profile"
      );
      window.location.href = authorizationUrl;
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "로그인 URL 생성 실패",
        loading: false,
      });
    }
  },

  handleGoogleCallback: async (code: string, state: string) => {
    set({ loading: true, error: null });
    try {
      const data = await exchangeGoogleCode({ code, state });
      if (typeof window !== "undefined" && data.appSessionToken) {
        window.localStorage.setItem("appSessionToken", data.appSessionToken);
      }
      set({ token: data.appSessionToken || null });
      await get().fetchProfile();
      set({ loading: false });
    } catch (e: unknown) {
      set({ error: parseErrorMessage(e) || "인증 처리 실패", loading: false });
    }
  },

  loginWithEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await requestEmailMagicLink({ email });
      set({ loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "매직 링크 요청 실패",
        loading: false,
      });
    }
  },

  handleEmailCallback: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const data = await verifyEmailMagicToken(token);
      if (typeof window !== "undefined" && data.appSessionToken) {
        window.localStorage.setItem("appSessionToken", data.appSessionToken);
      }
      set({ token: data.appSessionToken || null });
      await get().fetchProfile();
      set({ loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "매직 링크 검증 실패",
        loading: false,
      });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await logout();
    } catch {}
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("appSessionToken");
      } catch {}
    }
    set({ token: null, user: null, loading: false });
  },
}));

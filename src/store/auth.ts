import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  requestEmailSignup,
  exchangeEmailToken,
  type ProfileResponse,
} from "../services/authService";
import {
  getCurrentProfile,
  signOutSupabase,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  ensureUserDefaults,
} from "../services/supabaseAuth";
import {
  fetchMyMissionStats,
  type MissionStats,
} from "../services/userService";

/**
 * 인증 상태를 관리하는 Zustand 스토어
 */
export interface AuthState {
  token: string | null;
  user: ProfileResponse | null;
  missionStats: MissionStats | null;
  loading: boolean;
  error: string | null;
  initializeFromStorage: () => void;
  fetchProfile: () => Promise<void>;
  fetchMissionStats: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  handleEmailCallback: (
    token: string,
    purpose?: "signup" | "login"
  ) => Promise<void>;
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
  missionStats: null,
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
      const user = await getCurrentProfile();
      set({ user, loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "프로필 조회 실패",
        loading: false,
      });
    }
  },

  fetchMissionStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await fetchMyMissionStats();
      set({ missionStats: stats, loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "미션 통계 조회 실패",
        loading: false,
      });
    }
  },

  loginWithEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const nameFromEmail = email.split("@")[0] || "사용자";
      let redirectUrl: string | undefined;
      if (typeof window !== "undefined") {
        redirectUrl = `${window.location.origin}/auth/email/callback`;
      }
      await requestEmailSignup({ email, name: nameFromEmail }, redirectUrl);
      set({ loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "매직 링크 요청 실패",
        loading: false,
      });
    }
  },

  handleEmailCallback: async (
    token: string,
    purpose: "signup" | "login" = "login"
  ) => {
    set({ loading: true, error: null });
    try {
      const data = await exchangeEmailToken({ token, purpose });
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
      await signOutSupabase();
    } catch {}
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("appSessionToken");
      } catch {}
    }
    set({ token: null, user: null, loading: false });
  },
  // 추가: 이메일/비밀번호 로그인/회원가입(Supabase)
  async loginWithEmailPasswordSupabase(email: string, password: string) {
    set({ loading: true, error: null });
    const ok = await signInWithEmailPassword({ email, password });
    if (!ok) {
      set({ loading: false, error: "이메일/비밀번호 로그인 실패" });
      return;
    }
    // 세션 토큰을 기존 구조와 호환되게 저장 (선택)
    // 콜백 없이도 세션이 생기므로 프로필 로딩
    await ensureUserDefaults({
      profile_image_url:
        "https://storage.googleapis.com/honmoon-bucket/image/honmmon.png",
    });
    await get().fetchProfile();
    set({ loading: false });
  },
  async signupWithEmailPasswordSupabase(
    email: string,
    password: string,
    name?: string
  ) {
    set({ loading: true, error: null });
    const ok = await signUpWithEmailPassword({ email, password, name });
    if (!ok) {
      set({ loading: false, error: "회원가입 실패" });
      return;
    }
    await ensureUserDefaults({
      profile_image_url:
        "https://storage.googleapis.com/honmoon-bucket/image/honmmon.png",
    });
    await get().fetchProfile();
    set({ loading: false });
  },
}));

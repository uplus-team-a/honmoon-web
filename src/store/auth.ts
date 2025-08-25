import { create } from "zustand";
import {
  sendSignupEmail,
  loginWithEmailPassword,
  verifySignupToken,
  getMyProfileSummary,
  getMyProfileDetail,
  updateMyProfile,
  saveAuthToken,
  removeAuthToken,
  getAuthToken,
  type LoginResponse,
  type VerifyTokenResponse,
  type ProfileSummaryResponse,
  type ProfileDetailResponse,
} from "../services/authService";
import {
  fetchMyMissionStats,
  type MissionStats,
} from "../services/userService";

/**
 * 인증 상태를 관리하는 Zustand 스토어
 */
export interface AuthState {
  token: string | null;
  user: ProfileSummaryResponse | null;
  userDetail: ProfileDetailResponse | null;
  missionStats: MissionStats | null;
  loading: boolean;
  error: string | null;
  initializeFromStorage: () => void;
  fetchProfile: () => Promise<void>;
  fetchProfileDetail: () => Promise<void>;
  fetchMissionStats: () => Promise<void>;
  updateProfile: (data: {
    nickname?: string;
    profileImageUrl?: string;
  }) => Promise<void>;
  sendSignupEmail: (email: string, callbackUrl?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<LoginResponse>;
  verifySignup: (
    token: string,
    nickname: string,
    password: string
  ) => Promise<VerifyTokenResponse>;
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
  userDetail: null,
  missionStats: null,
  loading: false,
  error: null,

  initializeFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const storedToken = getAuthToken();
      if (storedToken) {
        set({ token: storedToken });
      }
    } catch {}
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getMyProfileSummary();
      set({ user, loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "프로필 조회 실패",
        loading: false,
      });
    }
  },

  fetchProfileDetail: async () => {
    set({ loading: true, error: null });
    try {
      const userDetail = await getMyProfileDetail();
      set({ userDetail, loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "프로필 상세 조회 실패",
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

  updateProfile: async (data: {
    nickname?: string;
    profileImageUrl?: string;
  }) => {
    set({ loading: true, error: null });
    try {
      await updateMyProfile(data);
      // 업데이트 후 프로필 정보 다시 가져오기
      await get().fetchProfile();
      await get().fetchProfileDetail();
      set({ loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "프로필 업데이트 실패",
        loading: false,
      });
      throw e;
    }
  },

  sendSignupEmail: async (email: string, callbackUrl?: string) => {
    set({ loading: true, error: null });
    try {
      await sendSignupEmail(email, callbackUrl);
      set({ loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "회원가입 이메일 발송 실패",
        loading: false,
      });
      throw e;
    }
  },

  loginWithEmail: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await loginWithEmailPassword(email, password);
      saveAuthToken(response.token);
      set({ token: response.token, loading: false });
      await get().fetchProfile();
      return response;
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "로그인 실패",
        loading: false,
      });
      throw e;
    }
  },

  verifySignup: async (token: string, nickname: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await verifySignupToken(token, nickname, password);
      saveAuthToken(response.token);
      set({ token: response.token, loading: false });
      await get().fetchProfile();
      return response;
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "회원가입 완료 실패",
        loading: false,
      });
      throw e;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      removeAuthToken();
      set({ token: null, user: null, userDetail: null, loading: false });
    } catch (e: unknown) {
      set({
        error: parseErrorMessage(e) || "로그아웃 실패",
        loading: false,
      });
    }
  },
}));

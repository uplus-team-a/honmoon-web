"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/auth";

/**
 * 인증 상태 초기화 컴포넌트
 * - 저장된 토큰으로 인증 상태를 복원
 */
export default function DevAuthBootstrap() {
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    if (token) {
      fetchProfile().catch(() => {
        // 토큰이 유효하지 않으면 apiFetch에서 자동으로 로그아웃 처리
      });
    }
  }, [token, fetchProfile]);

  return null;
}

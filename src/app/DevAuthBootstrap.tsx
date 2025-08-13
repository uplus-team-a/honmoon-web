"use client";

import { useEffect } from "react";

/**
 * 개발용 기본 인증 부트스트랩
 * - 최초 접속 시 Basic 인증용 사용자 ID를 로컬스토리지에 주입한다.
 * - 이미 값이 있으면 덮어쓰지 않는다.
 */
export default function DevAuthBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = "currentUserId";
      const presetUserId = "a5189c38-fbe2-4373-bf6b-d04ea8f2a683";
      const existing = window.localStorage.getItem(key);
      if (!existing) {
        window.localStorage.setItem(key, presetUserId);
      }
    } catch {}
  }, []);
  return null;
}

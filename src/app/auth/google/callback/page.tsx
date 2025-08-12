"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleGoogleCallback } from "../../../../services/authService";
import { useAuthStore } from "../../../../store/auth";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const fetchMissionStats = useAuthStore((s) => s.fetchMissionStats);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const redirectAfter = searchParams.get("redirectAfter") || "/my-profile";

    if (code && state) {
      handleGoogleCallback(code, state)
        .then(async () => {
          initializeFromStorage();
          try {
            await Promise.all([fetchProfile(), fetchMissionStats()]);
          } catch {}
          router.replace(redirectAfter);
        })
        .catch(() => router.replace("/"));
    } else {
      router.replace("/");
    }
  }, [
    router,
    searchParams,
    initializeFromStorage,
    fetchProfile,
    fetchMissionStats,
  ]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">로그인 처리 중…</div>
        <div className="text-sm text-gray-500">잠시만 기다려주세요.</div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">로딩 중…</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}

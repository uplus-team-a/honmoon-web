"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, type AuthState } from "store/auth";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleGoogleCallback = useAuthStore(
    (s: AuthState) => s.handleGoogleCallback
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const redirectAfter = searchParams.get("redirectAfter") || "/my-profile";

    if (code && state) {
      handleGoogleCallback(code, state)
        .then(() => router.replace(redirectAfter))
        .catch(() => router.replace("/my-profile"));
    } else {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <div className="text-lg font-semibold mb-2">로그인 처리 중…</div>
        <div className="text-sm text-gray-500">잠시만 기다려주세요.</div>
      </div>
    </div>
  );
}

/**
 * Google OAuth 콜백 페이지
 */
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">로딩 중…</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, type AuthState } from "store/auth";

function EmailCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleEmailCallback = useAuthStore(
    (s: AuthState) => s.handleEmailCallback
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const redirectAfter = searchParams.get("redirectAfter") || "/my-profile";
    if (token) {
      handleEmailCallback(token)
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
        <div className="text-lg font-semibold mb-2">이메일 인증 처리 중…</div>
        <div className="text-sm text-gray-500">잠시만 기다려주세요.</div>
      </div>
    </div>
  );
}

export default function EmailCallbackPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">로딩 중…</div>}>
      <EmailCallbackContent />
    </Suspense>
  );
}

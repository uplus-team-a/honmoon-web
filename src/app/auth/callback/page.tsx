"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 새로운 인증 시스템에서는 이 페이지가 불필요하므로 홈으로 리다이렉트
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-sm text-neutral-600">페이지를 로딩 중입니다...</div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabaseClient";
import { useAuthStore, type AuthState } from "store/auth";
import { ensureUserDefaults } from "services/supabaseAuth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const fetchProfile = useAuthStore((s: AuthState) => s.fetchProfile);

  useEffect(() => {
    const run = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Supabase 세션 조회 실패", error);
        router.replace("/login");
        return;
      }
      if (session?.access_token) {
        try {
          // 백엔드 없이 Supabase 세션을 그대로 사용한다면, 로컬에도 토큰 저장하여 기존 apiFetch 경로 재사용
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              "appSessionToken",
              session.access_token
            );
          }
          // 사용자 ID를 저장하여 서버 API Basic 인증에 사용
          try {
            const { data } = await supabase.auth.getUser();
            const uid = data.user?.id;
            if (uid && typeof window !== "undefined") {
              window.localStorage.setItem("currentUserId", uid);
            }
          } catch {}
          await ensureUserDefaults({
            profile_image_url:
              "https://storage.googleapis.com/honmoon-bucket/image/honmmon.png",
          });
          await fetchProfile();
          router.replace("/");
        } catch {
          router.replace("/");
        }
      } else {
        router.replace("/login");
      }
    };
    run();
  }, [router, fetchProfile]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-sm text-neutral-600">구글 인증 처리 중…</div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/auth";
import { Button } from "../../../shared/components/ui/button";
import { startGoogleLogin } from "../../../services/authService";

const Header = () => {
  const pathname = usePathname();
  const isMyProfilePage = pathname === "/my-profile";

  // 개별 selector 사용으로 서버 스냅샷 안정화
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const missionStats = useAuthStore((s) => s.missionStats);
  const fetchMissionStats = useAuthStore((s) => s.fetchMissionStats);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    if (token && !user) {
      fetchProfile().catch(() => {});
    }
  }, [token, user, fetchProfile]);

  useEffect(() => {
    if (token && !missionStats) {
      fetchMissionStats().catch(() => {});
    }
  }, [token, missionStats, fetchMissionStats]);

  return (
    <header className="relative z-30 w-full border-b border-neutral-200/60 bg-white/80 backdrop-blur-sm px-4 py-2.5 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center gap-4 flex-1">
        <>
          <Link href="/my-profile">
            <Image
              src={
                user?.picture ||
                "https://storage.googleapis.com/honmoon-bucket/image/honmmon.png"
              }
              alt="프로필"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full border border-neutral-200 object-cover"
            />
          </Link>
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-neutral-900">
                {user?.name || "로그인이 필요합니다"}
              </span>
              {user && (
                <span className="text-[10px] rounded-full border border-neutral-200 px-1.5 py-0.5 text-neutral-500">
                  {user.provider?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-[12px] text-neutral-500">
              {user?.email || "Google 계정으로 로그인하세요"}
            </div>
            {user && missionStats && (
              <div className="flex items-center gap-2">
                <div className="w-36 h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 transition-[width] duration-500"
                    style={{
                      width: `${Math.round(
                        (missionStats.completedMissions /
                          Math.max(1, missionStats.totalMissions)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-neutral-500 tabular-nums">
                  {Math.round(
                    (missionStats.completedMissions /
                      Math.max(1, missionStats.totalMissions)) *
                      100
                  )}
                  %
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 sm:mt-0 ml-auto">
            {!token ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => startGoogleLogin("/my-profile")}
                  className="rounded-lg h-9 px-3 text-[13px] font-medium border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 active:translate-y-[1px] transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google로 계속하기
                </Button>
                <Link
                  href="/login"
                  className="rounded-lg h-9 px-3 text-[13px] font-medium border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 active:translate-y-[1px] transition-colors inline-flex items-center"
                >
                  이메일 로그인
                </Link>
              </div>
            ) : (
              <Button
                variant="outline"
                className="rounded-lg h-8 px-3 border-neutral-200 text-neutral-900 hover:bg-neutral-50"
                onClick={() => signOut()}
              >
                로그아웃
              </Button>
            )}
          </div>
        </>
      </div>
      {isMyProfilePage && (
        <Link
          href="/"
          className="text-[13px] border border-neutral-200 rounded px-3 py-1.5 text-neutral-900 hover:bg-neutral-50 transition-colors"
        >
          홈
        </Link>
      )}
    </header>
  );
};

export default Header;

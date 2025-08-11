"use client";

/**
 * 애플리케이션의 상단 헤더 컴포넌트
 */
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/auth";

const Header = () => {
  const pathname = usePathname();
  const isMyProfilePage = pathname === "/my-profile";

  // 개별 selector 사용으로 서버 스냅샷 안정화
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    if (token && !user) {
      fetchProfile().catch(() => {});
    }
  }, [token, user, fetchProfile]);

  return (
    <header className="w-full border-b shadow-sm px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center gap-4">
        {!isMyProfilePage && (
          <>
            <Link href="/my-profile">
              <Image
                src={user?.picture || "https://via.placeholder.com/56"}
                alt="프로필"
                width={56}
                height={56}
                className="w-14 h-14 rounded-full border-4 border-primary"
              />
            </Link>
            <div>
              <div className="font-bold text-lg">
                {user?.name || "로그인이 필요합니다"}
              </div>
              <div className="text-sm text-muted-foreground">
                {user?.email || "Google 계정으로 로그인하세요"}
              </div>
              {user && (
                <div className="text-xs text-primary">
                  {user.provider?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0">
              {!user ? (
                <button
                  className="text-sm border rounded px-3 py-1 text-foreground hover:bg-muted transition"
                  onClick={() => loginWithGoogle("/my-profile")}
                >
                  구글로 로그인
                </button>
              ) : (
                <button
                  className="text-sm border rounded px-3 py-1 text-foreground hover:bg-muted transition"
                  onClick={() => signOut()}
                >
                  로그아웃
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {isMyProfilePage && (
        <Link
          href="/"
          className="text-sm border rounded px-3 py-1 text-foreground hover:bg-muted transition"
        >
          홈
        </Link>
      )}
    </header>
  );
};

export default Header;

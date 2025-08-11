/**
 * 사용자 프로필 페이지 컴포넌트
 */
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/auth";

export default function ProfilePage() {
  // 개별 selector 사용
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">프로필 및 활동내역</h1>

      <div className="flex items-center justify-between bg-white shadow-md rounded-xl p-4 mb-8 border">
        <div className="flex items-center gap-4">
          <img
            src={user?.picture || "https://via.placeholder.com/80"}
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <div className="font-bold text-lg">
              {user?.name || "로그인이 필요합니다"}
            </div>
            <div className="text-sm text-gray-600">
              {user?.email || "Google 계정으로 로그인하세요"}
            </div>
            {user && (
              <div className="text-purple-600 text-sm mt-1">
                {user.provider?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/editProfile">
            <button
              className="border rounded px-4 py-1 text-sm"
              disabled={!user}
            >
              프로필 관리
            </button>
          </Link>
          {!user ? (
            <button
              className="border rounded px-4 py-1 text-sm"
              onClick={() => loginWithGoogle("/my-profile")}
            >
              구글로 로그인
            </button>
          ) : (
            <button
              className="border rounded px-4 py-1 text-sm"
              onClick={() => signOut()}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

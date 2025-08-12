"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/auth";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
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
    <section className="w-full">
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
            <Image
              src={user?.picture || "https://via.placeholder.com/80"}
              alt="프로필 이미지"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-[180px]">
            <div className="text-[15px] font-semibold text-neutral-900">
              {user?.name || "로그인이 필요합니다"}
            </div>
            <div className="text-[12px] text-neutral-500">
              {user?.email || "Google 계정으로 로그인하세요"}
            </div>
            {user && (
              <div className="mt-1 inline-flex items-center rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-500">
                {user.provider?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/editProfile" className="hidden sm:block">
            <button className="h-9 rounded-lg border border-neutral-200 px-3 text-[13px] text-neutral-900 hover:bg-neutral-50">
              프로필 관리
            </button>
          </Link>
          {!user ? (
            <Link href="/login">
              <button className="h-9 rounded-lg border border-neutral-200 px-3 text-[13px] text-neutral-900 hover:bg-neutral-50">
                로그인하러 가기
              </button>
            </Link>
          ) : (
            <button
              className="h-9 rounded-lg border border-neutral-200 px-3 text-[13px] text-neutral-900 hover:bg-neutral-50"
              onClick={() => signOut()}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

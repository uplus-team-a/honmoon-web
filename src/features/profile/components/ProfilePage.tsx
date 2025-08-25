"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/auth";
import { Button } from "../../../shared/components/ui/button";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const signOut = useAuthStore((s) => s.signOut);

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    if (token && !user) {
      fetchProfile().catch(() => {});
    }
  }, [token, user, fetchProfile]);

  useEffect(() => {
    if (user) {
      setNickname(user.profile.nickname || "");
      setProfileImageUrl(user.profile.profileImageUrl || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateProfile({
        nickname: nickname.trim() || undefined,
        profileImageUrl: profileImageUrl.trim() || undefined,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
            <Image
              src={
                profileImageUrl ||
                user?.profile.profileImageUrl ||
                "https://storage.googleapis.com/honmoon-bucket/image/honmmon.png"
              }
              alt="프로필 이미지"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-[180px] flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="닉네임을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    프로필 이미지 URL
                  </label>
                  <input
                    type="url"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이미지 URL을 입력하세요"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="text-[15px] font-semibold text-neutral-900">
                  {user?.profile.nickname || "로그인이 필요합니다"}
                </div>
                <div className="text-[12px] text-neutral-500">
                  {user?.profile.email || "로그인하세요"}
                </div>
                {user && (
                  <div className="mt-1 inline-flex items-center rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-500">
                    EMAIL
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <Link href="/login">
              <Button variant="outline" size="sm">
                로그인하러 가기
              </Button>
            </Link>
          ) : isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setNickname(user.profile.nickname || "");
                  setProfileImageUrl(user.profile.profileImageUrl || "");
                }}
                disabled={loading}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "저장 중..." : "저장"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                편집
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                로그아웃
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </section>
  );
}

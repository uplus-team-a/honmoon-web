"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth";
import {
  fetchMe,
  updateMyProfile,
  updateMyProfileImage,
  type UserSummary,
} from "../../services/userService";

export default function EditProfilePage() {
  const router = useRouter();
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfileStore = useAuthStore((s) => s.fetchProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserSummary | null>(null);
  const [nickname, setNickname] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    initializeFromStorage();
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchMe();
        if (cancelled) return;
        setUser(me);
        setNickname(me.name || "");
        setImageUrl(me.picture || "");
      } catch (e) {
        setError("프로필 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initializeFromStorage]);

  const canSave = useMemo(() => {
    return (
      !saving && (nickname.trim().length > 0 || imageUrl.trim().length > 0)
    );
  }, [saving, nickname, imageUrl]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updates: { nickname?: string; profileImageUrl?: string } = {};
      if (nickname.trim() && nickname !== (user?.name || "")) {
        updates.nickname = nickname.trim();
      }
      if (imageUrl.trim() && imageUrl !== (user?.picture || "")) {
        updates.profileImageUrl = imageUrl.trim();
      }
      let updated: UserSummary | null = null;
      if (Object.keys(updates).length > 0) {
        updated = await updateMyProfile(updates);
      }
      if (updated) {
        setUser(updated);
      }
      await fetchProfileStore();
      setSuccess("프로필이 저장되었습니다.");
    } catch (e) {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateImageOnly = async () => {
    if (!imageUrl.trim()) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateMyProfileImage(imageUrl.trim());
      await fetchProfileStore();
      setSuccess("프로필 이미지가 업데이트되었습니다.");
    } catch (e) {
      setError("이미지 업데이트 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-xl mx-auto px-4 py-8">불러오는 중…</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4">
        <div className="relative w-[80px] h-[80px]">
          <Image
            src={imageUrl || "/images/default-profile.png"}
            alt="프로필 이미지"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <div className="text-sm text-neutral-500">현재 이메일</div>
          <div className="text-[15px] font-medium">{user?.email || "-"}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm text-neutral-600">닉네임</span>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            className="h-10 rounded-lg border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-neutral-600">프로필 이미지 URL</span>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://storage.googleapis.com/..."
            className="h-10 rounded-lg border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
          <div className="text-xs text-neutral-500">
            이미지 업로드 URL을 발급한 뒤, 퍼블릭 URL을 붙여 넣어 주세요.
          </div>
        </label>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="h-10 rounded-lg px-4 bg-neutral-900 text-white text-[14px] hover:bg-black disabled:opacity-60"
          >
            저장하기
          </button>
          <button
            onClick={handleUpdateImageOnly}
            disabled={saving || !imageUrl.trim()}
            className="h-10 rounded-lg px-4 bg-neutral-200 text-neutral-800 text-[14px] hover:bg-neutral-300 disabled:opacity-60"
          >
            이미지 URL만 업데이트
          </button>
          <button
            onClick={() => router.push("/my-profile")}
            className="h-10 rounded-lg px-4 border border-neutral-300 text-[14px]"
          >
            내 프로필로 이동
          </button>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../store/auth";
import {
  startGoogleLogin,
  loginWithEmailPassword,
} from "../../services/authService";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const fetchMissionStats = useAuthStore((s) => s.fetchMissionStats);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPasswordLogin = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await loginWithEmailPassword({
        email: email.trim(),
        password,
      });
      if (res.appSessionToken && typeof window !== "undefined") {
        window.localStorage.setItem("appSessionToken", res.appSessionToken);
      }
      initializeFromStorage();
      try {
        await Promise.all([fetchProfile(), fetchMissionStats()]);
      } catch {}
      const redirectAfter = searchParams.get("redirectAfter") || "/my-profile";
      router.replace(redirectAfter);
    } catch (e) {
      setError("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">로그인</h1>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm text-neutral-600">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 rounded-lg border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-neutral-600">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="h-10 rounded-lg border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </label>
        <button
          onClick={onPasswordLogin}
          disabled={loading || !email.trim() || !password}
          className="h-10 rounded-lg px-4 bg-neutral-900 text-white text-[14px] hover:bg-black disabled:opacity-60"
        >
          로그인
        </button>
        <button
          onClick={() => startGoogleLogin("/my-profile")}
          className="h-10 rounded-lg px-4 border border-neutral-300 text-[14px]"
        >
          Google로 계속하기
        </button>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="text-sm text-neutral-600 mt-2">
          회원가입이 필요하신가요?{" "}
          <a href="/signup" className="underline">
            이메일로 회원가입
          </a>
        </div>
      </div>
    </div>
  );
}

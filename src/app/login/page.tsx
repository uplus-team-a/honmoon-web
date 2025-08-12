"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth";
import { startGoogleLogin } from "../../services/authService";

export default function LoginPage() {
  const router = useRouter();
  const loginWithEmail = useAuthStore((s) => s.loginWithEmail);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onEmailSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await loginWithEmail(email.trim());
      setMessage(
        "입력한 이메일로 매직 링크를 보냈습니다. 메일함을 확인해 주세요."
      );
    } catch (e) {
      setError("매직 링크 요청 중 오류가 발생했습니다.");
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 rounded-lg border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </label>
        <button
          onClick={onEmailSubmit}
          disabled={loading || !email.trim()}
          className="h-10 rounded-lg px-4 bg-neutral-900 text-white text-[14px] hover:bg-black disabled:opacity-60"
        >
          이메일로 로그인 링크 받기
        </button>
        <button
          onClick={() => startGoogleLogin("/my-profile")}
          className="h-10 rounded-lg px-4 border border-neutral-300 text-[14px]"
        >
          Google로 계속하기
        </button>
        {message && <div className="text-sm text-green-600">{message}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}

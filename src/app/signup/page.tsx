"use client";

import { useState } from "react";
import { useAuthStore, type AuthState } from "store/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const loginWithEmail = useAuthStore((s: AuthState) => s.loginWithEmail);
  const loading = useAuthStore((s: AuthState) => s.loading);
  const error = useAuthStore((s: AuthState) => s.error);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithEmail(email);
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">회원가입 / 로그인</h1>
      <p className="text-sm text-gray-600 mb-6">
        이메일을 입력하면 로그인 링크를 보내드립니다.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="w-full border rounded px-3 py-2 bg-black text-white disabled:opacity-50"
        >
          {loading ? "전송 중…" : "로그인 링크 받기"}
        </button>
      </form>
      {sent && (
        <div className="mt-4 text-green-600 text-sm">
          입력하신 주소로 로그인 링크를 보냈습니다. 메일함을 확인해주세요.
        </div>
      )}
      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuthStore as useAuthStoreBase, type AuthState } from "store/auth";
import { requestEmailSignup } from "../../services/authService";
import { useRouter } from "next/navigation";
import { useAuthStore } from "store/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPwd] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [sent, setSent] = useState(false);
  const loginWithEmail = useAuthStoreBase((s: AuthState) => s.loginWithEmail);
  const loginWithEmailPasswordSupabase = useAuthStore(
    (s) => (s as unknown as { loginWithEmailPasswordSupabase: (email: string, password: string) => Promise<void> }).loginWithEmailPasswordSupabase
  );
  const signupWithEmailPasswordSupabase = useAuthStore(
    (s) => (s as unknown as { signupWithEmailPasswordSupabase: (email: string, password: string, name?: string) => Promise<void> }).signupWithEmailPasswordSupabase
  );
  const loading = useAuthStore((s: AuthState) => s.loading);
  const error = useAuthStore((s: AuthState) => s.error);
  const router = useRouter();

  const onSubmitMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입용 매직 링크 요청
    await requestEmailSignup(
      { email, name: name || email.split("@")[0] },
      undefined
    );
    setSent(true);
  };

  const onSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithEmailPasswordSupabase(email, password);
    router.replace("/my-profile");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">회원가입 / 로그인</h1>
      <div className="mb-3 flex gap-2 text-sm">
        <button
          type="button"
          className={`px-3 py-1.5 rounded border ${
            mode === "magic" ? "bg-black text-white" : "border-neutral-300"
          }`}
          onClick={() => setMode("magic")}
        >
          이메일 링크로 받기
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 rounded border ${
            mode === "password" ? "bg-black text-white" : "border-neutral-300"
          }`}
          onClick={() => setMode("password")}
        >
          비밀번호로 로그인
        </button>
      </div>

      <form
        onSubmit={mode === "magic" ? onSubmitMagic : onSubmitPassword}
        className="space-y-3"
      >
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {mode === "magic" ? (
          <input
            type="text"
            placeholder="이름 (선택)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        ) : (
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full border rounded px-3 py-2"
            minLength={8}
            required
          />
        )}
        <button
          type="submit"
          disabled={
            loading || !email || (mode === "password" && password.length < 8)
          }
          className="w-full border rounded px-3 py-2 bg-black text-white disabled:opacity-50"
        >
          {loading
            ? "전송 중…"
            : mode === "magic"
            ? "로그인/가입 링크 받기"
            : "이메일/비밀번호로 로그인"}
        </button>
      </form>
      {mode === "password" && (
        <div className="mt-4 text-sm text-neutral-600">
          계정이 없나요?{" "}
          <button
            className="underline"
            onClick={async () => {
              await signupWithEmailPasswordSupabase(
                email,
                password,
                name || email.split("@")[0]
              );
              router.replace("/my-profile");
            }}
          >
            이메일/비밀번호로 회원가입
          </button>
        </div>
      )}
      {sent && (
        <div className="mt-4 text-green-600 text-sm">
          입력하신 주소로 로그인 링크를 보냈습니다. 메일함을 확인해주세요.
        </div>
      )}
      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth";

export default function LoginPage() {
  const router = useRouter();
  const loginWithEmailPasswordSupabase = useAuthStore(
    (s) =>
      (
        s as unknown as {
          loginWithEmailPasswordSupabase: (
            email: string,
            password: string
          ) => Promise<boolean>;
        }
      ).loginWithEmailPasswordSupabase
  );
  const signupWithEmailPasswordSupabase = useAuthStore(
    (s) =>
      (
        s as unknown as {
          signupWithEmailPasswordSupabase: (
            email: string,
            password: string,
            name?: string
          ) => Promise<boolean>;
        }
      ).signupWithEmailPasswordSupabase
  );
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">
        {mode === "login" ? "로그인" : "회원가입"}
      </h1>
      <div className="mt-6 grid gap-4">
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            className={`px-3 py-1.5 rounded border ${
              mode === "login" ? "bg-black text-white" : "border-neutral-300"
            }`}
            onClick={() => setMode("login")}
          >
            로그인
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded border ${
              mode === "signup" ? "bg-black text-white" : "border-neutral-300"
            }`}
            onClick={() => setMode("signup")}
          >
            회원가입
          </button>
        </div>

        <label className="grid gap-1">
          <span className="text-sm text-neutral-600">이메일</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            className="h-10 rounded-lg border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </label>
        {mode === "signup" && (
          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">이름 (선택)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="h-10 rounded-lg border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </label>
        )}
        <label className="grid gap-1">
          <span className="text-sm text-neutral-600">비밀번호</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="8자 이상"
            className="h-10 rounded-lg border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </label>
        {mode === "login" ? (
          <button
            onClick={async () => {
              const ok = await loginWithEmailPasswordSupabase(
                email.trim(),
                password
              );
              if (ok) router.replace("/my-profile");
            }}
            disabled={loading || !email.trim() || password.length < 8}
            className="h-10 rounded-lg px-4 bg-neutral-900 text-white text-[14px] hover:bg-black disabled:opacity-60"
          >
            로그인
          </button>
        ) : (
          <button
            onClick={async () => {
              const ok = await signupWithEmailPasswordSupabase(
                email.trim(),
                password,
                name || email.split("@")[0]
              );
              if (ok) {
                alert("가입 메일을 보냈습니다. 이메일 인증 후 로그인하세요.");
              }
            }}
            disabled={loading || !email.trim() || password.length < 8}
            className="h-10 rounded-lg px-4 bg-neutral-900 text-white text-[14px] hover:bg-black disabled:opacity-60"
          >
            회원가입 (이메일 인증 필요)
          </button>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}

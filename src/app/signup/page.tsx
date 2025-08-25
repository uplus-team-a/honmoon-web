"use client";

import { useState } from "react";
import { useAuthStore } from "store/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const sendSignupEmail = useAuthStore((s) => s.sendSignupEmail);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 콜백 URL 설정 - 이메일에 포함될 토큰 검증 페이지
      const callbackUrl = `${window.location.origin}/auth/verify`;
      await sendSignupEmail(email, callbackUrl);
      setSent(true);
    } catch (err) {
      // 에러는 store에서 관리됨
      console.error("회원가입 이메일 발송 실패:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>

      {!sent ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "발송 중..." : "인증 이메일 발송"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="mb-4 text-green-600">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-xl font-bold mb-2">이메일을 확인해주세요!</h2>
            <p className="text-gray-600">
              <strong>{email}</strong>로 인증 링크를 발송했습니다.
            </p>
            <p className="text-gray-600 mt-2">
              이메일에서 링크를 클릭하여 회원가입을 완료해주세요.
            </p>
          </div>

          <button
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="text-blue-600 underline"
          >
            다른 이메일로 재발송
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 underline"
          >
            로그인하기
          </button>
        </p>
      </div>
    </div>
  );
}

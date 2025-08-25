"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth";
import dynamic from "next/dynamic";

const HonmoonSealed = dynamic(
  () =>
    import("../../features/honmoon/components/HonmoonSealed").then(
      (m) => m.default
    ),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const loginWithEmail = useAuthStore((s) => s.loginWithEmail);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBackdrop(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      // 로그인 성공 시 홈페이지로 이동
      router.replace("/");
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 애니메이션 */}
      {showBackdrop && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <HonmoonSealed autoplay={false} />
        </div>
      )}

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-50/80 z-10" />

      {/* 로그인 폼 */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* 로고/제목 영역 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white font-bold">🏛️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              환영합니다
            </h1>
            <p className="text-gray-600">혼문에서 새로운 여행을 시작하세요</p>
          </div>

          {/* 폼 카드 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  이메일 주소
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white/70"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white/70"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                계정이 없으신가요?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  회원가입하기
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

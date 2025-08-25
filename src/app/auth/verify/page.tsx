"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "store/auth";
import dynamic from "next/dynamic";

const HonmoonSealed = dynamic(
  () =>
    import("../../../features/honmoon/components/HonmoonSealed").then(
      (m) => m.default
    ),
  { ssr: false }
);

function VerifyContent() {
  const [token, setToken] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const verifySignup = useAuthStore((s) => s.verifySignup);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  useEffect(() => {
    // URL에서 토큰 파라미터 추출
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsTokenValid(true);
    } else {
      setIsTokenValid(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setShowBackdrop(true), 300);
    return () => clearTimeout(timer);
  }, []);

  /**
   * 닉네임 유효성 검사
   */
  const validateNickname = (value: string) => {
    if (value.includes(" ")) {
      setNicknameError("닉네임에는 띄어쓰기를 사용할 수 없습니다");
      return false;
    }
    if (value.length < 2) {
      setNicknameError("닉네임은 2자 이상이어야 합니다");
      return false;
    }
    if (value.length > 10) {
      setNicknameError("닉네임은 10자 이하여야 합니다");
      return false;
    }
    setNicknameError("");
    return true;
  };

  /**
   * 비밀번호 유효성 검사
   */
  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다");
      return false;
    }
    if (!/[a-zA-Z]/.test(value)) {
      setPasswordError("비밀번호에는 영어가 포함되어야 합니다");
      return false;
    }
    if (!/[0-9]/.test(value)) {
      setPasswordError("비밀번호에는 숫자가 포함되어야 합니다");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateNickname(nickname)) return;
    if (!validatePassword(password)) return;

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await verifySignup(token, nickname, password);
      // 회원가입 완료 후 메인 페이지로 이동
      router.replace("/");
    } catch (err) {
      console.error("회원가입 완료 실패:", err);
    }
  };

  if (isTokenValid === null) {
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

        <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">토큰을 확인하는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* 배경 애니메이션 */}
        {showBackdrop && (
          <div className="pointer-events-none fixed inset-0 z-0">
            <HonmoonSealed autoplay={false} />
          </div>
        )}

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-white/90 to-orange-50/80 z-10" />

        <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 text-center max-w-md w-full">
            <div className="text-red-600 mb-6">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-2">유효하지 않은 링크</h2>
              <p className="text-gray-600 mb-6">
                이 링크는 만료되었거나 유효하지 않습니다.
              </p>
            </div>

            <button
              onClick={() => router.push("/signup")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              회원가입 다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 애니메이션 */}
      {showBackdrop && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <HonmoonSealed autoplay={false} />
        </div>
      )}

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white/90 to-blue-50/80 z-10" />

      {/* 회원가입 완료 폼 */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* 제목 영역 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white font-bold">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              회원가입 완료
            </h1>
            <p className="text-gray-600">
              계정 설정을 완료하기 위해 닉네임과 비밀번호를 설정해주세요
            </p>
          </div>

          {/* 폼 카드 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nickname"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  닉네임 (띄어쓰기 불가)
                </label>
                <input
                  id="nickname"
                  type="text"
                  required
                  placeholder="사용할 닉네임을 입력해주세요"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    validateNickname(e.target.value);
                  }}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-all bg-white/70 ${
                    nicknameError
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                />
                {nicknameError && (
                  <p className="mt-1 text-sm text-red-600">{nicknameError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  비밀번호 (영어+숫자 포함 8자 이상)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="영어와 숫자를 포함한 8자 이상"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    className={`w-full border-2 rounded-xl px-4 py-3 pr-12 focus:outline-none transition-all bg-white/70 ${
                      passwordError
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full border-2 rounded-xl px-4 py-3 pr-12 focus:outline-none transition-all bg-white/70 ${
                      confirmPassword && password !== confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    비밀번호가 일치하지 않습니다
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !nickname ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword ||
                  !!nicknameError ||
                  !!passwordError
                }
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {loading ? "완료 중..." : "회원가입 완료"}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

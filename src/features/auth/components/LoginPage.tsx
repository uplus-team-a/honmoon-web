"use client";

import React, { useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { LoginFormData } from "../types";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { GoogleIcon } from "../../../shared/components/ui/google-icon";
import { GithubIcon } from "../../../shared/components/ui/github-icon";

/**
 * 로그인 페이지 컴포넌트 속성
 */
interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 로그인 페이지 컴포넌트
 *
 * 사용자가 이메일/비밀번호 또는 소셜 계정으로 로그인할 수 있는 모달창을 제공합니다.
 */
export const LoginPage: React.FC<LoginPageProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: 실제 로그인 API 호출
      console.log("로그인 시도:", formData);

      // 임시로 성공 처리
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("로그인 성공!");
      onClose();
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    // TODO: 실제 소셜 로그인 API 호출
    alert(`${provider} 로그인은 준비 중입니다.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">로그인</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-gray-50"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-gray-50"
              placeholder="비밀번호를 입력하세요"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-base py-3 font-semibold"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </div>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">
            또는
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full text-base py-3 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
            onClick={() => handleSocialLogin("google")}
          >
            <GoogleIcon className="h-6 w-6" />
            <span className="text-gray-700 font-medium">Google 계정으로 로그인</span>
          </Button>
          <Button
            variant="outline"
            className="w-full text-base py-3 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
            onClick={() => handleSocialLogin("github")}
          >
            <GithubIcon className="h-6 w-6 text-black" />
            <span className="text-gray-700 font-medium">GitHub 계정으로 로그인</span>
          </Button>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            onClick={() => {
              // TODO: 회원가입 페이지로 이동
              alert("회원가입 기능은 준비 중입니다.");
            }}
          >
            계정이 없으신가요? 회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
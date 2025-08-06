"use client";

import React, { useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { LoginPage } from "./LoginPage";

/**
 * 로그인 버튼 컴포넌트
 *
 * 오른쪽 상단에 표시되며, 클릭 시 로그인 모달을 열어줍니다.
 */
export const LoginButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLoginClick}
          className="px-5 py-2.5 text-sm font-semibold text-gray-800 hover:text-white hover:bg-blue-600 rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
          style={{
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          로그인
        </button>
        <div className="w-px h-5 bg-gray-200"></div>
        <button
          onClick={() => {
            // TODO: 회원가입 모달 또는 페이지로 이동
            alert("회원가입 기능은 준비 중입니다.");
          }}
          className="px-5 py-2.5 text-sm font-semibold text-gray-800 hover:text-white hover:bg-blue-600 rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
          style={{
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          회원가입
        </button>
      </div>

      <LoginPage isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default LoginButton;

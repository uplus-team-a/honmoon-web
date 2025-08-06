/**
 * 사용자 프로필 페이지 컴포넌트
 */
"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 헤더 */}
      <h1 className="text-2xl font-bold mb-6">프로필 및 활동내역</h1>

      {/* 유저 프로필 카드 */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-xl p-4 mb-8 border">
        <div className="flex items-center gap-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgorcLvoZtje4lJsMPMrMWfKLkWnB1EGmETQ&s"
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <div className="font-bold text-lg">Lee lee</div>
            <div className="text-sm text-gray-600">lee@gmail.com</div>
            <div className="text-purple-600 text-sm mt-1">
              7/13 스탬프 · 2,450 포인트 · Top 5% of K-pop Explorers
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/editProfile">
            <button className="border rounded px-4 py-1 text-sm">
              프로필 관리
            </button>
          </Link>
          <button className="border rounded px-4 py-1 text-sm">로그아웃</button>
        </div>
      </div>
    </div>
  );
}

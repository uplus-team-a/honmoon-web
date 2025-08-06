"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

export default function EditProfilePage() {
  const [selectedMenu, setSelectedMenu] = useState<
    "info" | "password" | "withdraw"
  >("info");
  const [nickname, setNickname] = useState("기본 닉네임");
  const [profileImage, setProfileImage] = useState(
    "/images/default-profile.png"
  );

  // 프로필 이미지 업로드 핸들러
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // base64로 미리보기
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* 프로필 이미지 및 닉네임 */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={profileImage}
            alt="프로필 이미지"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <p className="text-lg font-semibold">{nickname}</p>

        {/* 프로필 이미지 / 닉네임 변경 버튼 */}
        <div className="flex gap-2 mt-2">
          {/* 프로필 이미지 변경 버튼 */}
          <label className="px-3 py-1 border rounded text-sm cursor-pointer">
            이미지 변경
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <button className="px-3 py-1 border rounded text-sm">
            닉네임 변경
          </button>
        </div>
      </div>

      {/* 메뉴 버튼 (가로 일렬) */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className={`px-4 py-2 rounded border text-sm ${
            selectedMenu === "info"
              ? "bg-black text-white"
              : "border-gray-300 text-gray-700"
          }`}
          onClick={() => setSelectedMenu("info")}
        >
          회원정보 수정
        </button>
        <button
          className={`px-4 py-2 rounded border text-sm ${
            selectedMenu === "password"
              ? "bg-black text-white"
              : "border-gray-300 text-gray-700"
          }`}
          onClick={() => setSelectedMenu("password")}
        >
          비밀번호 변경
        </button>
        <button
          className={`px-4 py-2 rounded border text-sm ${
            selectedMenu === "withdraw"
              ? "bg-black text-white"
              : "border-gray-300 text-gray-700"
          }`}
          onClick={() => setSelectedMenu("withdraw")}
        >
          회원탈퇴
        </button>
      </div>

      {/* 선택된 메뉴에 따라 내용 표시 */}
      <div className="mt-6">
        {selectedMenu === "info" && (
          <div>
            <p className="text-sm text-gray-600">
              이메일, 전화번호 등 회원 정보를 수정할 수 있습니다.
            </p>
          </div>
        )}
        {selectedMenu === "password" && (
          <div>
            <p className="text-sm text-gray-600">
              현재 비밀번호 확인 후 새 비밀번호로 변경합니다.
            </p>
          </div>
        )}
        {selectedMenu === "withdraw" && (
          <div>
            <p className="text-sm text-red-600">
              회원 탈퇴 시 복구가 불가능합니다. 정말로 탈퇴하시겠습니까?
            </p>
            <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded">
              회원 탈퇴
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { apiFetch } from "../../lib/apiClient";
import { Button } from "../../shared/components/ui/button";
import { updateMyProfilePut } from "../../services/userService";
import {
  getImageUploadUrl,
  uploadImageToPresignedUrl,
} from "../../services/uploadService";

interface ProfileDetailResponse {
  profile: {
    id: string;
    email: string;
    nickname: string;
    totalPoints: number;
    totalActivities: number;
    profileImageUrl: string;
    isActive: boolean;
    createdAt: string;
    modifiedAt: string;
  };
  pointsSummary: {
    currentPoints: number;
    totalEarned: number;
    totalUsed: number;
  };
  activities: Array<{
    id: number;
    userId: string;
    placeId: number;
    missionId: number;
    description?: string;
    isCorrect: boolean;
    isCompleted: boolean;
    pointsEarned: number;
    textAnswer?: string;
    selectedChoiceIndex?: number;
    uploadedImageUrl?: string;
    createdAt: string;
    modifiedAt: string;
    aiResult?: string;
    alreadyExists: boolean;
  }>;
  pointHistory: Array<{
    id: number;
    userId: string;
    points: number;
    description: string;
    createdAt: string;
    modifiedAt: string;
  }>;
}

export default function MyProfileRoute() {
  const token = useAuthStore((s) => s.token);
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    let cancelled = false;
    const fetchProfileData = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiFetch<{ data: ProfileDetailResponse }>(
          "/api/users/me/profile/detail",
          { method: "GET", withAuth: true }
        );

        if (!cancelled) {
          setProfileData(response.data);
        }
      } catch (err) {
        console.error("프로필 데이터 로딩 실패:", err);
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "프로필 조회에 실패했습니다."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // 편집 모드 시작
  const startEditing = () => {
    if (profileData) {
      setEditNickname(profileData.profile.nickname);
      setEditImageUrl(profileData.profile.profileImageUrl);
      setIsEditing(true);
      setEditMessage("");
    }
  };

  // 편집 취소
  const cancelEditing = () => {
    setIsEditing(false);
    setEditNickname("");
    setEditImageUrl("");
    setEditMessage("");
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setEditMessage("");

    try {
      // 업로드 URL 생성
      const uploadInfo = await getImageUploadUrl(file.type);

      // 이미지 업로드
      await uploadImageToPresignedUrl(uploadInfo.uploadUrl, file);

      // 업로드된 이미지 URL 설정
      setEditImageUrl(uploadInfo.publicUrl);
      setEditMessage("✅ 이미지 업로드 완료!");
    } catch (error) {
      console.error("Image upload failed:", error);
      setEditMessage(
        `❌ 업로드 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  // 프로필 저장
  const saveProfile = async () => {
    if (!profileData) return;

    setIsSaving(true);
    setEditMessage("");

    try {
      const updatedProfile = await updateMyProfilePut({
        nickname: editNickname.trim(),
        profileImageUrl: editImageUrl,
      });

      // 로컬 데이터 업데이트
      setProfileData({
        ...profileData,
        profile: {
          ...profileData.profile,
          nickname: updatedProfile.nickname || editNickname.trim(),
          profileImageUrl: updatedProfile.profileImageUrl || editImageUrl,
        },
      });

      setIsEditing(false);
      setEditMessage("✅ 프로필이 성공적으로 업데이트되었습니다!");

      // 3초 후 메시지 제거
      setTimeout(() => setEditMessage(""), 3000);
    } catch (error) {
      console.error("Profile update failed:", error);
      setEditMessage(
        `❌ 저장 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">로그인이 필요합니다</h3>
            <p className="text-sm text-red-600 mb-4">
              프로필을 보려면 먼저 로그인해주세요.
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인하러 가기
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">프로필 조회 실패</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          프로필 데이터를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const { profile, pointsSummary, activities, pointHistory } = profileData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 편집 결과 메시지 */}
      {editMessage && (
        <div
          className={`p-4 rounded-lg text-center ${
            editMessage.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {editMessage}
        </div>
      )}

      {/* 프로필 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* 프로필 이미지 */}
            <div className="relative">
              <img
                src={
                  isEditing && editImageUrl
                    ? editImageUrl
                    : profile.profileImageUrl ||
                      "https://via.placeholder.com/80x80"
                }
                alt="프로필 이미지"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <label className="absolute inset-0 w-20 h-20 rounded-full bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          setEditMessage(
                            "❌ 파일 크기는 10MB 이하여야 합니다."
                          );
                          return;
                        }
                        handleImageUpload(file);
                      }
                    }}
                  />
                </label>
              )}
              {isUploading && (
                <div className="absolute inset-0 w-20 h-20 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="text-2xl font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-1 w-full max-w-xs"
                    placeholder="닉네임 입력"
                  />
                </div>
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.nickname}
                </h1>
              )}
              <p className="text-gray-600 text-sm mb-2">{profile.email}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  총 활동: {profile.totalActivities}회
                </span>
                <span className="text-gray-500">
                  가입일: {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* 편집 버튼 */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={cancelEditing}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  취소
                </Button>
                <Button
                  onClick={saveProfile}
                  disabled={isSaving || !editNickname.trim()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving ? "저장 중..." : "저장"}
                </Button>
              </>
            ) : (
              <Button
                onClick={startEditing}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                편집
              </Button>
            )}
          </div>
        </div>

        {/* 편집 모드 안내 */}
        {isEditing && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-700">
              💡 <strong>편집 모드</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>
                  • 프로필 이미지를 클릭하여 새 이미지를 업로드하세요 (최대
                  10MB)
                </li>
                <li>• 닉네임을 수정하고 저장 버튼을 클릭하세요</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 포인트 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {pointsSummary.currentPoints.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">현재 보유 포인트</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-green-600 mb-1">
            +{pointsSummary.totalEarned.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">총 적립 포인트</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl mb-2">📉</div>
          <div className="text-2xl font-bold text-red-600 mb-1">
            -{pointsSummary.totalUsed.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">총 사용 포인트</div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          최근 미션 활동
        </h2>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      미션 #{activity.missionId} - 장소 #{activity.placeId}
                    </div>
                    <div className="text-sm text-gray-600">
                      {activity.isCorrect ? "✅ 정답" : "❌ 오답"} •{" "}
                      {activity.pointsEarned} 포인트
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            아직 완료한 미션이 없습니다.
          </div>
        )}
      </div>

      {/* 포인트 히스토리 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          포인트 내역
        </h2>
        {pointHistory.length > 0 ? (
          <div className="space-y-3">
            {pointHistory.slice(0, 10).map((history) => (
              <div
                key={history.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl ${
                      history.points > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {history.points > 0 ? "+" : ""}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {history.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(history.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-lg font-bold ${
                    history.points > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {history.points > 0 ? "+" : ""}
                  {history.points.toLocaleString()} P
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            포인트 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

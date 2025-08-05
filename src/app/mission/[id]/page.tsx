"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import markers from "../../../features/map/data/markers";
import { Button } from "../../../shared/components/ui/button";
import { MarkerImage } from "../../../shared/components/ui/marker-image";
import { ArrowLeft, MapPin, Calendar, Star, Trophy } from "lucide-react";

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const markerId = Number(params.id);

  const marker = markers.find((m) => m.id === markerId);

  if (!marker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            마커를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">
            요청하신 마커 정보가 존재하지 않습니다.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">미션 상세</h1>
          <div className="w-9" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-md mx-auto bg-white">
        {/* 이미지 섹션 */}
        <div className="relative">
          <MarkerImage
            src={marker.image}
            alt={marker.title}
            width="w-full"
            height="h-64"
            shape="rounded"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
            미션 #{marker.id}
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {marker.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {marker.description}
            </p>
          </div>

          {/* 위치 정보 */}
          <div className="flex items-center mb-4 p-4 bg-gray-50 rounded-xl">
            <MapPin className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">위치</div>
              <div className="text-sm text-gray-600">
                위도: {marker.lat.toFixed(6)}, 경도: {marker.lng.toFixed(6)}
              </div>
            </div>
          </div>

          {/* 미션 정보 */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center p-4 bg-blue-50 rounded-xl">
              <Trophy className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-900">미션 목표</div>
                <div className="text-sm text-blue-700">
                  이 장소에서 사진을 찍고 인증하세요
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-xl">
              <Star className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-green-900">보상</div>
                <div className="text-sm text-green-700">
                  스탬프 1개 + 경험치 100점
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-orange-50 rounded-xl">
              <Calendar className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-orange-900">완료일</div>
                <div className="text-sm text-orange-700">2023.11.01</div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 text-base font-medium"
              onClick={() => {
                // 지도 페이지로 이동하면서 해당 마커로 포커스
                router.push(`/?focus=${marker.id}`);
              }}
            >
              지도에서 보기
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium"
              onClick={() => {
                // 미션 완료 처리 로직
                alert("미션 완료 처리 기능은 추후 구현 예정입니다.");
              }}
            >
              미션 완료하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

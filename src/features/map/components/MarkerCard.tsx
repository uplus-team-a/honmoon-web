"use client";

import React from "react";
import { Marker } from "../data/markers";
import { EyeIcon } from "../../../shared/components/ui";
import { MarkerImage } from "../../../shared/components/ui/marker-image";
import { Button } from "../../../shared/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * 개별 마커 정보를 카드 형태로 표시하는 컴포넌트
 *
 * 마커의 이미지, 제목, 설명을 카드 형태로 표시하고, 활성화 상태와 표시 여부를 시각적으로 나타냅니다.
 * 카드 클릭 시 지도에서 해당 마커로 이동하며, 토글 버튼으로 마커의 표시 여부를 제어할 수 있습니다.
 *
 * @param marker - 마커 데이터
 * @param onClick - 카드 클릭 시 실행할 함수
 * @param isActive - 마커 활성화 여부
 * @param isVisible - 마커 표시 여부
 * @param onToggleVisibility - 마커 표시 여부 토글 시 실행할 함수
 */
interface MarkerCardProps {
  marker: Marker;
  onClick: () => void;
  isActive?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

const InnerMarkerCard: React.FC<MarkerCardProps> = ({
  marker,
  onClick,
  isActive = false,
  isVisible = true,
  onToggleVisibility,
}) => {
  const { title, image, description, source, missions } = marker;

  const renderMissionIcon = (missionType?: string) => {
    switch (missionType) {
      case "QUIZ_MULTIPLE_CHOICE":
        return "📝";
      case "QUIZ_TEXT_INPUT":
        return "✍️";
      case "QUIZ_IMAGE_UPLOAD":
        return "🖼️";
      case "PLACE_VISIT":
        return "📍";
      case "PHOTO_UPLOAD":
        return "📸";
      case "SURVEY":
        return "📊";
      default:
        return "🎯";
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility?.();
  };

  return (
    <div
      className={`group flex flex-col rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1.5 duration-200 ${
        isActive ? "ring-2 ring-primary shadow-lg" : ""
      } ${!isVisible ? "opacity-60" : ""} ${
        source === "kakao" ? "bg-neutral-50 opacity-95" : "bg-white"
      }`}
      onClick={onClick}
    >
      <div className="relative w-full h-[200px]">
        <MarkerImage
          src={image}
          alt={title}
          priority={isActive}
          width="w-full"
          height="h-full"
          shape="rounded"
        />
        {onToggleVisibility && (
          <button
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              isVisible
                ? "bg-white text-primary hover:bg-gray-50"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            }`}
            onClick={handleToggleClick}
            title={isVisible ? "마커 숨기기" : "마커 표시하기"}
            aria-label={isVisible ? "마커 숨기기" : "마커 표시하기"}
          >
            <EyeIcon visible={isVisible} />
          </button>
        )}
        {isActive && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs py-1 px-2 rounded-full font-medium">
            현재 선택됨
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start">
            {title && (
              <h3
                className="text-xl font-extrabold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent tracking-tight"
                title={title}
              >
                {title}
              </h3>
            )}
          </div>
          <p className="text-[13px] text-gray-600 mt-2 line-clamp-2">
            {description ?? "설명이 없습니다."}
          </p>
          {/* 지도 마커에 위경도 노출, 카드에선 비표시 */}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* 미션 안내 영역 */}
          <div className="text-[12px] text-neutral-700">
            {source === "kakao" ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700">
                <span className="inline-block w-2 h-2 rounded-full bg-neutral-400" />
                미션 준비 중
              </div>
            ) : missions && missions.length > 0 ? (
              <div className="flex items-center gap-2 max-w-full overflow-hidden">
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  미션 {missions.length}개
                </span>
                <div className="flex items-center gap-1.5">
                  {missions.slice(0, 6).map((m) => (
                    <span
                      key={m.id}
                      title={m.title}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 text-neutral-800 border border-neutral-200 shadow-sm"
                    >
                      {renderMissionIcon(m.missionType)}
                    </span>
                  ))}
                  {missions.length > 6 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-neutral-50 text-neutral-600 border border-neutral-200">
                      +{missions.length - 6}
                    </span>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {source === "api" ? (
            <Button
              size="sm"
              variant="outline"
              className="h-9 px-3 text-sm border-neutral-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all rounded-lg ring-1 ring-transparent hover:ring-neutral-200"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/mission/place/${marker.id}`;
              }}
            >
              <ArrowRight className="w-5 h-5 mr-1" />
              상세보기
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const MarkerCard = React.memo(InnerMarkerCard);

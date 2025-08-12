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
  const { title, image, description, missionsCount, source, missions } = marker;

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility?.();
  };

  return (
    <div
      className={`group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 duration-200 ${
        isActive ? "ring-2 ring-primary shadow-lg" : ""
      } ${!isVisible ? "opacity-60" : ""} ${
        source === "kakao" ? "bg-neutral-50 opacity-95" : "bg-white"
      }`}
      onClick={onClick}
    >
      <div className="relative w-full h-[160px]">
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
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start">
            {title && (
              <h3
                className="text-lg font-extrabold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent"
                title={title}
              >
                {title}
              </h3>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {description ?? "설명이 없습니다."}
          </p>
          {/* 지도 마커에 위경도 노출, 카드에선 비표시 */}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          {/* 미션 목록(간략) */}
          <div className="text-[11px] text-neutral-600">
            {source === "kakao" ? (
              <span>아직 미션이 등록되지 않았어요.</span>
            ) : missions && missions.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                {missions.slice(0, 3).map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center bg-neutral-100 px-2 py-0.5 rounded-full"
                  >
                    {m.title}
                  </span>
                ))}
                {missions.length > 3 && (
                  <span className="text-neutral-500 ml-1">
                    외 {missions.length - 3}개
                  </span>
                )}
              </div>
            ) : null}
          </div>

          {source === "api" ? (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                if (marker.primaryMissionId) {
                  window.location.href = `/mission/${marker.primaryMissionId}`;
                } else {
                  window.location.href = "/my-profile";
                }
              }}
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              상세보기
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const MarkerCard = React.memo(InnerMarkerCard);

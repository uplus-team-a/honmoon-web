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

export const MarkerCard: React.FC<MarkerCardProps> = ({
  marker,
  onClick,
  isActive = false,
  isVisible = true,
  onToggleVisibility,
}) => {
  const { title, image, description } = marker;

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility?.();
  };

  return (
    <div
      className={`group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all bg-white cursor-pointer transform hover:-translate-y-1 duration-200 ${
        isActive ? "ring-2 ring-primary shadow-lg" : ""
      } ${!isVisible ? "opacity-60" : ""}`}
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
            <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {description ?? "설명이 없습니다."}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-primary font-medium flex items-center">
            <span className="mr-2 flex items-center justify-center w-5 h-5 bg-primary/10 rounded-full">
              <span className="text-primary text-xs">✓</span>
            </span>
            <span>스탬프 획득 (2023.11.01)</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/mission/${marker.id}`;
            }}
          >
            <ArrowRight className="w-3 h-3 mr-1" />
            상세보기
          </Button>
        </div>
      </div>
    </div>
  );
};

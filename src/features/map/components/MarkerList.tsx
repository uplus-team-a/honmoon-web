"use client";

import React from "react";
import { Marker } from "../data/markers";
import { MarkerCard } from "./MarkerCard";

/**
 * 여러 마커 정보를 리스트로 표시하는 컴포넌트
 *
 * 마커 데이터를 카드 형태로 표시하고, 마커 클릭, 활성화 상태, 표시 여부 등을 관리합니다.
 *
 * @param markers - 마커 데이터 배열
 * @param onMarkerClick - 마커 카드 클릭 시 실행할 함수
 * @param activeMarkerIndex - 현재 활성화된 마커의 인덱스
 * @param visibleMarkers - 현재 표시 중인 마커 인덱스 배열
 * @param onToggleVisibility - 마커 표시 여부 토글 시 실행할 함수
 * @param onRedrawMarkers - 마커 다시 그리기 시 실행할 함수
 */
interface MarkerListProps {
  markers: Marker[];
  onMarkerClick: (index: number) => void;
  activeMarkerIndex?: number | null;
  visibleMarkers?: number[];
  onToggleVisibility?: (index: number) => void;
  onRedrawMarkers?: () => void;
}

const InnerMarkerList: React.FC<MarkerListProps> = ({
  markers,
  onMarkerClick,
  activeMarkerIndex = null,
  visibleMarkers = [],
  onToggleVisibility,
  onRedrawMarkers,
}) => {
  const sortedEntries = React.useMemo(() => {
    return markers
      .map((m, i) => ({ marker: m, originalIndex: i }))
      .sort((a, b) => {
        const aHas = (a.marker?.missionsCount ?? 0) > 0 ? 1 : 0;
        const bHas = (b.marker?.missionsCount ?? 0) > 0 ? 1 : 0;
        if (aHas !== bHas) return bHas - aHas; // 미션 있는 장소 우선
        const aTitle = (a.marker?.title ?? "").toString();
        const bTitle = (b.marker?.title ?? "").toString();
        return aTitle.localeCompare(bTitle);
      });
  }, [markers]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">장소 목록</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm px-3 py-1.5 bg-gray-100 rounded-full text-gray-600 font-medium">
            {visibleMarkers.length === markers.length
              ? "모든 장소 표시 중"
              : `${visibleMarkers.length}/${markers.length} 장소 표시 중`}
          </div>
          {onRedrawMarkers && (
            <button
              onClick={onRedrawMarkers}
              className="text-sm px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors"
            >
              마커 새로고침
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedEntries.map(({ marker, originalIndex }) => (
          <MarkerCard
            key={marker.id}
            marker={marker}
            onClick={() => onMarkerClick(originalIndex)}
            isActive={activeMarkerIndex === originalIndex}
            isVisible={visibleMarkers.includes(originalIndex)}
            onToggleVisibility={
              onToggleVisibility
                ? () => onToggleVisibility(originalIndex)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export const MarkerList = React.memo(InnerMarkerList);

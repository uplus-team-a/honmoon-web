"use client";

import React, { useState, useCallback, useEffect } from "react";
import markers from "../data/markers";
import { useKakaoMap, useKakaoMarkers } from "../hooks";
import { MarkerList } from "./MarkerList";

/**
 * 카카오 맵과 마커 리스트를 함께 표시하는 컴포넌트
 *
 * 지도와 마커 리스트를 함께 표시하며, 마커 카드 클릭 시 해당 위치로 지도 중심이 이동합니다.
 * 지도에서 마커를 클릭하거나 마커 위에 마우스를 올리면 인포윈도우가 표시됩니다.
 */
interface MapWithMarkersProps {
  focusMarkerId?: number;
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({ focusMarkerId }) => {
  // 첫 번째 마커의 위치를 초기 중심점으로 사용
  const initialLat = markers[0].lat;
  const initialLng = markers[0].lng;
  const [visibleMarkers, setVisibleMarkers] = useState<number[]>(
    markers.map((_, idx) => idx)
  );

  // 카카오 맵 초기화
  const { mapContainerRef, mapInstanceRef, isMapLoaded } = useKakaoMap(
    initialLat,
    initialLng,
    4 // 초기 줌 레벨
  );

  // 마커 관리
  const {
    handleMarkerFocus,
    setMarkerVisibility,
    redrawMarkers,
    activeMarkerIndex,
  } = useKakaoMarkers(mapInstanceRef, markers);

  // 지도가 로드되면 마커를 다시 그리기
  useEffect(() => {
    if (isMapLoaded) {
      // 지도 로드 후 약간의 지연을 두고 마커 다시 그리기
      const timer = setTimeout(() => {
        redrawMarkers();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isMapLoaded, redrawMarkers]);

  // focusMarkerId가 있으면 해당 마커에 포커스
  useEffect(() => {
    if (focusMarkerId && isMapLoaded) {
      const markerIndex = markers.findIndex(
        (marker) => marker.id === focusMarkerId
      );
      if (markerIndex !== -1) {
        // 약간의 지연을 두고 마커에 포커스
        const timer = setTimeout(() => {
          handleMarkerFocus(markerIndex);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [focusMarkerId, isMapLoaded, handleMarkerFocus]);

  /**
   * 마커 표시 여부를 토글하는 함수
   *
   * @param index - 마커 인덱스
   */
  const toggleMarkerVisibility = useCallback(
    (index: number) => {
      setVisibleMarkers((prev) => {
        if (prev.includes(index)) {
          setMarkerVisibility(index, false);
          return prev.filter((idx) => idx !== index);
        } else {
          setMarkerVisibility(index, true);
          return [...prev, index];
        }
      });
    },
    [setMarkerVisibility]
  );

  return (
    <div className="flex flex-col gap-8 p-6 max-w-[1600px] mx-auto">
      <div className="relative">
        <div
          ref={mapContainerRef}
          className="w-full h-[550px] rounded-2xl shadow-md bg-white overflow-hidden"
        />
        <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-lg text-sm">
          <div className="font-semibold mb-1 text-gray-900">
            총 {markers.length}개 장소
          </div>
          <div className="text-xs text-gray-500">
            표시 중: {visibleMarkers.length}개
          </div>
        </div>
      </div>
      <MarkerList
        markers={markers}
        onMarkerClick={handleMarkerFocus}
        activeMarkerIndex={activeMarkerIndex}
        visibleMarkers={visibleMarkers}
        onToggleVisibility={toggleMarkerVisibility}
        onRedrawMarkers={redrawMarkers}
      />
    </div>
  );
};

export default MapWithMarkers;

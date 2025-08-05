"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { KakaoInfoWindow, KakaoMap, KakaoMarker } from "../types";
import { Marker } from "../data/markers";
import {
  createKakaoMarkerSVG,
  KakaoMarkerStyle,
} from "../../../shared/components/ui/marker-image";

/**
 * 카카오 맵에 마커를 생성하고 관리하는 훅
 *
 * 지도에 마커를 표시하고, 마커 클릭 및 호버 이벤트를 처리합니다.
 * 마커 클릭 시 해당 위치로 지도 중심이 이동하고 인포윈도우가 표시됩니다.
 *
 * @param mapInstance - 카카오 맵 인스턴스 참조
 * @param markers - 마커 데이터 배열
 * @returns 마커 참조 배열과 마커 관련 함수들
 */
export const useKakaoMarkers = (
  mapInstance: React.RefObject<KakaoMap | null>,
  markers: Marker[]
) => {
  const markerRefs = useRef<KakaoMarker[]>([]);
  const infoWindowRefs = useRef<KakaoInfoWindow[]>([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState<number | null>(null);

  /**
   * 마커 이미지를 생성하는 함수
   *
   * @param imageUrl - 마커 이미지 URL (없으면 기본 이미지 사용)
   * @param markerStyle - 마커 스타일 옵션
   * @returns 카카오 마커 이미지 객체
   */
  const createMarkerImage = useCallback(
    (imageUrl?: string, markerStyle?: KakaoMarkerStyle) => {
      // 기본 마커 설정
      const imageSize = new window.kakao.maps.Size(40, 42); // 그림자 포함 높이
      const imageOption = { offset: new window.kakao.maps.Point(20, 20) };

      // 마커 스타일 결정
      const style: KakaoMarkerStyle = {
        type: imageUrl ? "primary" : "accent",
        size: 40,
        hasShadow: true,
        hasBorder: true,
        ...markerStyle,
      };

      // SVG 데이터 URL 생성
      const svgDataUrl = createKakaoMarkerSVG(style);

      return new window.kakao.maps.MarkerImage(
        svgDataUrl,
        imageSize,
        imageOption
      );
    },
    []
  );

  /**
   * 인포윈도우 내용을 생성하는 함수
   *
   * @param title - 마커 제목
   * @param description - 마커 설명 (선택적)
   * @param imageUrl - 마커 이미지 URL (선택적)
   * @param markerId - 마커 ID
   * @returns 인포윈도우 HTML 내용
   */
  const createInfoWindowContent = useCallback(
    (
      title: string,
      description?: string,
      imageUrl?: string,
      markerId?: number
    ) => {
      return `
            <div class="p-2 max-w-[200px]">
                ${
                  imageUrl
                    ? `<div class="mb-2" style="width: 80px; height: 80px; margin: 0 auto;">
                    <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; position: relative;">
                        <img src="${imageUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;"/>
                    </div>
                </div>`
                    : ""
                }
                <div class="font-bold text-sm mb-1 text-center">${title}</div>
                ${
                  description
                    ? `<div class="text-xs text-gray-600 mb-2">${description}</div>`
                    : ""
                }
                ${
                  markerId
                    ? `<div class="text-center">
                        <button 
                          onclick="window.location.href='/mission/${markerId}'"
                          style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            padding: 6px 12px;
                            font-size: 11px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                          "
                          onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'"
                          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
                        >
                          🎯 미션 보기
                        </button>
                      </div>`
                    : ""
                }
            </div>
        `;
    },
    []
  );

  /**
   * 모든 인포윈도우를 닫는 함수
   */
  const closeAllInfoWindows = useCallback(() => {
    infoWindowRefs.current.forEach((infoWindow) => {
      infoWindow.close();
    });
    setActiveInfoWindow(null);
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !window.kakao || !window.kakao.maps) return;

    // 기존 마커 및 인포윈도우 제거
    markerRefs.current.forEach((marker) => {
      marker.setMap(null);
    });
    infoWindowRefs.current.forEach((infoWindow) => {
      infoWindow.close();
    });

    markerRefs.current = [];
    infoWindowRefs.current = [];

    // 마커 생성
    markers.forEach(
      ({ id, title, lat, lng, image, description, markerStyle }, index) => {
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const markerImage = createMarkerImage(image, markerStyle);

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: mapInstance.current!,
          title,
          image: markerImage,
          clickable: true,
        });

        // 마커가 지도에 제대로 표시되는지 확인
        marker.setMap(mapInstance.current!);
        markerRefs.current.push(marker);

        // 인포윈도우 생성
        const infoWindowContent = createInfoWindowContent(
          title,
          description,
          image,
          id
        );
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoWindowContent,
          removable: true,
        });
        infoWindowRefs.current.push(infoWindow);

        // 마커 이벤트 리스너 등록
        window.kakao.maps.event.addListener(marker, "click", () => {
          setActiveInfoWindow((prevActive) => {
            // 이전에 활성화된 인포윈도우가 있으면 닫기
            if (prevActive !== null && prevActive !== index) {
              infoWindowRefs.current[prevActive].close();
            }

            // 인포윈도우 토글
            if (prevActive === index) {
              infoWindow.close();
              return null;
            } else {
              infoWindow.open(mapInstance.current!, marker);
              // 지도 중심을 마커 위치로 부드럽게 이동
              mapInstance.current!.panTo(markerPosition);
              return index;
            }
          });
        });

        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          setActiveInfoWindow((prevActive) => {
            if (prevActive !== index) {
              infoWindow.open(mapInstance.current!, marker);
            }
            return prevActive;
          });
        });

        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          setActiveInfoWindow((prevActive) => {
            if (prevActive !== index) {
              infoWindow.close();
            }
            return prevActive;
          });
        });
      }
    );

    // 지도 클릭 시 모든 인포윈도우 닫기
    if (mapInstance.current) {
      window.kakao.maps.event.addListener(
        mapInstance.current,
        "click",
        closeAllInfoWindows
      );
    }

    return () => {
      // 컴포넌트 언마운트 시 마커와 이벤트 리스너 제거
      if (mapInstance.current) {
        window.kakao.maps.event.removeListener(
          mapInstance.current,
          "click",
          closeAllInfoWindows
        );
      }

      markerRefs.current.forEach((marker) => {
        marker.setMap(null);
      });
      infoWindowRefs.current.forEach((infoWindow) => {
        infoWindow.close();
      });
    };
  }, [mapInstance, markers, createMarkerImage, createInfoWindowContent]);

  /**
   * 특정 마커로 지도 중심을 이동시키고 인포윈도우를 표시하는 함수
   *
   * @param index - 마커 인덱스
   */
  const handleMarkerFocus = useCallback(
    (index: number) => {
      const marker = markerRefs.current[index];
      if (marker && mapInstance.current) {
        setActiveInfoWindow((prevActive) => {
          // 이전에 활성화된 인포윈도우가 있으면 닫기
          if (prevActive !== null && prevActive !== index) {
            infoWindowRefs.current[prevActive].close();
          }

          // 지도 중심을 부드럽게 이동 및 줌 레벨 설정
          mapInstance.current!.panTo(marker.getPosition());
          mapInstance.current!.setLevel(3); // 더 가까운 줌 레벨로 설정

          // 인포윈도우 열기
          infoWindowRefs.current[index].open(mapInstance.current!, marker);

          return index;
        });
      }
    },
    [mapInstance]
  );

  /**
   * 특정 마커의 표시 여부를 설정하는 함수
   *
   * @param index - 마커 인덱스
   * @param visible - 표시 여부
   */
  const setMarkerVisibility = useCallback(
    (index: number, visible: boolean) => {
      const marker = markerRefs.current[index];
      if (marker) {
        if (visible) {
          marker.setMap(mapInstance.current);
        } else {
          marker.setMap(null);

          // 숨기는 마커에 인포윈도우가 열려있으면 닫기
          setActiveInfoWindow((prevActive) => {
            if (prevActive === index) {
              infoWindowRefs.current[index].close();
              return null;
            }
            return prevActive;
          });
        }
      }
    },
    [mapInstance]
  );

  /**
   * 모든 마커를 다시 그리는 함수
   * 새로고침 후 마커가 안 보일 때 사용
   */
  const redrawMarkers = useCallback(() => {
    if (!mapInstance.current || !window.kakao || !window.kakao.maps) return;

    // 기존 마커 및 인포윈도우 제거
    markerRefs.current.forEach((marker) => {
      marker.setMap(null);
    });
    infoWindowRefs.current.forEach((infoWindow) => {
      infoWindow.close();
    });

    markerRefs.current = [];
    infoWindowRefs.current = [];

    // 마커 다시 생성
    markers.forEach(
      ({ id, title, lat, lng, image, description, markerStyle }, index) => {
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const markerImage = createMarkerImage(image, markerStyle);

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: mapInstance.current!,
          title,
          image: markerImage,
          clickable: true,
        });

        // 마커가 지도에 제대로 표시되는지 확인
        marker.setMap(mapInstance.current!);
        markerRefs.current.push(marker);

        // 인포윈도우 생성
        const infoWindowContent = createInfoWindowContent(
          title,
          description,
          image,
          id
        );
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoWindowContent,
          removable: true,
        });
        infoWindowRefs.current.push(infoWindow);

        // 마커 이벤트 리스너 등록
        window.kakao.maps.event.addListener(marker, "click", () => {
          setActiveInfoWindow((prevActive) => {
            // 이전에 활성화된 인포윈도우가 있으면 닫기
            if (prevActive !== null && prevActive !== index) {
              infoWindowRefs.current[prevActive].close();
            }

            // 인포윈도우 토글
            if (prevActive === index) {
              infoWindow.close();
              return null;
            } else {
              infoWindow.open(mapInstance.current!, marker);
              // 지도 중심을 마커 위치로 부드럽게 이동
              mapInstance.current!.panTo(markerPosition);
              return index;
            }
          });
        });

        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          setActiveInfoWindow((prevActive) => {
            if (prevActive !== index) {
              infoWindow.open(mapInstance.current!, marker);
            }
            return prevActive;
          });
        });

        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          setActiveInfoWindow((prevActive) => {
            if (prevActive !== index) {
              infoWindow.close();
            }
            return prevActive;
          });
        });
      }
    );

    // 지도 클릭 시 모든 인포윈도우 닫기
    if (mapInstance.current) {
      window.kakao.maps.event.addListener(
        mapInstance.current,
        "click",
        closeAllInfoWindows
      );
    }
  }, [
    mapInstance,
    markers,
    createMarkerImage,
    createInfoWindowContent,
    closeAllInfoWindows,
  ]);

  return {
    markerRefs,
    handleMarkerFocus,
    setMarkerVisibility,
    closeAllInfoWindows,
    redrawMarkers,
    activeMarkerIndex: activeInfoWindow,
  };
};

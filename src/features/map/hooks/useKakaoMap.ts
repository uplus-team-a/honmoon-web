"use client";

import { useEffect, useRef, useState } from "react";
import { KakaoMap } from "../types";

/**
 * 카카오 맵을 초기화하고 관리하는 훅
 *
 * 지도 컨테이너 참조와 지도 인스턴스 참조를 반환합니다.
 * 컴포넌트가 마운트될 때 카카오맵 SDK를 로드하고 지도를 초기화합니다.
 *
 * @param initialLat - 초기 위도
 * @param initialLng - 초기 경도
 * @param initialLevel - 초기 줌 레벨 (기본값: 5)
 * @returns 맵 컨테이너 ref와 맵 인스턴스 ref
 */
export const useKakaoMap = (
  initialLat: number,
  initialLng: number,
  initialLevel: number = 5
) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainerRef.current) return;

      const center = new window.kakao.maps.LatLng(initialLat, initialLng);
      const mapOptions = {
        center,
        level: initialLevel,
      };

      const map = new window.kakao.maps.Map(
        mapContainerRef.current,
        mapOptions
      );

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(
        mapTypeControl,
        window.kakao.maps.ControlPosition.TOPRIGHT
      );

      // 지도가 완전히 로드된 후에 인스턴스 설정
      window.kakao.maps.event.addListener(map, "tilesloaded", () => {
        mapInstanceRef.current = map;
        setIsMapLoaded(true);
      });

      // 백업으로 즉시 설정
      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    };

    const loadKakaoMapScript = () => {
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&autoload=false`;
        script.async = true;

        script.onload = () => {
          window.kakao.maps.load(initializeMap);
        };

        document.head.appendChild(script);
      } else if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initializeMap);
      }
    };

    loadKakaoMapScript();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [initialLat, initialLng, initialLevel]);

  return { mapContainerRef, mapInstanceRef, isMapLoaded };
};

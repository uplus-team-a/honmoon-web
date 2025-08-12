"use client";

import React, { useState, useCallback, useEffect } from "react";
import markers, { type Marker } from "../data/markers";

type MissionPlaceLike = {
  id: number;
  title?: string;
  name?: string;
  lat?: number;
  latitude?: number;
  lng?: number;
  longitude?: number;
  imageUrl?: string;
  image?: string;
  description?: string;
  location?: string;
};
import { useKakaoMap, useKakaoMarkers } from "../hooks";
import dynamic from "next/dynamic";
const MarkerList = dynamic(
  () => import("./MarkerList").then((m) => m.MarkerList),
  {
    ssr: false,
  }
);
import {
  fetchMissionPlaces,
  fetchMissionsByPlaceId,
  searchMissionPlaces,
} from "../../../services/missionService";

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
  const [remoteMarkers, setRemoteMarkers] = useState(markers);
  const DEFAULT_PLACE_IMAGE =
    "https://storage.googleapis.com/honmoon-bucket/image/honmmon.png";
  const initialLat = remoteMarkers[0]?.lat ?? 37.5665;
  const initialLng = remoteMarkers[0]?.lng ?? 126.978;
  const [visibleMarkers, setVisibleMarkers] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 카카오 맵 초기화
  const { mapContainerRef, mapInstanceRef, isMapLoaded, error } = useKakaoMap(
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
  } = useKakaoMarkers(mapInstanceRef, remoteMarkers);

  // 지도가 로드되면 마커를 다시 그리기
  useEffect(() => {
    if (isMapLoaded) {
      const timer = setTimeout(() => {
        redrawMarkers();
      }, 120);

      return () => clearTimeout(timer);
    }
  }, [isMapLoaded, redrawMarkers]);

  // focusMarkerId가 있으면 해당 마커에 포커스
  useEffect(() => {
    if (focusMarkerId && isMapLoaded) {
      const markerIndex = remoteMarkers.findIndex(
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
  }, [focusMarkerId, isMapLoaded, handleMarkerFocus, remoteMarkers]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const places = await fetchMissionPlaces();
        if (cancelled) return;
        const mapped = places.map((place) => {
          const p: MissionPlaceLike = place as unknown as MissionPlaceLike;
          const title: string = p.title ?? p.name ?? "";
          const lat: number = (p.lat ?? p.latitude)!;
          const lng: number = (p.lng ?? p.longitude)!;
          const image: string = p.imageUrl ?? p.image ?? DEFAULT_PLACE_IMAGE;
          const description: string = p.description ?? p.location ?? "";
          return {
            id: place.id,
            title,
            lat,
            lng,
            image,
            description,
            markerStyle: { type: "primary" as const },
            source: "api" as const,
          } as Marker;
        });
        setRemoteMarkers(mapped);
        setVisibleMarkers(mapped.map((_, idx) => idx));
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    <div className="relative z-10 flex flex-col gap-8 p-6 max-w-[1600px] mx-auto">
      <div className="hidden">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="장소 검색 (예: 한강)"
          className="flex-1 h-10 rounded-xl border border-neutral-300 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
        <button
          className="h-10 rounded-xl px-4 bg-neutral-900 text-white text-[14px] hover:bg-black disabled:opacity-60"
          disabled={isSearching}
          onClick={async () => {
            if (!query.trim()) return;
            if (!mapInstanceRef.current || !window.kakao?.maps?.services) {
              // Fallback: Kakao 서비스가 없을 때 서버 검색만 수행
              try {
                setIsSearching(true);
                const results = await searchMissionPlaces(query.trim());
                const apiMapped: Marker[] = await Promise.all(
                  results.map(async (placeLike) => {
                    const ap: MissionPlaceLike =
                      placeLike as unknown as MissionPlaceLike;
                    const title: string = ap.title ?? ap.name ?? "";
                    const lat: number = (ap.lat ?? ap.latitude)!;
                    const lng: number = (ap.lng ?? ap.longitude)!;
                    const image: string =
                      ap.imageUrl ?? ap.image ?? DEFAULT_PLACE_IMAGE;
                    const description: string =
                      ap.description ?? ap.location ?? "";
                    try {
                      const missions = await fetchMissionsByPlaceId(
                        placeLike.id
                      );
                      return {
                        id: placeLike.id,
                        title,
                        lat,
                        lng,
                        image,
                        description,
                        missionsCount: missions.length,
                        primaryMissionId: missions?.[0]?.id,
                        markerStyle: { type: "primary" as const },
                        source: "api" as const,
                        missions: missions
                          .slice(0, 5)
                          .map((m) => ({ id: m.id, title: m.title })),
                      } as Marker;
                    } catch {
                      return {
                        id: placeLike.id,
                        title,
                        lat,
                        lng,
                        image,
                        description,
                        missionsCount: 0,
                        primaryMissionId: undefined,
                        markerStyle: { type: "primary" as const },
                        source: "api" as const,
                        missions: [],
                      } as Marker;
                    }
                  })
                );
                const limited = apiMapped.slice(0, 8);
                setRemoteMarkers(limited);
                setVisibleMarkers(limited.map((_, idx) => idx));
                if (mapInstanceRef.current && limited[0]) {
                  const center = new window.kakao.maps.LatLng(
                    limited[0].lat,
                    limited[0].lng
                  );
                  mapInstanceRef.current.setCenter(center);
                  mapInstanceRef.current.setLevel(4);
                }
              } finally {
                setIsSearching(false);
              }
              return;
            }

            // Kakao Places 검색 사용: 항상 서버 mission_places 먼저, 부족하면 Kakao 결과를 이어붙임
            try {
              setIsSearching(true);
              const places = new window.kakao.maps.services.Places();
              const keyword = query.trim();

              // 1) 서버 mission_places 검색 (항상 먼저)
              const apiResults = await searchMissionPlaces(keyword);
              const apiMapped: Marker[] = await Promise.all(
                apiResults.map(async (placeLike) => {
                  const ap: MissionPlaceLike =
                    placeLike as unknown as MissionPlaceLike;
                  const title: string = ap.title ?? ap.name ?? "";
                  const lat: number = (ap.lat ?? ap.latitude)!;
                  const lng: number = (ap.lng ?? ap.longitude)!;
                  const image: string =
                    ap.imageUrl ?? ap.image ?? DEFAULT_PLACE_IMAGE;
                  const description: string =
                    ap.description ?? ap.location ?? "";
                  try {
                    const missions = await fetchMissionsByPlaceId(placeLike.id);
                    return {
                      id: placeLike.id,
                      title,
                      lat,
                      lng,
                      image,
                      description,
                      missionsCount: missions.length,
                      primaryMissionId: missions?.[0]?.id,
                      markerStyle: { type: "primary" as const },
                      source: "api" as const,
                    } as Marker;
                  } catch {
                    return {
                      id: placeLike.id,
                      title,
                      lat,
                      lng,
                      image,
                      description,
                      missionsCount: 0,
                      primaryMissionId: undefined,
                      markerStyle: { type: "primary" as const },
                      source: "api" as const,
                    } as Marker;
                  }
                })
              );

              let merged: Marker[] = [...apiMapped];
              if (merged.length < 8) {
                const kakaoMapped: Marker[] = await new Promise(
                  (resolve: (value: Marker[]) => void) => {
                    places.keywordSearch(keyword, async (data, status) => {
                      if (status !== "OK" || !data?.length) {
                        resolve([] as Marker[]);
                        return;
                      }
                      const top = data.slice(0, 8 - merged.length);
                      const k: Marker[] = await Promise.all(
                        top.map(async (p) => {
                          const lat = parseFloat(p.y);
                          const lng = parseFloat(p.x);
                          const title = p.place_name;
                          const description =
                            p.road_address_name || p.address_name || "";
                          return {
                            id: Number(p.id) || Math.random(),
                            title,
                            lat,
                            lng,
                            image: DEFAULT_PLACE_IMAGE,
                            description,
                            missionsCount: 0,
                            primaryMissionId: undefined,
                            markerStyle: { type: "primary" as const },
                            source: "kakao" as const,
                          } as Marker;
                        })
                      );
                      resolve(k as Marker[]);
                    });
                  }
                );
                merged = [...merged, ...kakaoMapped].slice(0, 8);
              } else {
                merged = merged.slice(0, 8);
              }

              setRemoteMarkers(merged);
              setVisibleMarkers(merged.map((_, idx) => idx));
              if (mapInstanceRef.current && merged[0]) {
                const center = new window.kakao.maps.LatLng(
                  merged[0].lat,
                  merged[0].lng
                );
                mapInstanceRef.current.setCenter(center);
                mapInstanceRef.current.setLevel(4);
              }
            } finally {
              setIsSearching(false);
            }
          }}
        >
          {isSearching ? "검색중..." : "검색"}
        </button>
      </div>
      <div className="relative">
        {/* Skeleton layer (타일 준비 전 표시) */}
        {!isMapLoaded && (
          <div className="absolute inset-0 rounded-3xl hmn-skeleton z-0" />
        )}
        {/* 현재 위치로 이동하기 버튼 (지도 상단 중앙, 맵과 겹치게) */}
        <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 z-10">
          <button
            type="button"
            onClick={() => {
              if (!navigator.geolocation || !mapInstanceRef.current) return;
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const { latitude, longitude } = pos.coords;
                  const center = new window.kakao.maps.LatLng(
                    latitude,
                    longitude
                  );
                  mapInstanceRef.current?.setCenter(center);
                  mapInstanceRef.current?.setLevel(3);
                },
                () => {},
                { enableHighAccuracy: true, timeout: 5000 }
              );
            }}
            className="pointer-events-auto rounded-full bg-white/90 border border-neutral-400 shadow-sm text-[12px] px-3 py-1.5 text-neutral-700 transition-all duration-200 flex items-center gap-1.5 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] hover:ring-2 hover:ring-neutral-400/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:translate-y-[1px]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="opacity-80"
            >
              <path
                d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3.5"
                stroke="#6b7280"
                strokeWidth="1.5"
              />
            </svg>
            현재 위치로 이동하기
          </button>
        </div>
        <div
          ref={mapContainerRef}
          className="w-full h-[550px] rounded-3xl shadow-[0_6px_24px_rgba(0,0,0,0.06)] bg-white overflow-hidden ring-1 ring-black/5"
        />

        {/* 검색창 (지도 하단 중앙 오버레이) */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[94%] sm:w-[70%] md:w-[60%] lg:w-[50%]">
          <div className="pointer-events-auto flex items-center gap-2 bg-white/95 border border-neutral-300 rounded-2xl shadow-lg px-3 py-2 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:ring-2 hover:ring-neutral-300 focus-within:shadow-2xl focus-within:scale-[1.02]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="장소 검색 (예: 한강)"
              className="flex-1 h-10 rounded-xl border border-neutral-200 px-3 text-[14px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-colors"
            />
            <button
              className="h-10 rounded-xl px-4 bg-neutral-900 text-white text-[14px] hover:bg-black disabled:opacity-60 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-[1px]"
              disabled={isSearching}
              onClick={async () => {
                if (!query.trim()) return;
                if (!mapInstanceRef.current || !window.kakao?.maps?.services) {
                  // Fallback: Kakao 서비스가 없을 때 서버 검색만 수행
                  try {
                    setIsSearching(true);
                    const results = await searchMissionPlaces(query.trim());
                    const apiMapped: Marker[] = await Promise.all(
                      results.map(async (placeLike) => {
                        const ap: MissionPlaceLike =
                          placeLike as unknown as MissionPlaceLike;
                        const title: string = ap.title ?? ap.name ?? "";
                        const lat: number = (ap.lat ?? ap.latitude)!;
                        const lng: number = (ap.lng ?? ap.longitude)!;
                        const image: string =
                          ap.imageUrl ?? ap.image ?? DEFAULT_PLACE_IMAGE;
                        const description: string =
                          ap.description ?? ap.location ?? "";
                        try {
                          const missions = await fetchMissionsByPlaceId(
                            placeLike.id
                          );
                          return {
                            id: placeLike.id,
                            title,
                            lat,
                            lng,
                            image,
                            description,
                            missionsCount: missions.length,
                            primaryMissionId: missions?.[0]?.id,
                            markerStyle: { type: "primary" as const },
                            source: "api" as const,
                          } as Marker;
                        } catch {
                          return {
                            id: placeLike.id,
                            title,
                            lat,
                            lng,
                            image,
                            description,
                            missionsCount: 0,
                            primaryMissionId: undefined,
                            markerStyle: { type: "primary" as const },
                            source: "api" as const,
                          } as Marker;
                        }
                      })
                    );
                    const limited = apiMapped.slice(0, 8);
                    setRemoteMarkers(limited);
                    setVisibleMarkers(limited.map((_, idx) => idx));
                    if (mapInstanceRef.current && limited[0]) {
                      const center = new window.kakao.maps.LatLng(
                        limited[0].lat,
                        limited[0].lng
                      );
                      mapInstanceRef.current.setCenter(center);
                      mapInstanceRef.current.setLevel(4);
                    }
                  } finally {
                    setIsSearching(false);
                  }
                  return;
                }

                // Kakao Places 검색 사용: 서버 mission_places 먼저, 부족 시 Kakao 결과 추가
                try {
                  setIsSearching(true);
                  const places = new window.kakao.maps.services.Places();
                  const keyword = query.trim();
                  // 1) 서버 mission_places 먼저
                  const apiResults = await searchMissionPlaces(keyword);
                  const apiMapped: Marker[] = await Promise.all(
                    apiResults.map(async (placeLike) => {
                      const ap: MissionPlaceLike =
                        placeLike as unknown as MissionPlaceLike;
                      const title: string = ap.title ?? ap.name ?? "";
                      const lat: number = (ap.lat ?? ap.latitude)!;
                      const lng: number = (ap.lng ?? ap.longitude)!;
                      const image: string =
                        ap.imageUrl ?? ap.image ?? DEFAULT_PLACE_IMAGE;
                      const description: string =
                        ap.description ?? ap.location ?? "";
                      try {
                        const missions = await fetchMissionsByPlaceId(
                          placeLike.id
                        );
                        return {
                          id: placeLike.id,
                          title,
                          lat,
                          lng,
                          image,
                          description,
                          missionsCount: missions.length,
                          primaryMissionId: missions?.[0]?.id,
                          markerStyle: { type: "primary" as const },
                          source: "api" as const,
                        } as Marker;
                      } catch {
                        return {
                          id: placeLike.id,
                          title,
                          lat,
                          lng,
                          image,
                          description,
                          missionsCount: 0,
                          primaryMissionId: undefined,
                          markerStyle: { type: "primary" as const },
                          source: "api" as const,
                        } as Marker;
                      }
                    })
                  );

                  let merged: Marker[] = [...apiMapped];
                  if (merged.length < 8) {
                    const kakaoMapped: Marker[] = await new Promise(
                      (resolve: (value: Marker[]) => void) => {
                        places.keywordSearch(keyword, async (data, status) => {
                          if (status !== "OK" || !data?.length) {
                            resolve([] as Marker[]);
                            return;
                          }
                          const top = data.slice(0, 8 - merged.length);
                          const k: Marker[] = await Promise.all(
                            top.map(async (p) => {
                              const lat = parseFloat(p.y);
                              const lng = parseFloat(p.x);
                              const title = p.place_name;
                              const description =
                                p.road_address_name || p.address_name || "";
                              return {
                                id: Number(p.id) || Math.random(),
                                title,
                                lat,
                                lng,
                                image: DEFAULT_PLACE_IMAGE,
                                description,
                                missionsCount: 0,
                                primaryMissionId: undefined,
                                markerStyle: { type: "primary" as const },
                                source: "kakao" as const,
                              } as Marker;
                            })
                          );
                          resolve(k as Marker[]);
                        });
                      }
                    );
                    merged = [...merged, ...kakaoMapped].slice(0, 8);
                  } else {
                    merged = merged.slice(0, 8);
                  }

                  setRemoteMarkers(merged);
                  setVisibleMarkers(merged.map((_, idx) => idx));
                  if (mapInstanceRef.current && merged[0]) {
                    const center = new window.kakao.maps.LatLng(
                      merged[0].lat,
                      merged[0].lng
                    );
                    mapInstanceRef.current.setCenter(center);
                    mapInstanceRef.current.setLevel(4);
                  }
                } finally {
                  setIsSearching(false);
                }
              }}
            >
              {isSearching ? "검색중..." : "검색"}
            </button>
          </div>
        </div>

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-2xl">
            <div className="text-center p-6">
              <div className="text-red-500 text-lg font-semibold mb-2">
                지도를 로드할 수 없습니다
              </div>
              <div className="text-gray-600 text-sm mb-4">{error}</div>
              <div className="text-xs text-gray-500">
                카카오맵 API 키를 확인해주세요.
              </div>
            </div>
          </div>
        )}

        {!error && (
          <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-lg text-sm">
            <div className="font-semibold mb-1 text-gray-900">
              총 {remoteMarkers.length}개 장소
            </div>
            <div className="text-xs text-gray-500">
              표시 중: {visibleMarkers.length}개
            </div>
          </div>
        )}
      </div>

      {!error && (
        <MarkerList
          markers={remoteMarkers.slice(0, 8)}
          onMarkerClick={handleMarkerFocus}
          activeMarkerIndex={activeMarkerIndex}
          visibleMarkers={visibleMarkers.filter((i) => i < 8)}
          onToggleVisibility={toggleMarkerVisibility}
          onRedrawMarkers={redrawMarkers}
        />
      )}
    </div>
  );
};

export default MapWithMarkers;

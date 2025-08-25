"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";

const HonmoonSealed = dynamic(
  () =>
    import("../features/honmoon/components/HonmoonSealed").then(
      (m) => m.default
    ),
  { ssr: false }
);

const MapWithMarkers = dynamic(
  () => import("../features/map/components/MapWithMarkers"),
  { ssr: false }
);

/**
 * 혼문 브랜드 섹션
 */
function HonmoonBrandSection({
  onExploreClick,
}: {
  onExploreClick: () => void;
}) {
  const [textIndex, setTextIndex] = useState(0);
  const brandTexts = [
    "혼자서도 문화를 즐기다",
    "새로운 여행의 시작",
    "특별한 추억을 만들어가는 곳",
    "당신만의 문화 여정",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % brandTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [brandTexts.length]);

  return (
    <div className="relative z-10 bg-gradient-to-br from-blue-50/95 via-white/90 to-purple-50/95 backdrop-blur-md rounded-3xl p-8 mx-4 mb-6 shadow-2xl border border-white/60">
      {/* 혼문 로고 - 확대 */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mb-4 shadow-xl transform hover:scale-105 transition-transform">
          <span className="text-3xl font-bold text-white">혼</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            혼문
          </h1>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        </div>

        {/* 동적 브랜드 텍스트 - 확대 */}
        <div className="h-8 flex items-center justify-center">
          <p
            key={textIndex}
            className="text-lg text-gray-700 font-medium animate-fade-in"
            style={{
              animation: "fadeInOut 3s ease-in-out infinite",
            }}
          >
            {brandTexts[textIndex]}
          </p>
        </div>
      </div>

      {/* 특징 카드들 - 토스 스타일 애니메이션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:bg-white/95 transition-all group cursor-pointer transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-center"
          style={{
            animation: "cardBounce 0.6s ease-out 0.1s both",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🗺️
            </span>
            <h3 className="font-semibold text-gray-800 text-base">문화 지도</h3>
          </div>
          <p className="text-sm text-gray-600">
            주변 문화 명소를 한눈에 확인하고 새로운 장소를 발견해보세요
          </p>
        </div>

        <div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 hover:bg-white/95 transition-all group cursor-pointer transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-center"
          style={{
            animation: "cardBounce 0.6s ease-out 0.2s both",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🎯
            </span>
            <h3 className="font-semibold text-gray-800 text-base">미션 완료</h3>
          </div>
          <p className="text-sm text-gray-600">
            재미있는 문화 미션을 완료하고 포인트를 획득하세요
          </p>
        </div>

        <div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100 hover:bg-white/95 transition-all group cursor-pointer transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-center"
          style={{
            animation: "cardBounce 0.6s ease-out 0.3s both",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">
              🎁
            </span>
            <h3 className="font-semibold text-gray-800 text-base">
              포인트 적립
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            적립한 포인트로 다양한 혜택과 래플에 참여하세요
          </p>
        </div>
      </div>

      {/* CTA 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => {
            onExploreClick();
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          🗺️ 문화 지도 둘러보기
        </button>
        <button
          onClick={() => (window.location.href = "/raffle")}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          🎁 래플 참여하기
        </button>
      </div>
    </div>
  );
}

/**
 * 홈 페이지 컴포넌트
 */
function HomePageContent() {
  const searchParams = useSearchParams();
  const focusMarkerId = searchParams.get("focus");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showBrandSection, setShowBrandSection] = useState(true);
  const [showBrandPopup, setShowBrandPopup] = useState(true);
  const { token } = useAuthStore();
  const isLoggedIn = !!token;

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const schedule = (cb: () => void) => {
      const w = window as unknown as {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout?: number }
        ) => void;
      };
      if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(cb, { timeout: 800 });
      } else {
        setTimeout(cb, 600);
      }
    };

    schedule(() => setShowBackdrop(true));
  }, []);

  // 스크롤 시 브랜드 섹션 숨기기
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setShowBrandSection(!scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* 배경 */}
      {showBackdrop && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <HonmoonSealed autoplay={false} />
        </div>
      )}

      {/* 브랜드 섹션 (상단) - 로그인 상태에서는 완전히 숨김 */}
      {!isLoggedIn && showBrandPopup && (
        <div
          className={`transition-all duration-700 ${
            showBrandSection
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10 pointer-events-none"
          }`}
        >
          <div className="pt-6">
            <HonmoonBrandSection
              onExploreClick={() => setShowBrandPopup(false)}
            />
          </div>
        </div>
      )}

      {/* 지도 섹션 */}
      <div className="relative z-5 p-4">
        <MapWithMarkers
          focusMarkerId={focusMarkerId ? Number(focusMarkerId) : undefined}
        />
      </div>

      {/* 플로팅 브랜드 버튼 (스크롤 시 표시) - 로그인 상태에서는 숨김 */}
      {!isLoggedIn && (
        <div
          className={`fixed top-4 left-4 z-20 transition-all duration-500 ${
            showBrandSection
              ? "opacity-0 scale-90 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white w-12 h-12 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center font-bold text-lg"
          >
            혼
          </button>
        </div>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-2xl font-bold text-white">혼</span>
            </div>
            <p className="text-gray-600">혼문을 불러오는 중...</p>
          </div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

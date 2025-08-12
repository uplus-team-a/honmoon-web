"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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

// KakaoScriptPreloader 제거 — 간결 구성

/**
 * 홈 페이지 컴포넌트
 */
function HomePageContent() {
  const searchParams = useSearchParams();
  const focusMarkerId = searchParams.get("focus");
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return; // 애니메이션 배경 미표시

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

  return (
    <main className="p-4">
      {showBackdrop && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <HonmoonSealed autoplay={false} />
        </div>
      )}
      <MapWithMarkers
        focusMarkerId={focusMarkerId ? Number(focusMarkerId) : undefined}
      />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-4">로딩 중...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

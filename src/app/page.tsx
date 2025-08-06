"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MapWithMarkers = dynamic(
  () => import("../features/map/components/MapWithMarkers"),
  { ssr: false }
);

/**
 * 홈 페이지 컴포넌트
 */
function HomePageContent() {
  const searchParams = useSearchParams();
  const focusMarkerId = searchParams.get("focus");

  return (
    <main className="p-4">
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

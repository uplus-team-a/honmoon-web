"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const MapWithMarkers = dynamic(
  () => import("../features/map/components/MapWithMarkers"),
  { ssr: false }
);

/**
 * 홈 페이지 컴포넌트
 */
export default function HomePage() {
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

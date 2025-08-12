"use client";

import { useEffect, useMemo, useState } from "react";
import ProfilePage from "../../features/profile/components/ProfilePage";
import ActivityHistory from "features/profile/components/ActivityHistory";
import RaffleHistory from "../../features/profile/components/RaffleHistory";
import CustomerCenterInfo from "../../features/profile/components/CustomerCenterInfo";
import { useAuthStore } from "../../store/auth";
import { fetchMyActivities } from "../../services/activityService";
import { fetchMyPoints } from "../../services/userService";
import { fetchMyRaffleApplications } from "../../services/raffleService";

export default function MyProfileRoute() {
  const token = useAuthStore((s) => s.token);
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const fetchMissionStats = useAuthStore((s) => s.fetchMissionStats);

  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<
    Array<{
      id: string;
      placeName: string;
      placeImageUrl: string;
      visitedDate: string;
    }>
  >([]);
  const [points, setPoints] = useState<{
    totalPoints: number;
    availablePoints: number;
  } | null>(null);
  const [raffles, setRaffles] = useState<
    Array<{
      id: string;
      productName: string;
      productImageUrl: string;
      appliedAt: string;
      status: string;
    }>
  >([]);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchProfile(), fetchMissionStats()]);
        const [acts, pts, apps] = await Promise.all([
          fetchMyActivities().catch(() => []),
          fetchMyPoints().catch(() => null),
          fetchMyRaffleApplications().catch(() => []),
        ]);

        if (!cancelled) {
          setActivities(
            acts.map((a) => ({
              id: String(a.id),
              placeName: a.placeName,
              placeImageUrl:
                a.placeImageUrl || "https://via.placeholder.com/320x240",
              visitedDate: a.visitedAt ? a.visitedAt.substring(0, 10) : "",
            }))
          );
          setPoints(pts);
          setRaffles(
            apps.map((ap) => ({
              id: String(ap.id),
              productName: String(ap.raffleProductId),
              productImageUrl: "https://via.placeholder.com/240x240",
              appliedAt: ap.appliedAt ? ap.appliedAt.substring(0, 10) : "",
              status: ap.status,
            }))
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    if (token) run();
    return () => {
      cancelled = true;
    };
  }, [token, fetchProfile, fetchMissionStats]);

  const pointsSummary = useMemo(() => {
    if (!points) return null;
    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="text-[12px] text-neutral-500">총 포인트</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">
            {points.totalPoints.toLocaleString()} P
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="text-[12px] text-neutral-500">사용 가능</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">
            {points.availablePoints.toLocaleString()} P
          </div>
        </div>
      </div>
    );
  }, [points]);

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <ProfilePage />
      {pointsSummary}
      <div className="mt-8" />
      <ActivityHistory activityHistory={activities} />
      <RaffleHistory raffleHistory={raffles} />
      <CustomerCenterInfo />
    </div>
  );
}

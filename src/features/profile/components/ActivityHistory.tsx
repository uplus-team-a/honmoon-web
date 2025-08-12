"use client";

import { useState } from "react";
import { UserIcon } from "lucide-react";

type Activities = {
  id: string;
  placeName: string;
  placeImageUrl: string;
  visitedDate: string;
};

type ActivityHistoryProps = {
  activityHistory: Activities[];
};

export default function ActivityHistory({
  activityHistory,
}: ActivityHistoryProps) {
  const allActivities = activityHistory;

  const [visibleCount, setVisibleCount] = useState(3);
  const visibleItems = allActivities.slice(0, visibleCount);
  const hasMore = visibleCount < allActivities.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">활동 내역</h2>

      <ul className="divide-y divide-gray-200">
        {visibleItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <img
                src={item.placeImageUrl}
                alt={item.placeName}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <span className="text-base font-medium">{item.placeName}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{item.visitedDate}</span>
              <div className="flex items-center gap-1">
                <UserIcon size={16} />
                <span>스탬프 획득 완료</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          className="w-full text-center text-sm mt-3 text-gray-600 hover:text-gray-800"
          onClick={handleLoadMore}
        >
          더보기
        </button>
      )}
    </section>
  );
}

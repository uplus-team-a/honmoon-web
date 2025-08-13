"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import {
  fetchMissionsByPlaceId,
  type MissionDetail,
} from "../../../services/missionService";
import { useRouter } from "next/navigation";

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    QUIZ_MULTIPLE_CHOICE: "📝",
    QUIZ_TEXT_INPUT: "✍️",
    QUIZ_IMAGE_UPLOAD: "🖼️",
    PLACE_VISIT: "📍",
    PHOTO_UPLOAD: "📸",
    SURVEY: "📊",
  };
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-700"
      title={type}
    >
      {map[type] || "🎯"}
    </span>
  );
}

interface MissionTablePanelProps {
  placeId?: number;
  placeTitle?: string;
}

export const MissionTablePanel: React.FC<MissionTablePanelProps> = ({
  placeId,
  placeTitle,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [missions, setMissions] = useState<MissionDetail[]>([]);
  const [activeType, setActiveType] = useState<string>("ALL");

  useEffect(() => {
    let cancelled = false;
    if (!placeId) return;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchMissionsByPlaceId(placeId);
        if (cancelled) return;
        setMissions(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  const filtered = useMemo(() => {
    if (activeType === "ALL") return missions;
    return missions.filter((m) => {
      const t =
        (m as unknown as { missionType?: string; quizType?: string })
          .missionType ||
        (m as unknown as { quizType?: string }).quizType ||
        "";
      return t === activeType;
    });
  }, [missions, activeType]);

  if (!placeId) return null;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center gap-2">
        <span className="text-[13px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
          미션
        </span>
        <span className="text-sm text-neutral-600">총 {missions.length}개</span>
        <div className="ml-auto text-sm font-medium text-neutral-900 truncate max-w-[50%]">
          {placeTitle}
        </div>
      </div>

      {/* 탭 필터 */}
      <div className="px-4 pt-3 flex gap-2 flex-wrap">
        {[
          { key: "ALL", label: "전체" },
          { key: "QUIZ_MULTIPLE_CHOICE", label: "객관식" },
          { key: "QUIZ_TEXT_INPUT", label: "주관식" },
          { key: "QUIZ_IMAGE_UPLOAD", label: "이미지퀴즈" },
          { key: "PHOTO_UPLOAD", label: "사진업로드" },
          { key: "PLACE_VISIT", label: "방문" },
          { key: "SURVEY", label: "설문" },
        ].map((t) => (
          <button
            key={t.key}
            className={`text-[12px] px-2.5 py-1 rounded-full border transition ${
              activeType === t.key
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
            }`}
            onClick={() => setActiveType(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="h-2" />

      {/* 테이블 뷰 */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 text-neutral-600">
              <th className="text-left font-medium px-4 py-2 w-10">유형</th>
              <th className="text-left font-medium px-4 py-2">제목</th>
              <th className="text-left font-medium px-4 py-2 w-24">선택지</th>
              <th className="text-left font-medium px-4 py-2 w-20">포인트</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  className="px-4 py-4 text-center text-neutral-500"
                  colSpan={5}
                >
                  불러오는 중…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-neutral-500"
                  colSpan={5}
                >
                  표시할 미션이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((m) => {
                const type =
                  (m as unknown as { missionType?: string; quizType?: string })
                    .missionType ||
                  (m as unknown as { quizType?: string }).quizType ||
                  "";
                return (
                  <tr key={m.id} className="border-t border-neutral-100">
                    <td className="px-4 py-2 align-middle">
                      <TypeBadge type={type} />
                    </td>
                    <td className="px-4 py-2 align-middle">
                      <div className="font-medium text-neutral-900">
                        {m.title}
                      </div>
                      {m.description && (
                        <div className="text-xs text-neutral-600 line-clamp-1">
                          {m.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 align-middle text-neutral-700">
                      {Array.isArray(m.choices) && m.choices.length > 0
                        ? `${m.choices.length}개`
                        : "-"}
                    </td>
                    <td className="px-4 py-2 align-middle text-neutral-700">
                      {typeof m.pointsReward !== "undefined"
                        ? m.pointsReward
                        : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

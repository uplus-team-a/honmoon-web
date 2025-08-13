"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchMissionPlaceById,
  fetchMissionsByPlaceId,
  type MissionDetail,
} from "../../../../services/missionService";
import { Button } from "../../../../shared/components/ui/button";
import { MarkerImage } from "../../../../shared/components/ui/marker-image";

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
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-700 mr-2"
      title={type}
    >
      {map[type] || "🎯"}
    </span>
  );
}

export default function MissionPlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const placeId = Number(params.id);
  const [place, setPlace] = useState<{
    id: number;
    title: string;
    imageUrl?: string;
    description?: string;
  } | null>(null);
  const [missions, setMissions] = useState<MissionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("ALL");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, list] = await Promise.all([
          fetchMissionPlaceById(placeId),
          fetchMissionsByPlaceId(placeId),
        ]);
        if (cancelled) return;
        const title =
          (p as unknown as { title?: string; name?: string }).title ??
          (p as unknown as { name?: string }).name ??
          "";
        const imageUrl =
          (p as unknown as { imageUrl?: string; image?: string }).imageUrl ??
          (p as unknown as { image?: string }).image;
        const description =
          (p as unknown as { description?: string; location?: string })
            .description ?? (p as unknown as { location?: string }).location;
        setPlace({ id: p.id, title, imageUrl, description });
        setMissions(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  if (loading) return <div className="p-6">로딩 중…</div>;
  if (!place)
    return <div className="p-6">장소 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="max-w-screen-md mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold">{place.title}</div>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로
        </Button>
      </div>

      {/* 장소 정보 섹션 */}
      <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm mb-6">
        {place.imageUrl ? (
          <MarkerImage
            src={place.imageUrl}
            alt={place.title}
            width="w-full"
            height="h-48"
            shape="rounded"
          />
        ) : null}
        {place.description ? (
          <div className="p-4 text-sm text-neutral-700">
            {place.description}
          </div>
        ) : null}
      </div>

      {/* 미션 리스트 (테이블 뷰) */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
        <div className="px-4 py-3 border-b border-neutral-200 flex items-center gap-2">
          <span className="text-[13px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
            미션
          </span>
          <span className="text-sm text-neutral-600">
            총 {missions.length}개
          </span>
          <div className="ml-auto flex items-center gap-1 text-[11px] text-neutral-600">
            {(() => {
              const counts: Record<string, number> = {};
              for (const m of missions) {
                const t =
                  (m as unknown as { missionType?: string; quizType?: string })
                    .missionType ||
                  (m as unknown as { quizType?: string }).quizType ||
                  "기타";
                counts[t] = (counts[t] || 0) + 1;
              }
              const order = [
                "QUIZ_MULTIPLE_CHOICE",
                "QUIZ_TEXT_INPUT",
                "QUIZ_IMAGE_UPLOAD",
                "PHOTO_UPLOAD",
                "PLACE_VISIT",
                "SURVEY",
              ];
              return Object.entries(counts)
                .sort((a, b) => {
                  const ai = order.indexOf(a[0]);
                  const bi = order.indexOf(b[0]);
                  return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
                })
                .map(([k, v]) => (
                  <span
                    key={k}
                    className="px-1.5 py-0.5 bg-neutral-50 border border-neutral-200 rounded-full"
                  >
                    {v}
                  </span>
                ));
            })()}
          </div>
        </div>
        {/* 타입 탭 필터 */}
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
              {(activeType === "ALL"
                ? missions
                : missions.filter((m) => {
                    const t =
                      (
                        m as unknown as {
                          missionType?: string;
                          quizType?: string;
                        }
                      ).missionType ||
                      (m as unknown as { quizType?: string }).quizType ||
                      "";
                    return t === activeType;
                  })
              ).map((m) => {
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
                      {m.question && (
                        <div className="text-[11px] text-neutral-500 line-clamp-1">
                          질문: {m.question}
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

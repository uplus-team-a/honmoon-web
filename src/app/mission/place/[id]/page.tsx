"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  fetchMissionPlaceById,
  fetchMissionsByPlaceId,
  type MissionDetail,
} from "../../../../services/missionService";
import { Button } from "../../../../shared/components/ui/button";
import { MarkerImage } from "../../../../shared/components/ui/marker-image";
import { fetchActivitiesByPlace } from "../../../../services/activityService";
import { animate, stagger } from "motion";

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
  const searchParams = useSearchParams();
  const [place, setPlace] = useState<{
    id: number;
    title: string;
    imageUrl?: string;
    description?: string;
  } | null>(null);
  const [missions, setMissions] = useState<MissionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [completedMissionIds, setCompletedMissionIds] = useState<Set<number>>(
    new Set()
  );
  // 탭별 입력 상태
  const [textAnswer, setTextAnswer] = useState("");
  const [choiceIndex, setChoiceIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [resultMsg, setResultMsg] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const [typedQuestion, setTypedQuestion] = useState<string>("");
  const typingTimerRef = useRef<number | null>(null);

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
        // 초기 활성 탭: 쿼리의 missionId가 있으면 해당 인덱스로
        const qMissionId = Number(searchParams.get("missionId"));
        if (qMissionId && Array.isArray(list)) {
          const idx = list.findIndex(
            (m) => Number((m as { id: number }).id) === qMissionId
          );
          if (idx >= 0) setActiveIndex(idx);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [placeId, searchParams]);

  // 완료된 미션 조회 (있으면 비활성화 처리)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const acts = await fetchActivitiesByPlace(placeId).catch(
          () => [] as Array<{ missionId?: number; isCompleted?: boolean }>
        );
        if (cancelled) return;
        const done = new Set<number>();
        for (const a of acts) {
          const mId = (a as unknown as { missionId?: number }).missionId;
          const comp = (a as unknown as { isCompleted?: boolean }).isCompleted;
          if (comp && typeof mId === "number") done.add(mId);
        }
        setCompletedMissionIds(done);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  // 탭 버튼 등장 애니메이션
  useEffect(() => {
    if (!tabsRef.current) return;
    const btns = Array.from(tabsRef.current.querySelectorAll("button"));
    if (btns.length === 0) return;
    animate(
      btns as unknown as any,
      {
        opacity: [0, 1],
        transform: ["translateY(6px)", "translateY(0)"],
      } as any,
      { delay: stagger(0.04), duration: 0.35, easing: "ease-out" } as any
    );
  }, [missions.length]);

  // 탭 전환 시 콘텐츠 페이드 인
  useEffect(() => {
    if (!contentRef.current) return;
    animate(
      contentRef.current as unknown as any,
      {
        opacity: [0, 1],
        transform: ["translateY(8px)", "translateY(0)"],
      } as any,
      { duration: 0.28, easing: "ease-out" } as any
    );
  }, [activeIndex]);

  const playShake = () => {
    if (!contentRef.current) return;
    animate(
      contentRef.current as unknown as any,
      {
        transform: [
          "translateX(0)",
          "translateX(-6px)",
          "translateX(6px)",
          "translateX(-4px)",
          "translateX(4px)",
          "translateX(0)",
        ],
      } as any,
      { duration: 0.5, easing: "ease-in-out" } as any
    );
  };

  const fireConfetti = () => {
    const root = contentRef.current;
    if (!root) return;
    const layer = document.createElement("div");
    layer.style.position = "absolute";
    layer.style.inset = "0";
    layer.style.pointerEvents = "none";
    root.appendChild(layer);
    const emojis = ["🎉", "✨", "🪄", "🎊", "⭐️"];
    const count = 18;
    const pieces: HTMLSpanElement[] = [];
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      s.style.position = "absolute";
      s.style.left = "50%";
      s.style.top = "8px";
      s.style.transform = "translateX(-50%)";
      s.style.fontSize = `${Math.round(14 + Math.random() * 10)}px`;
      layer.appendChild(s);
      pieces.push(s);
    }
    pieces.forEach((el, i) => {
      const x = (Math.random() - 0.5) * 220;
      const y = 120 + Math.random() * 120;
      const r = (Math.random() - 0.5) * 180;
      animate(
        el as unknown as any,
        {
          transform: [
            `translate(-50%, 0) rotate(0deg)`,
            `translate(calc(-50% + ${x}px), ${y}px) rotate(${r}deg)`,
          ],
          opacity: [1, 0],
        } as any,
        {
          duration: 0.95 + Math.random() * 0.25,
          easing: "ease-out",
          delay: i * 0.01,
        } as any
      ).finished.finally(() => {
        el.remove();
        if (i === pieces.length - 1) layer.remove();
      });
    });
  };

  const activeMission: MissionDetail | undefined = useMemo(
    () => missions[activeIndex],
    [missions, activeIndex]
  );

  const missionType = useMemo(() => {
    if (!activeMission) return "";
    return (
      (activeMission as { missionType?: string }).missionType ||
      (activeMission as { quizType?: string }).quizType ||
      ""
    );
  }, [activeMission]);

  // 질문 타이핑 애니메이션
  useEffect(() => {
    const q = (activeMission as { question?: string } | undefined)?.question;
    if (!q) {
      setTypedQuestion("");
      return;
    }
    // cleanup 이전 타이머
    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setTypedQuestion("");
    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setTypedQuestion(q.slice(0, i));
      if (i >= q.length && typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 18);
    typingTimerRef.current = interval as unknown as number;
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMission?.id]);

  const showToast = (
    message: string,
    variant: "success" | "error" | "info" = "info"
  ) => {
    if (!toastRef.current) return;
    toastRef.current.textContent = message;
    toastRef.current.dataset.variant = variant;
    toastRef.current.style.opacity = "0";
    toastRef.current.style.transform = "translateY(8px)";
    animate(
      toastRef.current as unknown as any,
      {
        opacity: [0, 1],
        transform: ["translateY(8px)", "translateY(0)"],
      } as any,
      { duration: 0.25, easing: "ease-out" } as any
    );
    window.setTimeout(() => {
      if (!toastRef.current) return;
      animate(
        toastRef.current as unknown as any,
        {
          opacity: [1, 0],
          transform: ["translateY(0)", "translateY(8px)"],
        } as any,
        { duration: 0.3, easing: "ease-in" } as any
      );
    }, 1600);
  };

  const popBurstOn = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = `${rect.left + rect.width / 2}px`;
    container.style.top = `${rect.top + rect.height / 2}px`;
    container.style.pointerEvents = "none";
    container.style.zIndex = "50";
    document.body.appendChild(container);
    const count = 8;
    const colors = ["#6366f1", "#a855f7", "#8b5cf6", "#22d3ee", "#f472b6"];
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.style.position = "absolute";
      dot.style.width = "6px";
      dot.style.height = "6px";
      dot.style.borderRadius = "9999px";
      dot.style.background = colors[i % colors.length];
      dot.style.left = "-3px";
      dot.style.top = "-3px";
      container.appendChild(dot);
      const angle = (Math.PI * 2 * i) / count;
      const dx = Math.cos(angle) * (24 + Math.random() * 12);
      const dy = Math.sin(angle) * (24 + Math.random() * 12);
      animate(
        dot as unknown as any,
        {
          transform: ["translate(0,0)", `translate(${dx}px, ${dy}px)`],
          opacity: [1, 0],
        } as any,
        { duration: 0.5, easing: "ease-out" } as any
      ).finished.finally(() => dot.remove());
    }
    window.setTimeout(() => container.remove(), 520);
  };

  const onTabClick = (idx: number, ev: React.MouseEvent<HTMLButtonElement>) => {
    const mid = (missions[idx] as { id: number } | undefined)?.id;
    if (typeof mid === "number" && !completedMissionIds.has(mid)) {
      setActiveIndex(idx);
      const btn = ev.currentTarget as HTMLElement;
      animate(
        btn as unknown as any,
        { scale: [1, 1.06, 1] } as any,
        { duration: 0.22, easing: "ease-out" } as any
      );
      popBurstOn(btn);
    }
  };

  const completedCount = useMemo(() => {
    try {
      return missions.reduce(
        (acc, m) =>
          acc + (completedMissionIds.has((m as { id: number }).id) ? 1 : 0),
        0
      );
    } catch {
      return 0;
    }
  }, [missions, completedMissionIds]);

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

      {/* 미션 탭 */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-violet-500" />
        <div className="px-4 py-3 border-b border-neutral-200 flex items-center gap-3">
          <span className="text-[12px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
            미션
          </span>
          <span className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-violet-600 font-semibold">
            총 {missions.length}개 도전과제
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[12px] text-neutral-500">
              완료 {completedCount}/{missions.length}
            </span>
            <div className="w-28 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-500"
                style={{
                  width: `${
                    missions.length
                      ? Math.round(
                          (completedCount / Math.max(1, missions.length)) * 100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
        <div ref={tabsRef} className="px-3 pt-3 flex gap-2 overflow-x-auto">
          {missions.map((m, idx) => {
            const disabled = completedMissionIds.has(
              Number((m as { id: number }).id)
            );
            return (
              <button
                key={(m as { id: number }).id}
                className={`text-[12px] px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                  idx === activeIndex
                    ? "text-white border-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-500 shadow-sm"
                    : disabled
                    ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:shadow-sm hover:translate-y-[-1px]"
                }`}
                onClick={(ev) => onTabClick(idx, ev)}
                disabled={disabled}
              >
                {(m as { title: string }).title}
              </button>
            );
          })}
        </div>
        <div ref={contentRef} className="p-5 relative">
          {/* Toast */}
          <div
            ref={toastRef}
            className="pointer-events-none absolute right-4 -top-2 translate-y-[-8px] rounded-md px-3 py-2 text-[12px] shadow-md bg-white/90 border border-neutral-200 text-neutral-800"
          />
          {activeMission ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TypeBadge type={missionType} />
                  <div className="text-lg font-semibold text-neutral-900">
                    {activeMission.title}
                  </div>
                  {typeof activeMission.pointsReward !== "undefined" && (
                    <span className="ml-2 text-xs text-neutral-600">
                      포인트: {activeMission.pointsReward}
                    </span>
                  )}
                </div>
                {activeMission?.description && (
                  <div className="text-sm text-neutral-600">
                    {activeMission.description}
                  </div>
                )}
                {activeMission &&
                  (activeMission as { question?: string }).question && (
                    <div className="mt-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-800 font-medium">
                      질문: {typedQuestion}
                      <span
                        className="inline-block w-[8px] ml-0.5 align-middle bg-neutral-400 animate-pulse"
                        style={{ height: "1em" }}
                      />
                    </div>
                  )}
              </div>

              {/* 타입별 인터랙션 */}
              {missionType === "QUIZ_TEXT_INPUT" && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">정답 입력</div>
                  <input
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="정답을 입력하세요"
                    className="w-full h-11 px-3 border rounded-md"
                  />
                  <Button
                    disabled={submitting}
                    onClick={async () => {
                      setSubmitting(true);
                      setResultMsg("");
                      const { submitQuizText } = await import(
                        "../../../../services/missionService"
                      );
                      try {
                        const res = await submitQuizText(
                          activeMission.id,
                          textAnswer
                        );
                        setResultMsg(
                          res.isCorrect ? "정답입니다!" : "오답입니다."
                        );
                        if (res.isCorrect) fireConfetti();
                        else playShake();
                        showToast(
                          res.isCorrect
                            ? "정답! 포인트가 적립됐어요"
                            : "아쉽어요! 다시 도전해요",
                          res.isCorrect ? "success" : "error"
                        );
                      } catch {
                        setResultMsg("제출 실패");
                        playShake();
                        showToast("제출 실패", "error");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="transition active:translate-y-[1px] hover:scale-[1.02]"
                  >
                    제출
                  </Button>
                </div>
              )}

              {missionType === "QUIZ_MULTIPLE_CHOICE" && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">선택지를 고르세요</div>
                  <div className="space-y-2">
                    {(Array.isArray(
                      (activeMission as { choices?: { choices: string[] } })
                        .choices?.choices
                    )
                      ? (activeMission as { choices?: { choices: string[] } })
                          .choices!.choices
                      : []
                    ).map((c: string, idx: number) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="choice"
                          checked={choiceIndex === idx}
                          onChange={() => setChoiceIndex(idx)}
                        />
                        <span>
                          {idx + 1}. {c}
                        </span>
                      </label>
                    ))}
                  </div>
                  <Button
                    disabled={submitting}
                    onClick={async () => {
                      setSubmitting(true);
                      setResultMsg("");
                      const { submitQuizChoice } = await import(
                        "../../../../services/missionService"
                      );
                      try {
                        const res = await submitQuizChoice(
                          activeMission.id,
                          choiceIndex
                        );
                        setResultMsg(
                          res.isCorrect ? "정답입니다!" : "오답입니다."
                        );
                        if (res.isCorrect) fireConfetti();
                        else playShake();
                        showToast(
                          res.isCorrect
                            ? "정답! 포인트가 적립됐어요"
                            : "아쉽어요! 다시 도전해요",
                          res.isCorrect ? "success" : "error"
                        );
                      } catch {
                        setResultMsg("제출 실패");
                        playShake();
                        showToast("제출 실패", "error");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="transition active:translate-y-[1px] hover:scale-[1.02]"
                  >
                    제출
                  </Button>
                </div>
              )}

              {(missionType === "QUIZ_IMAGE_UPLOAD" ||
                missionType === "PHOTO_UPLOAD") && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">이미지 URL</div>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="업로드된 이미지 URL"
                    className="w-full h-11 px-3 border rounded-md"
                  />
                  <div className="text-xs text-neutral-600">
                    또는 파일을 선택해 업로드하세요
                  </div>
                  <label
                    htmlFor="mission-image-input"
                    className="mt-1 block rounded-xl border-2 border-dashed border-neutral-200 p-4 text-center text-[12px] text-neutral-500 cursor-pointer hover:border-neutral-300 transition"
                  >
                    여기를 클릭하거나 파일을 드래그하세요
                  </label>
                  <input
                    id="mission-image-input"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      setResultMsg("");
                      try {
                        const { getGcsUploadUrl } = await import(
                          "../../../../services/uploadService"
                        );
                        const presign = await getGcsUploadUrl(
                          file.name,
                          file.type || "application/octet-stream"
                        );
                        await fetch(presign.uploadUrl, {
                          method: "PUT",
                          body: file,
                          headers: { "Content-Type": file.type },
                        });
                        setImageUrl(presign.publicUrl);
                        setResultMsg("업로드 완료. 제출을 눌러주세요.");
                      } catch {
                        setResultMsg("업로드 실패");
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                  <Button
                    disabled={submitting || uploading}
                    onClick={async () => {
                      setSubmitting(true);
                      setResultMsg("");
                      const { submitQuizImage } = await import(
                        "../../../../services/missionService"
                      );
                      try {
                        const res = await submitQuizImage(
                          activeMission.id,
                          imageUrl
                        );
                        setResultMsg(
                          res.isCorrect ? "정답입니다!" : "오답입니다."
                        );
                        if (res.isCorrect) fireConfetti();
                        else playShake();
                        showToast(
                          res.isCorrect
                            ? "정답! 포인트가 적립됐어요"
                            : "아쉽어요! 다시 도전해요",
                          res.isCorrect ? "success" : "error"
                        );
                      } catch {
                        setResultMsg("제출 실패");
                        playShake();
                        showToast("제출 실패", "error");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="transition active:translate-y-[1px] hover:scale-[1.02]"
                  >
                    제출
                  </Button>
                </div>
              )}

              {missionType === "PLACE_VISIT" && (
                <div className="space-y-2">
                  <div className="text-sm text-neutral-700">
                    해당 장소를 방문하면 완료 처리됩니다.
                  </div>
                  <Button
                    disabled={submitting}
                    onClick={async () => {
                      setSubmitting(true);
                      setResultMsg("");
                      const { submitQuizNoInput } = await import(
                        "../../../../services/missionService"
                      );
                      try {
                        const res = await submitQuizNoInput(activeMission.id);
                        setResultMsg(
                          res.isCorrect
                            ? "완료 처리되었습니다."
                            : "처리되었습니다."
                        );
                        fireConfetti();
                        showToast("완료 처리되었습니다", "success");
                      } catch {
                        setResultMsg("제출 실패");
                        playShake();
                        showToast("제출 실패", "error");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="transition active:translate-y-[1px] hover:scale-[1.02]"
                  >
                    완료 처리하기
                  </Button>
                </div>
              )}

              {missionType === "SURVEY" && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">설문 응답</div>
                  <input
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="응답을 입력하세요"
                    className="w-full h-11 px-3 border rounded-md"
                  />
                  <Button
                    disabled={submitting}
                    onClick={async () => {
                      setSubmitting(true);
                      setResultMsg("");
                      const { submitQuizText } = await import(
                        "../../../../services/missionService"
                      );
                      try {
                        const res = await submitQuizText(
                          activeMission.id,
                          textAnswer
                        );
                        setResultMsg(
                          res.isCorrect ? "접수되었습니다." : "접수되었습니다."
                        );
                        fireConfetti();
                        showToast("제출되었습니다", "success");
                      } catch {
                        setResultMsg("제출 실패");
                        playShake();
                        showToast("제출 실패", "error");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className="transition active:translate-y-[1px] hover:scale-[1.02]"
                  >
                    제출
                  </Button>
                </div>
              )}

              {resultMsg && (
                <div className="text-center text-sm text-neutral-700">
                  {resultMsg}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-neutral-600">
              표시할 미션이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

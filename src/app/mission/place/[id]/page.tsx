"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  fetchMissionPlaceById,
  fetchMissionsByPlaceId,
  fetchMissionDetailWithAnswer,
  completeMission,
  submitMissionImageAnswer,
  type MissionDetail,
  type MissionCompleteResponse,
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
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [wrongAnswerMissions, setWrongAnswerMissions] = useState<Set<number>>(
    new Set()
  );

  // 이미지 팝업 상태
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  // 이미지 클릭 핸들러
  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setShowImagePopup(true);
  };

  // 이미지 팝업 닫기
  const closeImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImageUrl("");
  };
  const [completionResult, setCompletionResult] =
    useState<MissionCompleteResponse | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const [typedQuestion, setTypedQuestion] = useState<string>("");
  const typingTimerRef = useRef<number | null>(null);

  // 정답 체크 함수
  const checkAnswer = async (userAnswer: string | number): Promise<boolean> => {
    if (!activeMission) return false;

    try {
      const missionDetail = await fetchMissionDetailWithAnswer(
        activeMission.id
      );

      if (
        activeMission.quizType === "QUIZ_MULTIPLE_CHOICE" ||
        missionDetail.missionType === "QUIZ_MULTIPLE_CHOICE"
      ) {
        const correctAnswer =
          missionDetail.answer || missionDetail.correctAnswer;
        const correctIndex = missionDetail.choices?.choices.findIndex(
          (choice) => choice === correctAnswer
        );
        return correctIndex === userAnswer;
      } else if (
        activeMission.quizType === "QUIZ_TEXT_INPUT" ||
        missionDetail.missionType === "QUIZ_TEXT_INPUT"
      ) {
        const correctAnswer =
          missionDetail.answer || missionDetail.correctAnswer;
        return (
          correctAnswer?.toLowerCase().trim() ===
          String(userAnswer).toLowerCase().trim()
        );
      } else if (
        activeMission.quizType === "QUIZ_IMAGE_UPLOAD" ||
        activeMission.quizType === "PHOTO_UPLOAD" ||
        missionDetail.missionType === "QUIZ_IMAGE_UPLOAD" ||
        missionDetail.missionType === "PHOTO_UPLOAD"
      ) {
        // 이미지 업로드는 handleSubmitAnswer에서 직접 처리
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking answer:", error);
      return false;
    }
  };

  // 미션 완료 처리 함수
  const handleSubmitAnswer = async (userAnswer: string | number) => {
    if (!activeMission) return;

    setSubmitting(true);
    setResultMsg("");

    try {
      // 이미지 업로드 미션의 경우 직접 처리
      if (
        activeMission.quizType === "QUIZ_IMAGE_UPLOAD" ||
        activeMission.quizType === "PHOTO_UPLOAD"
      ) {
        const result = await submitMissionImageAnswer(
          activeMission.id,
          String(userAnswer)
        );

        if (!result.isCorrect) {
          setWrongAnswerMissions(
            (prev) => new Set([...prev, activeMission.id])
          );
          setResultMsg("❌ 아쉽습니다. 나중에 다시 도전해주세요!");
          setSubmitting(false);
          return;
        }

        // 이미지 제출이 성공한 경우 완료 API 호출
        const completionResult = await completeMission(activeMission.id);
        setCompletionResult(completionResult);
        setShowSuccessModal(true);
        setSubmitting(false);

        return;
      }

      // 일반 미션의 경우 기존 로직
      const isCorrect = await checkAnswer(userAnswer);

      if (!isCorrect) {
        // 오답 처리
        setWrongAnswerMissions((prev) => new Set([...prev, activeMission.id]));
        setResultMsg("❌ 아쉽습니다. 나중에 다시 도전해주세요!");
        setSubmitting(false);
        return;
      }

      // 정답인 경우 완료 API 호출
      const result = await completeMission(activeMission.id);
      setCompletionResult(result);
      setShowSuccessModal(true);
      setSubmitting(false);


    } catch (error) {
      console.error("Submit error:", error);
      setResultMsg("❌ 제출 중 오류가 발생했습니다.");
      setSubmitting(false);
    }
  };

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

  // 현재 활성 미션이 완료되었는지 확인
  const isCurrentMissionCompleted = useMemo(() => {
    if (!activeMission) return false;
    return completedMissionIds.has(activeMission.id);
  }, [activeMission, completedMissionIds]);

  // 현재 활성 미션이 오답 상태인지 확인
  const isCurrentMissionWrong = useMemo(() => {
    if (!activeMission) return false;
    return wrongAnswerMissions.has(activeMission.id);
  }, [activeMission, wrongAnswerMissions]);

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
    setActiveIndex(idx);
    const btn = ev.currentTarget as HTMLElement;
    animate(
      btn as unknown as any,
      { scale: [1, 1.06, 1] } as any,
      { duration: 0.22, easing: "ease-out" } as any
    );
    popBurstOn(btn);
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
          <div
            className="cursor-pointer relative group"
            onClick={() => handleImageClick(place.imageUrl!)}
          >
            <MarkerImage
              src={place.imageUrl}
              alt={place.title}
              width="w-full"
              height="h-48"
              shape="rounded"
            />
            {/* 확대 아이콘 오버레이 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>
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
            const isCompleted = completedMissionIds.has(
              Number((m as { id: number }).id)
            );
            return (
              <button
                key={(m as { id: number }).id}
                className={`text-[12px] px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                  idx === activeIndex
                    ? "text-white border-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-500 shadow-sm"
                    : isCompleted
                    ? "bg-neutral-100 text-neutral-400 border-neutral-200"
                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:shadow-sm hover:translate-y-[-1px]"
                }`}
                onClick={(ev) => onTabClick(idx, ev)}
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
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700">
                    ✍️ 정답을 입력하세요
                  </div>
                  <div className="relative">
                    <input
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="정답을 입력해주세요..."
                      className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg placeholder-gray-400 transition-all"
                      onKeyPress={(e) => {
                        if (
                          e.key === "Enter" &&
                          textAnswer.trim() &&
                          !submitting
                        ) {
                          const submitBtn = document.getElementById(
                            "text-submit-btn"
                          ) as HTMLButtonElement;
                          submitBtn?.click();
                        }
                      }}
                    />
                    {textAnswer.trim() && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-green-500">✓</span>
                      </div>
                    )}
                  </div>
                  <Button
                    id="text-submit-btn"
                    disabled={
                      submitting ||
                      !textAnswer.trim() ||
                      isCurrentMissionWrong ||
                      isCurrentMissionCompleted
                    }
                    onClick={() => handleSubmitAnswer(textAnswer.trim())}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isCurrentMissionCompleted
                      ? "이미 완료됨"
                      : isCurrentMissionWrong
                      ? "오답 처리됨"
                      : submitting
                      ? "제출 중..."
                      : "정답 제출"}
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    💡 Enter 키를 눌러도 제출할 수 있어요
                  </div>
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
                    disabled={
                      submitting ||
                      isCurrentMissionWrong ||
                      isCurrentMissionCompleted
                    }
                    onClick={() => handleSubmitAnswer(choiceIndex)}
                    className="transition active:translate-y-[1px] hover:scale-[1.02]"
                  >
                    {isCurrentMissionCompleted
                      ? "이미 완료됨"
                      : isCurrentMissionWrong
                      ? "오답 처리됨"
                      : "제출"}
                  </Button>
                </div>
              )}

              {(missionType === "QUIZ_IMAGE_UPLOAD" ||
                missionType === "PHOTO_UPLOAD") && (
                <div className="space-y-4">
                  <div className="text-sm font-medium">이미지 업로드</div>

                  {/* 이미지 미리보기 */}
                  {imageUrl && (
                    <div className="relative bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <img
                          src={imageUrl}
                          alt="업로드된 이미지"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            업로드된 이미지
                          </div>
                          <div className="text-xs text-gray-500 break-all">
                            {imageUrl}
                          </div>
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            ✅ 업로드 완료
                          </div>
                        </div>
                        <button
                          onClick={() => setImageUrl("")}
                          className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors flex-shrink-0"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  {/* URL 직접 입력 */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      이미지 URL (직접 입력)
                    </label>
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="text-center text-xs text-gray-500">또는</div>

                  {/* 파일 업로드 */}
                  <label
                    htmlFor="mission-image-input"
                    className={`mt-1 block rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                      uploading
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }`}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <span className="text-sm text-blue-600 font-medium">
                          업로드 중...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 font-medium">
                          클릭하여 이미지 선택
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG, JPEG (최대 10MB)
                        </span>
                      </div>
                    )}
                  </label>
                  <input
                    id="mission-image-input"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 10 * 1024 * 1024) {
                        setResultMsg("파일 크기는 10MB 이하여야 합니다.");
                        return;
                      }

                      setUploading(true);
                      setResultMsg("");
                      try {
                        const { uploadImageComplete } = await import(
                          "../../../../services/uploadService"
                        );
                        const publicUrl = await uploadImageComplete(file);
                        setImageUrl(publicUrl);
                        setResultMsg(
                          "✅ 이미지 업로드 완료! 아래 제출 버튼을 클릭하세요."
                        );
                      } catch (error) {
                        console.error("Image upload failed:", error);
                        setResultMsg(
                          `❌ 업로드 실패: ${
                            error instanceof Error
                              ? error.message
                              : "알 수 없는 오류"
                          }`
                        );
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />

                  {/* 제출 버튼 */}
                  <Button
                    disabled={
                      submitting ||
                      uploading ||
                      !imageUrl ||
                      isCurrentMissionWrong ||
                      isCurrentMissionCompleted
                    }
                    onClick={() => handleSubmitAnswer(imageUrl)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isCurrentMissionCompleted
                      ? "이미 완료됨"
                      : isCurrentMissionWrong
                      ? "오답 처리됨"
                      : submitting
                      ? "제출 중..."
                      : "이미지 제출"}
                  </Button>
                </div>
              )}

              {missionType === "PLACE_VISIT" && (
                <div className="space-y-2">
                  <div className="text-sm text-neutral-700">
                    해당 장소를 방문하면 완료 처리됩니다.
                  </div>
                  <Button
                    disabled={
                      submitting ||
                      isCurrentMissionWrong ||
                      isCurrentMissionCompleted
                    }
                    onClick={() => handleSubmitAnswer("visit")}
                    className="transition active:translate-y-[1px] hover:scale-[1.02]"
                  >
                    {isCurrentMissionCompleted
                      ? "이미 완료됨"
                      : isCurrentMissionWrong
                      ? "오답 처리됨"
                      : "완료 처리하기"}
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
                    disabled={
                      submitting ||
                      isCurrentMissionWrong ||
                      isCurrentMissionCompleted
                    }
                    onClick={() => handleSubmitAnswer(textAnswer)}
                    className="transition active:translate-y-[1px] hover:scale-[1.02]"
                  >
                    {isCurrentMissionCompleted
                      ? "이미 완료됨"
                      : isCurrentMissionWrong
                      ? "오답 처리됨"
                      : "제출"}
                  </Button>
                </div>
              )}

              {resultMsg && (
                <div
                  className={`text-center text-sm p-4 rounded-lg ${
                    isCurrentMissionWrong
                      ? "bg-red-50 border border-red-200 text-red-700"
                      : "text-neutral-700"
                  }`}
                >
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

      {/* 성공 모달 - 메인페이지 스타일 */}
      {showSuccessModal && completionResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* 폭죽 효과 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  backgroundColor: [
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                    "#f59e0b",
                    "#10b981",
                  ][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
            {/* 반짝이는 별 효과 */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="sparkle"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>

          <div className="success-modal-enter bg-gradient-to-br from-blue-50/95 via-white/90 to-purple-50/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/60 relative overflow-hidden">
            {/* 배경 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20 rounded-3xl"></div>

            <div className="relative text-center">
              {/* 성공 아이콘 - 혼문 스타일 */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl mb-4 shadow-xl transform hover:scale-105 transition-transform">
                  <span className="text-4xl">🎉</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    축하합니다!
                  </h3>
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                </div>
                <p className="text-lg text-gray-700 font-medium mt-2">
                  미션 완료! 포인트가 적립되었습니다
                </p>
              </div>

              {/* 포인트 정보 - 혼문 스타일 카드 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:bg-white/95 transition-all group cursor-pointer transform hover:scale-105 shadow-lg mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    💰
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                      +{completionResult.userActivity.pointsEarned}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      포인트
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {completionResult.message}
                </p>
              </div>

              {/* 해설 섹션 - 혼문 스타일 */}
              {completionResult.missionDetail.answerExplanation && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:bg-white/95 transition-all group shadow-lg mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      💡
                    </span>
                    <h4 className="font-bold text-gray-800 text-lg">해설</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {completionResult.missionDetail.answerExplanation}
                  </p>
                </div>
              )}

              {/* 확인 버튼 - 혼문 스타일 */}
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  setCompletedMissionIds(
                    (prev) => new Set([...prev, activeMission.id])
                  );
                }}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl text-lg shadow-xl transform hover:scale-105 active:scale-95 transition-all"
              >
                <span className="mr-2">🚀</span>
                다음 미션으로!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 팝업 */}
      {showImagePopup && selectedImageUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* 닫기 버튼 */}
            <button
              onClick={closeImagePopup}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <div className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </button>

            {/* 이미지 */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl">
              <img
                src={selectedImageUrl}
                alt="장소 이미지"
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                onClick={closeImagePopup}
              />

              {/* 이미지 정보 */}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {place?.title}
                </h3>
                <p className="text-sm text-gray-600">클릭하여 닫기</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

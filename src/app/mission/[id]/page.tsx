"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../../shared/components/ui/button";
import { MarkerImage } from "../../../shared/components/ui/marker-image";
import { ArrowLeft } from "lucide-react";
import {
  fetchMissionById,
  submitQuizText,
  submitQuizChoice,
  submitQuizImage,
  submitQuizNoInput,
  type MissionDetail,
} from "../../../services/missionService";

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

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = Number(params.id);
  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [choiceIndex, setChoiceIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [resultMsg, setResultMsg] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMissionById(missionId)
      .then((m) => {
        if (cancelled) return;
        setMission(m);
      })
      .catch(() => setMission(null));
    return () => {
      cancelled = true;
    };
  }, [missionId]);

  if (!mission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            미션을 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">
            요청하신 미션 정보가 존재하지 않습니다.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">미션 상세</h1>
          <div className="w-9" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-md mx-auto bg-white">
        {/* 이미지 섹션 */}
        <div className="relative">
          <MarkerImage
            src={mission.correctImageUrl}
            alt={mission.title}
            width="w-full"
            height="h-64"
            shape="rounded"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
            미션 #{mission.id}
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <TypeBadge
                type={
                  (
                    mission as unknown as {
                      missionType?: string;
                      quizType?: string;
                    }
                  ).missionType ||
                  (mission as unknown as { quizType?: string }).quizType ||
                  ""
                }
              />
              <h2 className="text-2xl font-bold text-gray-900">
                {mission.title}
              </h2>
            </div>
            {mission.description && (
              <p className="text-gray-600 leading-relaxed">
                {mission.description}
              </p>
            )}
            {typeof mission.pointsReward !== "undefined" && (
              <div className="mt-2 text-sm text-neutral-600">
                포인트: {mission.pointsReward}
              </div>
            )}
            {mission.question && (
              <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-800">
                질문: {mission.question}
              </div>
            )}
          </div>

          {/* 타입별 인터랙션 */}
          <div className="space-y-6">
            {(() => {
              const type =
                (
                  mission as unknown as {
                    missionType?: string;
                    quizType?: string;
                  }
                ).missionType ||
                (mission as unknown as { quizType?: string }).quizType ||
                "";
              switch (type) {
                case "QUIZ_TEXT_INPUT":
                  return (
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
                          try {
                            const res = await submitQuizText(
                              missionId,
                              textAnswer
                            );
                            setResultMsg(
                              res.isCorrect ? "정답입니다!" : "오답입니다."
                            );
                          } catch {
                            setResultMsg("제출 실패");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        제출
                      </Button>
                    </div>
                  );
                case "QUIZ_MULTIPLE_CHOICE":
                  return (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        선택지를 고르세요
                      </div>
                      <div className="space-y-2">
                        {(Array.isArray(mission.choices?.choices)
                          ? mission.choices.choices
                          : []
                        ).map((c, idx) => (
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
                          try {
                            const res = await submitQuizChoice(
                              missionId,
                              choiceIndex
                            );
                            setResultMsg(
                              res.isCorrect ? "정답입니다!" : "오답입니다."
                            );
                          } catch {
                            setResultMsg("제출 실패");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        제출
                      </Button>
                    </div>
                  );
                case "QUIZ_IMAGE_UPLOAD":
                case "PHOTO_UPLOAD":
                  return (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">이미지 URL</div>
                      <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="업로드된 이미지 URL"
                        className="w-full h-11 px-3 border rounded-md"
                      />
                      <div className="text-xs text-neutral-600">
                        또는 파일 선택 후 자동 업로드
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          setResultMsg("");
                          try {
                            const fileName = `${Date.now()}_${file.name}`;
                            const { getMissionImageUploadUrl } = await import(
                              "../../../services/missionService"
                            );
                            const { uploadUrl } =
                              await getMissionImageUploadUrl(
                                missionId,
                                fileName
                              );
                            await fetch(uploadUrl, {
                              method: "PUT",
                              body: file,
                              headers: { "Content-Type": file.type },
                            });
                            // 업로드 URL에서 퍼블릭 접근 URL 유추
                            const publicUrl = uploadUrl.split("?")[0];
                            setImageUrl(publicUrl);
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
                          try {
                            const res = await submitQuizImage(
                              missionId,
                              imageUrl
                            );
                            setResultMsg(
                              res.isCorrect ? "정답입니다!" : "오답입니다."
                            );
                          } catch {
                            setResultMsg("제출 실패");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        제출
                      </Button>
                    </div>
                  );
                case "PLACE_VISIT":
                  return (
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-700">
                        해당 장소를 방문하면 완료 처리됩니다.
                      </div>
                      <Button
                        disabled={submitting}
                        onClick={async () => {
                          setSubmitting(true);
                          setResultMsg("");
                          try {
                            const res = await submitQuizNoInput(missionId);
                            setResultMsg(
                              res.isCorrect
                                ? "완료 처리되었습니다."
                                : "처리되었습니다."
                            );
                          } catch {
                            setResultMsg("제출 실패");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        완료 처리하기
                      </Button>
                    </div>
                  );
                case "SURVEY":
                  return (
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
                          try {
                            const res = await submitQuizText(
                              missionId,
                              textAnswer
                            );
                            setResultMsg(
                              res.isCorrect
                                ? "접수되었습니다."
                                : "접수되었습니다."
                            );
                          } catch {
                            setResultMsg("제출 실패");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        제출
                      </Button>
                    </div>
                  );
                default:
                  return (
                    <div className="text-sm text-neutral-600">
                      지원되지 않는 미션 타입입니다.
                    </div>
                  );
              }
            })()}

            {resultMsg && (
              <div className="text-center text-sm text-neutral-700">
                {resultMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

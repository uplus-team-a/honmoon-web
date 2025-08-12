"use client";

/**
 * 미션 퀴즈 제출 페이지
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../../shared/components/ui/button";
import {
  submitQuizText,
  submitQuizChoice,
  submitQuizImage,
  fetchMissionPlaceById,
} from "../../../services/missionService";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = Number(params.missionId);

  const [title, setTitle] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [choiceIndex, setChoiceIndex] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMissionPlaceById(missionId)
      .then((m) => {
        if (cancelled) return;
        setTitle(m.title);
      })
      .catch(() => setTitle(""));
    return () => {
      cancelled = true;
    };
  }, [missionId]);

  const handleSubmitText = async () => {
    setSubmitting(true);
    setResult("");
    try {
      const res = await submitQuizText(missionId, textAnswer);
      setResult(res.isCorrect ? "정답입니다!" : "오답입니다.");
    } catch {
      setResult("제출 실패");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitChoice = async () => {
    setSubmitting(true);
    setResult("");
    try {
      const res = await submitQuizChoice(missionId, choiceIndex);
      setResult(res.isCorrect ? "정답입니다!" : "오답입니다.");
    } catch {
      setResult("제출 실패");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitImage = async () => {
    setSubmitting(true);
    setResult("");
    try {
      const res = await submitQuizImage(missionId, imageUrl);
      setResult(res.isCorrect ? "정답입니다!" : "오답입니다.");
    } catch {
      setResult("제출 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">퀴즈 제출</h1>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로가기
        </Button>
      </div>
      <div className="mb-6 text-gray-700">미션: {title || missionId}</div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-sm font-medium">텍스트 정답</div>
          <input
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="정답을 입력하세요"
            className="w-full h-10 px-3 border rounded-md"
          />
          <Button disabled={submitting} onClick={handleSubmitText}>
            제출
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">선택지 정답</div>
          <select
            value={choiceIndex}
            onChange={(e) => setChoiceIndex(Number(e.target.value))}
            className="w-full h-10 px-3 border rounded-md"
          >
            <option value={0}>0번</option>
            <option value={1}>1번</option>
            <option value={2}>2번</option>
            <option value={3}>3번</option>
          </select>
          <Button disabled={submitting} onClick={handleSubmitChoice}>
            제출
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">이미지 URL 정답</div>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="업로드된 이미지 URL"
            className="w-full h-10 px-3 border rounded-md"
          />
          <Button disabled={submitting} onClick={handleSubmitImage}>
            제출
          </Button>
        </div>

        {result && (
          <div className="mt-2 text-center text-sm text-gray-700">{result}</div>
        )}
      </div>
    </div>
  );
}

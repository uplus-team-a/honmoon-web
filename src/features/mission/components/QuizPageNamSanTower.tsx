"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import markers from "../../map/data/markers";
import { Button } from "../../../shared/components/ui/button";
import { MarkerImage } from "../../../shared/components/ui/marker-image";
import { ArrowLeft, MapPin, Calendar, Star, Trophy, CheckCircle, XCircle, User } from "lucide-react";

interface QuizPagesProps {
  markerId: number;
}

export default function QuizPageNamSanTower({ markerId }: QuizPagesProps) {
  const router = useRouter();
  const marker = markers.find((m) => m.id === markerId);

  console.log(marker);

  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 퀴즈 데이터
  const quizData = {
    question: "위 사진에서 보이는는 인물의 이름은?",
    correctAnswers: ["애비", "Abby", "abby", "ABBY"], // 한글/영어 모두 정답
    personImage: "https://i.namu.wiki/i/rgoWadPFoFyeowJo8K2SiVNJBf2r3u-OhyeUZKuq7CFJhnIfpdrDocyhpCRRdz191lROgtSbxHYiA-GKoJguRQ3grWWeWGnfXMxGn4rJv7a2TP2OymGEWJcA0h7LYM9zE_vFCgGxqdiqxHMiuUr08g.webp", // 임시 인물 이미지
    hintImage: "https://i.namu.wiki/i/bIktRDcHtOdhQwzNF35YhnnStzG0wJwFzEmS3KvPW44W1ueOIa20XAxlcjN__he4W71IdChT7mw4J-OZsQawAAQy5usIhBczkxhQ2RZ9h48GXycs36F0CschgLtCMBvWRzCXENAaoVClIIx2--LPqg.webp", // 힌트용 다른 사진
    hintText: "이것까지 보고도 모르면 바보!" // 힌트 텍스트
  };

  const handleSubmitAnswer = () => {
    if (userAnswer.trim() === "") return;
    
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswers = quizData.correctAnswers.map(answer => answer.toLowerCase());
    
    const correct = normalizedCorrectAnswers.includes(normalizedUserAnswer);
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleRetry = () => {
    setUserAnswer("");
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleComplete = () => {
    if (isCorrect) {
      alert("축하합니다! 스탬프를 획득했습니다! 🎉");
      // 여기에 스탬프 발급 로직 추가
    }
    router.push("/");
  };

  if (!marker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            마커를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">
            요청하신 마커 정보가 존재하지 않습니다.
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
          <h1 className="text-lg font-semibold text-gray-900">인물 퀴즈</h1>
          <div className="w-9" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-md mx-auto bg-white">
        {/* 이미지 섹션 */}
        <div className="relative">
          <MarkerImage
            src={marker.image}
            alt={marker.title}
            width="w-full"
            height="h-64"
            shape="rounded"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
            퀴즈 #{marker.id}
          </div>
        </div>

        {/* 퀴즈 섹션 */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {marker.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {marker.description}
            </p>

            {/* 인물 이미지 */}
            <div className="bg-gray-50 p-6 rounded-xl mb-6 text-center">
              <img
                src={showHint ? quizData.hintImage : quizData.personImage}
                alt="인물 사진"
                className="w-92 h-64 object-cover rounded-lg mx-auto shadow-lg"
              />
              {showHint && (
                <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                  💡 {quizData.hintText}
                </div>
              )}
            </div>

            {/* 퀴즈 문제 */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                {quizData.question}
              </h3>

              {/* 답변 입력 */}
              <div className="space-y-3">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="인물의 이름을 입력하세요"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center text-lg"
                  disabled={isAnswered}
                />
                
                {/* 힌트 */}
                <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                  💡 한글이나 영어로 입력하세요. (예: 더피, Derpy)
                </div>
              </div>
            </div>

            {/* 결과 메시지 */}
            {isAnswered && (
              <div className={`p-4 rounded-xl mb-6 ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
              }`}>
                <div className="flex items-center">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-600 mr-2" />
                  )}
                  <span className={`font-medium ${
                    isCorrect ? 'text-green-800' : 'text-orange-800'
                  }`}>
                    {isCorrect ? '정답입니다! 🎉' : '틀렸습니다. 다시 한번 생각해보세요!'}
                  </span>
                </div>
                {isCorrect && (
                  <p className="text-green-700 text-sm mt-2">
                    스탬프 1개를 획득했습니다!
                  </p>
                )}
                {!isCorrect && (
                  <p className="text-orange-700 text-sm mt-2">
                    아래 버튼을 눌러 힌트를 확인하세요.
                  </p>
                )}
              </div>
            )}

            {/* 힌트 버튼 */}
            {isAnswered && !isCorrect && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                  onClick={() => setShowHint(!showHint)}
                >
                  {showHint ? "원래 사진 보기" : "힌트 보기"}
                </Button>
              </div>
            )}

            {/* 보상 정보 */}
            <div className="flex items-center p-4 bg-green-50 rounded-xl mb-6">
              <Star className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-green-900">보상</div>
                <div className="text-sm text-green-700">
                  정답 시 스탬프 1개 획득
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            {!isAnswered ? (
              <Button
                className="w-full h-12 text-base font-medium bg-blue-200 hover:bg-blue-300"
                onClick={handleSubmitAnswer}
                disabled={userAnswer.trim() === ""}
              >
                답변 제출
              </Button>
            ) : (
              <>
                {isCorrect ? (
                  <Button
                    className="w-full h-12 text-base font-medium"
                    onClick={handleComplete}
                  >
                    완료하기
                  </Button>
                ) : (
                  <Button
                    className="w-full h-12 text-base font-medium bg-blue-200 hover:bg-blue-300"
                    onClick={handleRetry}
                  >
                    다시 시도
                  </Button>
                )}
              </>
            )}

            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium"
              onClick={() => {
                router.push(`/?focus=${marker.id}`);
              }}
            >
              지도에서 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
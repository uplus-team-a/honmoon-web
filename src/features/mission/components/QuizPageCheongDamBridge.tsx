"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import markers from "../../map/data/markers";
import { Button } from "../../../shared/components/ui/button";
import { MarkerImage } from "../../../shared/components/ui/marker-image";
import { ArrowLeft, MapPin, Calendar, Star, Trophy, CheckCircle, XCircle } from "lucide-react";

interface QuizPagesProps {
  markerId: number;
}

export default function QuizPageCheongDamBridge({ markerId }: QuizPagesProps) {
  const router = useRouter();
  const marker = markers.find((m) => m.id === markerId);

  console.log(marker);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // 퀴즈 데이터
  const quizData = {
    question: "헌트릭스가 해당 장소(지하철, 한강다리 아래)에서 악귀와의 전투 중 부른 노래는?",
    options: [
      { id: 1, text: "1번. Golden", image: "https://i.namu.wiki/i/o52cBMcEYNzl7ngbHUFxBd8fkZdsEUEF4rTByLaalEMJfariHpuuUdfEbIVJKc--ca3Wo28J6DSmDPTsosjdgIiZGfE4rkkbZSyI-SuODGwyYX2Gc-6IiNVnWL2t2Ty26fxJ0OtA0TG4WzJySAD8yA.webp" },
      { id: 2, text: "2번. How It's Done", image: "https://i.namu.wiki/i/aF73FDFVSgMJ8WBkdAjIYXJVfGUhmDWe1Fpvhh4VV0KXpyoTwYFoWshnQelWRqBQie4qBVjiWyADlgsHd9IOJSjE8WoDWILre73r0zoFqslNDAs5kDb_gG44Zpi4ZjSrfVUoUnNyKYqEu_LFTAcCvw.webp" },
      { id: 3, text: "3번. Takedown", image: "https://i.namu.wiki/i/K6_OCZtAyeLbkousvZHPR7A6QwD7gR1bN_fW2R9QCkta-qychRW-KbpyhzJoDs29CqOBXeEf8aDJoqVJtRPRMA_MW6T2MorJH1bd8mXIisN9Lc7RxFaSEqY0bSmUSNGtpTHYwXBG1J8FUWuIGX4CrA.webp" },
      { id: 4, text: "4번. What It Sounds Like", image: "https://i.namu.wiki/i/r2yW9o0xsJEwncxmzuC5j2pt_rrW0U2YkClAU2xRr_yrhDdcZYnP9_876YD0MtdMiLZSz0QVE-vO-nuEXUbv1Lxsx9X9vUAY3iR3AFlFvoO2PQHHfuet_1xkt-CGTTv6VPXY774xl0lzJf9nsC16aA.webp" }
    ],
    correctAnswer: 3
  };

  const handleAnswerSelect = (answerId: number) => {
    if (isAnswered) return; // 이미 답변한 경우 무시
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === quizData.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
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
          <h1 className="text-lg font-semibold text-gray-900">퀴즈 미션</h1>
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

            {/* 퀴즈 문제 */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                {quizData.question}
              </h3>

                             {/* 선택지들 */}
               <div className="space-y-3">
                 {quizData.options.map((option) => {
                   const isSelected = selectedAnswer === option.id;
                   const isCorrectAnswer = option.id === quizData.correctAnswer;
                   const showResult = isAnswered && (isSelected || (isCorrect && isCorrectAnswer));

                   // 이미지별로 다른 object-position 적용
                   const getImagePosition = (id: number) => {
                     switch (id) {
                       case 1: return '50% 0%'; // 1번 이미지: 가로 중앙, 위쪽 끝
                       case 2: return '50% 0%'; // 2번 이미지: 가로 중앙, 위쪽 끝
                       case 3: return '50% 50%'; // 3번 이미지: 가로 중앙, 세로 중앙
                       case 4: return '50% 70%'; // 4번 이미지: 왼쪽(오른쪽) 50%, 아래쪽 30%
                       default: return 'center center';
                     }
                   };

                   let optionStyle = "border-2 rounded-lg cursor-pointer transition-all overflow-hidden";
                   
                   if (isAnswered) {
                     if (isCorrect && isCorrectAnswer) {
                       optionStyle += " border-green-500 bg-green-50";
                     } else if (isSelected && !isCorrectAnswer) {
                       optionStyle += " border-red-500 bg-red-50";
                     } else {
                       optionStyle += " border-gray-200 bg-gray-50";
                     }
                   } else {
                     optionStyle += isSelected 
                       ? " border-blue-500 bg-blue-50" 
                       : " border-gray-200 hover:border-gray-300";
                   }

                   return (
                     <div
                       key={option.id}
                       className={optionStyle}
                       onClick={() => handleAnswerSelect(option.id)}
                     >
                       <div className="relative">
                         <img
                           src={option.image}
                           alt={option.text}
                           className="w-full h-32 object-cover"
                           style={{ objectPosition: getImagePosition(option.id) }}
                         />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                             <span className="font-bold text-gray-900 text-lg">
                               {option.text}
                             </span>
                           </div>
                         </div>
                         {showResult && (
                           <div className="absolute top-2 right-2">
                             {isCorrect && isCorrectAnswer ? (
                               <CheckCircle className="w-6 h-6 text-green-600 bg-white rounded-full" />
                             ) : isSelected ? (
                               <XCircle className="w-6 h-6 text-red-600 bg-white rounded-full" />
                             ) : null}
                           </div>
                         )}
                       </div>
                     </div>
                   );
                 })}
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
                     다른 선택지를 골라보세요.
                   </p>
                 )}
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
                className="w-full h-12 text-base font-medium"
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
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
                    className="w-full h-12 text-base font-medium"
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
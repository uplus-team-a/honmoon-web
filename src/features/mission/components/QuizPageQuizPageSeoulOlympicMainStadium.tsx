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

export default function QuizPageSeoulOlympicMainStadium({ markerId }: QuizPagesProps) {
  const router = useRouter();
  const marker = markers.find((m) => m.id === markerId);

  console.log(marker);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // 퀴즈 데이터
  const quizData = {
    question: "헌트릭스가 해당 장소에서 공연하기 전, 비행기 안에서 먹은 음식이 아닌 것은?",
    options: [
      { id: 1, text: "1번. 김밥", image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Gimbap_%28pixabay%29.jpg" },
      { id: 2, text: "2번. 호떡", image: "https://i.namu.wiki/i/-vMvKRJlY0tB9nw0rLEYsT0u8Dzv9mq9x2mAyc2gp8sJOOEUaasTPUPmQlCentQ8hlked3nek-EFY2aLnWCo9Q.webp" },
      { id: 3, text: "3번. 순대", image: "https://i.namu.wiki/i/XLAPWkGJqNSq_mm3VoMhPJbsw8brDna42Dluv-1Jed06w36mGyfgImfOwziYTc74G0JeIjpwOKvMWOYT-CA_IQ.webp" },
      { id: 4, text: "4번. 컵라면", image: "https://img.seoul.co.kr/img/upload/2018/10/13/SSI_20181013151318.jpg" },
      { id: 5, text: "5번. 떡볶이", image: "https://i.namu.wiki/i/A5AIHovo1xwuEjs7V8-aKpZCSWY2gN3mZEPR9fymaez_J7ufmI9B7YyDBu6kZy9TC9VWJatXVJZbDjcYLO2S8Q.webp" },
      { id: 6, text: "6번. 어묵탕", image: "https://static.wtable.co.kr/image/production/service/recipe/2639/a644f198-d484-4e7f-9ce7-c90d2f1c8235.jpg?size=800x800" }
    ],
    correctAnswer: 5
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
                       case 1: return '50% 55%';
                       case 2: return '50% 40%';
                       case 3: return '50% 45%';
                       case 4: return '50% 40%';
                       case 5: return '50% 55%';
                       case 6: return '50% 40%';
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
                   <>
                     <p className="text-green-700 text-sm mt-2">
                       스탬프 1개를 획득했습니다!
                     </p>
                     {/* 정답 확인 이미지 */}
                     <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                       <h4 className="text-sm font-medium text-green-800 mb-3 text-center">
                         정답 확인
                       </h4>
                       <div className="relative">
                         <img
                           src="https://1.gall-img.com/hygall/files/attach/images/82/850/699/634/753341e5765570f5e27907f5d93d8cd0.png"
                           alt="정답 확인 이미지"
                           className="w-full h-42 object-cover rounded-lg"
                           style={{ objectPosition: '0% center' }}
                         />
                         <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                           <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                             <span className="font-bold text-green-800 text-sm">
                               정답: 떡볶이
                             </span>
                           </div>
                         </div>
                       </div>
                     </div>
                   </>
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
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import markers from "../../map/data/markers";
import { Button } from "../../../shared/components/ui/button";
import { MarkerImage } from "../../../shared/components/ui/marker-image";
import { ArrowLeft, MapPin, Calendar, Star, Trophy, CheckCircle, XCircle, User, Upload, Camera } from "lucide-react";

interface QuizPagesProps {
  markerId: number;
}

export default function QuizPageNaksanPark({ markerId }: QuizPagesProps) {
  const router = useRouter();
  const marker = markers.find((m) => m.id === markerId);

  console.log(marker);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 퀴즈 데이터
  const quizData = {
    question: "사진을 업로드하여 방문 인증해주세요!",
    description: "이 장소에 방문했다면 사진을 촬영하여 업로드해주세요."
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!uploadedImage) return;
    
    setIsLoading(true);
    
    try {
      // 이미지를 Base64로 변환
      const base64Image = await fileToBase64(uploadedImage);
      
      // GPT API 호출 (실제 구현 시에는 환경변수로 API 키 관리)
      const gptResponse = await callGPTVisionAPI(base64Image);
      
      console.log("GPT 이미지 요약 결과:", gptResponse);
      
      // "야경 불빛 환상적"일 때만 정답으로 처리
      const isCorrectAnswer = gptResponse === "야경 불빛 환상적";
      setIsCorrect(isCorrectAnswer);
      setIsAnswered(true);
      
    } catch (error) {
      console.error("GPT API 호출 중 오류:", error);
      // 오류가 발생하면 오답으로 처리
      setIsCorrect(false);
      setIsAnswered(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // data:image/jpeg;base64, 부분 제거
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const callGPTVisionAPI = async (base64Image: string) => {
    // 실제 GPT Vision API 호출 로직
    // 여기서는 시뮬레이션된 응답을 반환
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const mockResponses = [
          "자연 풍경 아름다움",
          "도시 전망 멋짐",
          "공원 산책 평화로움",
          "전망대 높이 장관",
          "야경 불빛 환상적"
        ];
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        resolve(randomResponse);
      }, 1000);
    });
  };

  const handleRetry = () => {
    setUploadedImage(null);
    setImagePreview("");
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleComplete = () => {
    if (isCorrect) {
      alert("축하합니다! 방문 인증이 완료되었습니다! 🎉");
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
          <h1 className="text-lg font-semibold text-gray-900">방문 인증</h1>
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
            인증 #{marker.id}
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

            {/* 이미지 업로드 섹션 */}
            <div className="bg-blue-50 p-6 rounded-xl mb-6 text-center">
              <div className="mb-4">
                <Camera className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  방문 인증 사진
                </h3>
                <p className="text-sm text-blue-700">
                  이 장소에서 촬영한 사진을 업로드해주세요
                </p>
              </div>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-blue-500 mb-2" />
                    <span className="text-blue-600 font-medium">사진 업로드</span>
                    <span className="text-blue-500 text-sm">클릭하여 선택</span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="업로드된 사진"
                    className="w-full h-64 object-cover rounded-lg mx-auto shadow-lg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadedImage(null);
                      setImagePreview("");
                    }}
                    className="text-sm"
                  >
                    다른 사진 선택
                  </Button>
                </div>
              )}
            </div>

            {/* 퀴즈 문제 */}
            <div className="bg-green-50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                {quizData.question}
              </h3>
              <p className="text-green-700 text-sm">
                {quizData.description}
              </p>
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
                    {isCorrect ? '방문 인증이 완료되었습니다! 🎉' : '인증에 실패했습니다.'}
                  </span>
                </div>
                {isCorrect && (
                  <p className="text-green-700 text-sm mt-2">
                    스탬프 1개를 획득했습니다!
                  </p>
                )}
                {!isCorrect && (
                  <p className="text-orange-700 text-sm mt-2">
                    다른 사진을 업로드해보세요!
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
                  인증 완료 시 스탬프 1개 획득
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
                disabled={!uploadedImage || isLoading}
              >
                {isLoading ? "처리 중..." : "인증 완료"}
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
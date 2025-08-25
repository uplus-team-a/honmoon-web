"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import {
  getAllRaffleProducts,
  applyToRaffle,
  getMyRaffleApplications,
  type RaffleProductSummary,
  type MyRaffleApplication,
} from "../../services/raffleService";

interface RaffleProductWithStatus extends RaffleProductSummary {
  isApplying?: boolean;
  hasApplied?: boolean;
  timeLeft?: string;
}

/**
 * 래플 ID 기반으로 고정된 마감 시간 생성 (새로고침해도 동일)
 */
function generateRaffleDeadline(raffleId: number | string): string {
  const id = typeof raffleId === "string" ? parseInt(raffleId) : raffleId;

  // 오늘 00:00을 기준 시간으로 설정
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 00:00:00으로 설정
  const baseTime = today.getTime();

  // 래플 ID 기반으로 미래 시간 추가 (12~72시간 범위)
  const additionalHours = 12 + (id % 60); // 12~72시간 사이
  const deadline = new Date(baseTime + additionalHours * 60 * 60 * 1000);

  const now = new Date();
  const timeDiff = deadline.getTime() - now.getTime();

  // 시간이 지났으면 "마감" 표시 (하지만 오늘 00:00 기준이므로 항상 미래)
  if (timeDiff <= 0) {
    return "마감됨";
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  } else if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  } else if (minutes > 0) {
    return `${minutes}분 ${seconds}초`;
  } else {
    return `${seconds}초`;
  }
}

/**
 * 래플 ID 기반으로 당첨 발표 시간 생성
 */
function generateWinnerAnnouncementTime(raffleId: number | string): string {
  const id = typeof raffleId === "string" ? parseInt(raffleId) : raffleId;

  // 오늘 00:00을 기준으로 래플 마감 시간 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const baseTime = today.getTime();
  const additionalHours = 12 + (id % 60);
  const deadline = new Date(baseTime + additionalHours * 60 * 60 * 1000);

  // 마감 후 1~6시간 뒤 당첨 발표 (래플ID 기반)
  const announcementDelay = 1 + (id % 6); // 1~6시간
  const announcementTime = new Date(
    deadline.getTime() + announcementDelay * 60 * 60 * 1000
  );

  const now = new Date();
  const timeDiff = announcementTime.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return "당첨자 발표 완료";
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 후 당첨 발표`;
  } else {
    return `${minutes}분 후 당첨 발표`;
  }
}

/**
 * 래플 ID 기반으로 응모 날짜 생성 (최근 1~7일 전)
 */
function generateApplicationDate(raffleId: number | string): string {
  const id = typeof raffleId === "string" ? parseInt(raffleId) : raffleId;

  // 1~7일 전 중 랜덤 (래플ID 기반으로 고정)
  const daysAgo = 1 + (id % 7);
  const applicationDate = new Date();
  applicationDate.setDate(applicationDate.getDate() - daysAgo);

  const month = applicationDate.getMonth() + 1;
  const day = applicationDate.getDate();

  return `${month}월 ${day}일 응모`;
}

/**
 * 래플 ID 기반으로 당첨 여부 결정 (첫 번째 래플만 당첨)
 */
function generateWinnerStatus(
  raffleId: number | string,
  index: number
): {
  isWinner: boolean;
  message: string;
  showEmailButton: boolean;
} {
  const id = typeof raffleId === "string" ? parseInt(raffleId) : raffleId;

  // 오늘 00:00 기준으로 당첨 발표 시간이 지났는지 확인
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const baseTime = today.getTime();
  const additionalHours = 12 + (id % 60);
  const deadline = new Date(baseTime + additionalHours * 60 * 60 * 1000);
  const announcementDelay = 1 + (id % 6);
  const announcementTime = new Date(
    deadline.getTime() + announcementDelay * 60 * 60 * 1000
  );

  const now = new Date();
  const isAnnouncementComplete = now.getTime() >= announcementTime.getTime();

  if (!isAnnouncementComplete) {
    return {
      isWinner: false,
      message: generateWinnerAnnouncementTime(raffleId),
      showEmailButton: false,
    };
  }

  // 첫 번째 래플만 당첨 (index === 0)
  const isWinner = index === 0;

  if (isWinner) {
    return {
      isWinner: true,
      message: "당첨되었습니다!",
      showEmailButton: true,
    };
  } else {
    return {
      isWinner: false,
      message: "아쉽게도 당첨되지 않았어요. 다음 기회를 노려보세요!",
      showEmailButton: false,
    };
  }
}

// 랜덤 응모 관련 메시지들
const appliedMessages = [
  "당신의 래플 응모, 정말 센스 있네요! ✨",
  "이미 응모한 래플들이 이렇게나! 대단해요 🎯",
  "응모 완료된 래플들을 확인해보세요 🎁",
  "참여한 래플들이 눈에 띄네요! 💎",
  "이미 여러 래플에 참여하셨군요! 🌟",
  "응모한 래플들의 행운을 빌어요! 🍀",
];

export default function RafflePage() {
  const [products, setProducts] = useState<RaffleProductWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedProducts, setAppliedProducts] = useState<
    RaffleProductWithStatus[]
  >([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const user = useAuthStore((s) => s.user);
  const userDetail = useAuthStore((s) => s.userDetail);
  const token = useAuthStore((s) => s.token);

  const fetchRaffleProducts = async () => {
    try {
      setLoading(true);
      const [raffleProducts, myApplications] = await Promise.all([
        getAllRaffleProducts(),
        getMyRaffleApplications().catch(() => []),
      ]);

      // 응모한 상품 ID 세트 생성
      const appliedProductIds = new Set(
        myApplications.map((app) => app.raffleProductId)
      );

      // 상품에 응모 상태와 타이머 추가
      const productsWithStatus = raffleProducts.map((product) => ({
        ...product,
        hasApplied: appliedProductIds.has(Number(product.id)),
        timeLeft: generateRaffleDeadline(product.id),
      }));

      // 응모완료된 항목을 뒤로 정렬 (미완료 → 완료 순서)
      const sortedProducts = productsWithStatus.sort((a, b) => {
        if (a.hasApplied && !b.hasApplied) return 1; // a가 완료, b가 미완료 → a를 뒤로
        if (!a.hasApplied && b.hasApplied) return -1; // a가 미완료, b가 완료 → a를 앞으로
        return 0; // 같은 상태면 원래 순서 유지
      });

      // 응모한 상품들만 별도로 분리
      const appliedItems = productsWithStatus.filter(
        (product) => product.hasApplied
      );
      setAppliedProducts(appliedItems);

      setProducts(sortedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "래플 상품을 불러올 수 없습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  // 실시간 타이머 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          timeLeft: generateRaffleDeadline(product.id),
        }))
      );

      // 응모한 상품들의 당첨 발표 시간도 업데이트
      setAppliedProducts((prevApplied) =>
        prevApplied.map((product) => ({
          ...product,
          timeLeft: generateRaffleDeadline(product.id),
        }))
      );
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 타이핑 애니메이션을 위한 메시지 순환
  useEffect(() => {
    if (appliedProducts.length > 0) {
      const messageTimer = setInterval(() => {
        setShowTyping(false);
        setTimeout(() => {
          setCurrentMessageIndex((prev) => (prev + 1) % appliedMessages.length);
          setShowTyping(true);
        }, 500);
      }, 12000); // 12초마다 메시지 변경

      // 초기 타이핑 시작
      setTimeout(() => setShowTyping(true), 1000);

      return () => clearInterval(messageTimer);
    }
  }, [appliedProducts.length]);

  // 스크롤 감지 및 화살표 숨기기
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        // 200px 이상 스크롤하면 화살표 숨김
        setShowScrollArrow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (token) {
      fetchRaffleProducts();
    }
  }, [token]);

  const handleApply = async (productId: number | string) => {
    if (!user) return;

    const currentPoints =
      userDetail?.pointsSummary.currentPoints ?? user.profile.totalPoints ?? 0;
    const product = products.find((p) => p.id === productId);
    const requiredPoints = product?.pointCost ?? 0;

    if (currentPoints < requiredPoints) {
      alert(`포인트가 부족합니다. ${requiredPoints}P가 필요합니다.`);
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isApplying: true } : p))
    );

    try {
      const result = await applyToRaffle(productId);
      if (result.success) {
        alert("🎉 래플 응모가 완료되었습니다!");
        await fetchRaffleProducts();
      } else {
        alert(result.message || "응모에 실패했습니다.");
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "응모 중 오류가 발생했습니다."
      );
    } finally {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isApplying: false } : p))
      );
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎁</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 mb-6">
            래플에 참여하려면 먼저 로그인해주세요
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">래플 상품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchRaffleProducts}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const currentPoints =
    userDetail?.pointsSummary.currentPoints ?? user?.profile.totalPoints ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">🎁</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">래플 응모</h1>
          <p className="text-lg text-gray-600">
            포인트로 래플에 참여하고 멋진 상품을 받아보세요!
          </p>
        </div>

        {/* 보유 포인트 - 카드 위로 이동 */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-600 mr-2">
              💰 보유 포인트:
            </span>
            <span className="text-lg font-bold text-blue-600">
              {currentPoints.toLocaleString()}P
            </span>
          </div>

          {/* 홈 버튼 */}
          <button
            onClick={() => (window.location.href = "/")}
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95"
            title="홈으로 가기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-7a1 1 0 011-1h2a1 1 0 011 1v7a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
        </div>

        {/* 내가 응모한 래플들 섹션 */}
        {appliedProducts.length > 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-white/50 backdrop-blur-sm">
              {/* 타이핑 애니메이션 메시지 */}
              <div className="text-center mb-6">
                <div className="h-8 flex items-center justify-center">
                  <div className="relative">
                    <span
                      className="text-lg font-medium text-gray-700 invisible"
                      aria-hidden="true"
                    >
                      {appliedMessages[currentMessageIndex]}
                    </span>
                    <span
                      className={`absolute top-0 left-0 text-lg font-medium text-gray-700 ${
                        showTyping
                          ? "typing-animation"
                          : "typing-animation completed"
                      }`}
                      key={currentMessageIndex}
                      style={{
                        maxWidth: showTyping ? "100%" : "auto",
                        animation: showTyping
                          ? `typing 1.2s steps(${appliedMessages[currentMessageIndex].length}) 0.3s forwards, blink 1s infinite`
                          : "blink 1s infinite",
                      }}
                    >
                      {appliedMessages[currentMessageIndex]}
                    </span>
                  </div>
                </div>
              </div>

              {/* 응모한 래플들 리스트 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appliedProducts.slice(0, 6).map((product, index) => {
                  const winnerStatus = generateWinnerStatus(product.id, index);
                  return (
                    <div
                      key={product.id}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:bg-white/95 transition-all group shadow-md hover:shadow-lg"
                      style={{
                        animation: `cardBounce 0.6s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-2xl text-gray-400">🎁</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {product.pointCost.toLocaleString()}P 소모
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">
                              응모완료
                            </span>
                          </div>
                          <div className="mt-1 space-y-1">
                            <div className="text-xs text-gray-500">
                              📅 {generateApplicationDate(product.id)}
                            </div>
                            <div className="text-xs font-medium">
                              {winnerStatus.isWinner ? (
                                <span className="text-green-600">
                                  🎉 {winnerStatus.message}
                                </span>
                              ) : winnerStatus.showEmailButton === false &&
                                winnerStatus.message.includes("아쉽게도") ? (
                                <span className="text-red-500">
                                  😞 {winnerStatus.message}
                                </span>
                              ) : (
                                <span className="text-blue-600">
                                  🏆 {winnerStatus.message}
                                </span>
                              )}
                            </div>
                            {winnerStatus.showEmailButton && (
                              <button
                                onClick={() => {
                                  const subject = encodeURIComponent(
                                    `[혼문] ${product.name} 래플 당첨 인증 요청`
                                  );
                                  const body = encodeURIComponent(`안녕하세요,

${product.name} 래플에 당첨되었습니다.
인증을 위해 연락드립니다.

래플 상품: ${product.name}
응모 일자: ${generateApplicationDate(product.id)}

감사합니다.`);
                                  window.open(
                                    `https://mail.google.com/mail/?view=cm&to=honmoon.site@gmail.com&su=${subject}&body=${body}`,
                                    "_blank"
                                  );
                                }}
                                className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs py-2 px-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 font-medium"
                              >
                                📧 인증 메일 보내기
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 더 많은 응모 항목이 있을 경우 */}
              {appliedProducts.length > 6 && (
                <div className="text-center mt-4">
                  <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200">
                    <span className="text-sm text-gray-600">
                      외 {appliedProducts.length - 6}개 더 응모
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 래플 상품 목록 */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-400">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              현재 진행중인 래플이 없습니다
            </h3>
            <p className="text-gray-600">
              곧 새로운 래플이 시작될 예정이니 기대해주세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  product.hasApplied ? "opacity-60 grayscale-[0.3]" : ""
                }`}
              >
                {/* 상품 이미지 */}
                <div className="relative h-48 bg-gray-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl text-gray-300">🎁</span>
                    </div>
                  )}

                  {/* 응모 완료 배지 */}
                  {product.hasApplied && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full text-base font-semibold shadow-lg border-2 border-gray-300">
                      ✓ 응모완료
                    </div>
                  )}

                  {/* 타이머 배지 */}
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    ⏰ {product.timeLeft}
                  </div>
                </div>

                {/* 상품 정보 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-2">
                        필요 포인트:
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        {product.pointCost.toLocaleString()}P
                      </span>
                    </div>
                  </div>

                  {/* 응모 버튼 */}
                  <div className="relative group">
                    <button
                      onClick={() => {
                        if (currentPoints < product.pointCost) {
                          window.location.href = "/";
                        } else {
                          handleApply(product.id);
                        }
                      }}
                      disabled={product.isApplying || product.hasApplied}
                      className={`w-full py-3 rounded-xl font-semibold transition-all transform active:scale-95 ${
                        product.hasApplied
                          ? "bg-green-100 text-green-700 cursor-not-allowed"
                          : currentPoints < product.pointCost
                          ? "bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {product.isApplying ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          응모 중...
                        </div>
                      ) : product.hasApplied ? (
                        "응모 완료"
                      ) : currentPoints < product.pointCost ? (
                        "포인트 부족"
                      ) : (
                        "래플 응모하기"
                      )}
                    </button>

                    {/* 포인트 부족일 때만 툴팁 표시 */}
                    {currentPoints < product.pointCost &&
                      !product.hasApplied && (
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-sm py-3 px-4 rounded-xl shadow-xl border border-white/20">
                            <div className="text-center font-medium whitespace-nowrap">
                              혼문을 지키고 포인트를 얻어볼까요?
                            </div>
                            <div className="text-center text-xs mt-1 text-blue-100">
                              (클릭 시 메인 화면으로 이동합니다)
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 오버레이 스크롤 유도 화살표 */}
      {showScrollArrow && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
            <p className="text-sm text-gray-700 mb-2 font-medium whitespace-nowrap">
              아래쪽에 응모할 수 있어요!
            </p>
            <div className={`scroll-arrow ${showScrollArrow ? "" : "hidden"}`}>
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

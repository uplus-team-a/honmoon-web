"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/auth";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/card";

const Header = () => {
  const pathname = usePathname();
  const isMyProfilePage = pathname === "/my-profile";

  // 개별 selector 사용으로 서버 스냅샷 안정화
  const user = useAuthStore((s) => s.user);
  const userDetail = useAuthStore((s) => s.userDetail);
  const token = useAuthStore((s) => s.token);
  const initializeFromStorage = useAuthStore((s) => s.initializeFromStorage);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const fetchProfileDetail = useAuthStore((s) => s.fetchProfileDetail);
  const fetchMissionStats = useAuthStore((s) => s.fetchMissionStats);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    if (token) {
      fetchProfile().catch(() => {});
      fetchProfileDetail().catch(() => {});
      fetchMissionStats().catch(() => {});
    }
  }, [token, fetchProfile, fetchProfileDetail, fetchMissionStats]);

  const isLoggedIn = !!token && !!user;

  return (
    <header className="relative z-30 w-full border-b border-neutral-200/60 bg-white/90 backdrop-blur-md px-4 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          {isMyProfilePage ? (
            <Link href="/" className="inline-flex items-center shrink-0">
              <Image
                src="https://storage.googleapis.com/honmoon-bucket/image/honmmon.png"
                alt="홈"
                width={60}
                height={60}
                className="w-14 h-14 rounded-full border-2 border-neutral-200 object-cover hover:border-blue-300 transition-colors shadow-sm"
              />
            </Link>
          ) : isLoggedIn ? (
            <Link href="/my-profile" className="shrink-0">
              <Image
                src={
                  userDetail?.profile.profileImageUrl ||
                  user?.profile.profileImageUrl ||
                  "https://storage.googleapis.com/honmoon-bucket/image/honmmon.png"
                }
                alt="프로필"
                width={60}
                height={60}
                className="w-14 h-14 rounded-full border-2 border-neutral-200 object-cover hover:border-blue-300 transition-colors shadow-sm"
              />
            </Link>
          ) : (
            <Link href="/login" className="shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-200 flex items-center justify-center hover:from-blue-200 hover:to-purple-200 transition-all cursor-pointer shadow-sm">
                <span className="text-xl">🏛️</span>
              </div>
            </Link>
          )}

          {/* 사용자 정보 - 프로필 이미지 바로 옆에 */}
          {!isMyProfilePage && (
            <div className="flex-1">
              {/* 사용자 기본 정보와 포인트 - 한 줄에 배치 */}
              <div className="flex items-center gap-4">
                {/* 사용자 이름과 이메일 */}
                <div className="flex flex-col">
                  <span className="font-bold text-[16px] text-neutral-900">
                    {isLoggedIn
                      ? userDetail?.profile.nickname ||
                        user?.profile.nickname ||
                        "사용자"
                      : "혼문에 가입해주세요!"}
                  </span>
                  {isLoggedIn && userDetail?.profile.email && (
                    <div className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full w-fit">
                      {userDetail.profile.email}
                    </div>
                  )}
                </div>

                {/* 현재 포인트 - 컴팩트 카드 */}
                {isLoggedIn && userDetail && (
                  <Card className="group relative border-0 shadow-none bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-shadow">
                          <span className="text-white text-sm font-bold">
                            💎
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-600 font-medium">
                            현재
                          </span>
                          <span className="text-[15px] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {userDetail.pointsSummary.currentPoints.toLocaleString()}
                            P
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    {/* 호버 툴팁 */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                      <div className="bg-blue-600 text-white text-xs py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
                        <div className="text-center">
                          <div className="font-bold">현재 보유 포인트</div>
                          <div className="text-blue-100">
                            {userDetail.pointsSummary.currentPoints.toLocaleString()}
                            P
                          </div>
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-600"></div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 활동 통계 - 가로 배열 컴팩트 카드들 */}
                {isLoggedIn && userDetail && (
                  <>
                    {/* 총 적립 */}
                    <Card className="group relative cursor-pointer border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-md hover:scale-105">
                      <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                            <span className="text-white text-sm">↗</span>
                          </div>
                          <span className="text-[14px] text-green-700 font-bold">
                            +
                            {userDetail.pointsSummary.totalEarned.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>

                      {/* 호버 툴팁 */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                        <div className="bg-green-600 text-white text-xs py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
                          <div className="text-center">
                            <div className="font-bold">총 적립 포인트</div>
                            <div className="text-green-100">
                              +
                              {userDetail.pointsSummary.totalEarned.toLocaleString()}
                              P
                            </div>
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-green-600"></div>
                        </div>
                      </div>
                    </Card>

                    {/* 총 사용 */}
                    <Card className="group relative cursor-pointer border-0 bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 transition-all duration-300 hover:shadow-md hover:scale-105">
                      <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-400 to-rose-400 flex items-center justify-center">
                            <span className="text-white text-sm">↙</span>
                          </div>
                          <span className="text-[14px] text-red-700 font-bold">
                            -
                            {userDetail.pointsSummary.totalUsed.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>

                      {/* 호버 툴팁 */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                        <div className="bg-red-600 text-white text-xs py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
                          <div className="text-center">
                            <div className="font-bold">총 사용 포인트</div>
                            <div className="text-red-100">
                              -
                              {userDetail.pointsSummary.totalUsed.toLocaleString()}
                              P
                            </div>
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-600"></div>
                        </div>
                      </div>
                    </Card>

                    {/* 총 활동 */}
                    <Card className="group relative cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-300 hover:shadow-md hover:scale-105">
                      <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-violet-400 flex items-center justify-center">
                            <span className="text-white text-sm">⚡</span>
                          </div>
                          <span className="text-[14px] text-purple-700 font-bold">
                            {userDetail.profile.totalActivities}회
                          </span>
                        </div>
                      </CardContent>

                      {/* 호버 툴팁 */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                        <div className="bg-purple-600 text-white text-xs py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
                          <div className="text-center">
                            <div className="font-bold">총 활동 횟수</div>
                            <div className="text-purple-100">
                              {userDetail.profile.totalActivities}회
                            </div>
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-purple-600"></div>
                        </div>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 우측 버튼들 */}
        <div className="flex items-center gap-2 shrink-0">
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="rounded-lg h-9 px-4 text-[13px] font-medium border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 active:translate-y-[1px] transition-all inline-flex items-center shadow-sm"
            >
              이메일 로그인
            </Link>
          ) : (
            <>
              <Link href="/raffle">
                <Button
                  variant="outline"
                  className="rounded-lg h-9 px-4 text-[13px] font-medium border border-green-500 bg-green-50 text-green-700 hover:bg-green-100 active:translate-y-[1px] transition-all shadow-sm"
                >
                  🎁 래플 응모
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-lg h-9 px-3 text-[12px] border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                  signOut();
                }}
              >
                로그아웃
              </Button>
            </>
          )}
        </div>
      </div>
      {/* 우측 상단 '홈' 버튼 제거 */}
    </header>
  );
};

export default Header;

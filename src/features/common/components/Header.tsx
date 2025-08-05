"use client";

/**
 * 애플리케이션의 상단 헤더 컴포넌트
 */
import Link from 'next/link';

const Header = () => {
    return (
        <header className="w-full border-b shadow-sm px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-4">
                <Link href="/my-profile">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgorcLvoZtje4lJsMPMrMWfKLkWnB1EGmETQ&s"
                        alt="프로필"
                        className="w-14 h-14 rounded-full border-4 border-primary"
                    />
                </Link>
                <div>
                    <div className="font-bold text-lg">더피</div>
                    <div className="text-sm text-muted-foreground">케데헌 맵 | 7/13 스탬프 · 2,450 포인트</div>
                    <div className="text-xs text-primary">Top 5% of K-pop Explorers</div>
                </div>
            </div>

            <div className="mt-4 sm:mt-0">
                <div className="text-sm font-semibold text-foreground mb-1">🎯 다음 목표</div>
                <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden mb-1">
                    <div className="bg-primary h-full w-[80%]"/>
                </div>
                <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[65%]"/>
                </div>
            </div>
        </header>
    );
};

export default Header;

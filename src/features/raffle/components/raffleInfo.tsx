"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";

type RaffleItems = {
  id: string;
  title: string;
  imageUrl: string;
  deadline: string;
};

type ActivityHistoryProps = {
  raffleItems: RaffleItems[];
};

export default function RaffleInfo({ raffleItems }: ActivityHistoryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const deadline = dayjs(raffleItems[activeIndex].deadline);
      const now = dayjs();
      const diff = deadline.diff(now, "second");

      if (diff <= 0) {
        setTimeLeft("00:00:00:00");
      } else {
        const days = String(Math.floor(diff / (60 * 60 * 24))).padStart(2, "0");
        const hours = String(Math.floor((diff / 3600) % 24)).padStart(2, "0");
        const minutes = String(Math.floor((diff / 60) % 60)).padStart(2, "0");
        const seconds = String(diff % 60).padStart(2, "0");
        setTimeLeft(`${days}:${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <div className="p-4">
      {/* 타이머 영역 */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">LUCKY DRAW</h2>
        <p className="text-2xl font-mono">{timeLeft}</p>
      </div>

      {/* 캐러셀 */}
      <div className="w-[70%] mx-auto">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {raffleItems.map((item) => (
            <SwiperSlide key={item.id}>
              <Link href={`/raffle/${item.id}`}>
                <div className="flex flex-col items-center cursor-pointer">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-60 mb-4"
                  />
                  <p className="text-center font-semibold">{item.title}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="relative h-1 bg-gray-300 mt-2">
        <div
          className="absolute h-full bg-black transition-all duration-300"
          style={{
            width: `${100 / raffleItems.length}%`,
            left: `${(100 / raffleItems.length) * activeIndex}%`,
          }}
        />
      </div>
    </div>
  );
}

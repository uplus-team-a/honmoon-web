"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

type RaffleItem = {
  id: string;
  title: string;
  imageUrl: string;
  deadline: string;
};

export default function RaffleInfo() {
  const [raffleItems, setRaffleItems] = useState<RaffleItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  // Supabase 클라이언트 생성 (env 변수는 빌드시 주입됨)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    async function fetchRaffleItems() {
      const { data, error } = await supabase
        .from("raffle_product")
        .select("id, name, image_url, deadline");

      if (error) {
        console.error("Error fetching raffle items:", error);
        return;
      }

      if (data) {
        const formatted = data.map((item) => ({
          id: String(item.id),
          title: item.name,
          imageUrl: item.image_url || "https://via.placeholder.com/320x240",
          deadline:
            item.deadline || new Date(Date.now() + 86400e3).toISOString(),
        }));
        setRaffleItems(formatted);
      }
    }

    fetchRaffleItems();
  }, []);

  useEffect(() => {
    if (raffleItems.length === 0) {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const deadline = dayjs(raffleItems[activeIndex]?.deadline);
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
  }, [activeIndex, raffleItems]);

  if (raffleItems.length === 0) {
    return <div className="p-4 text-center">Loading raffle items...</div>;
  }

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
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={240}
                    height={180}
                    className="mb-4 object-cover rounded"
                    priority={false}
                  />
                  <p className="text-center font-semibold">{item.title}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 진행 인디케이터 */}
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

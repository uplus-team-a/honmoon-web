"use client";

import { useState } from "react";


type RaffleItem = {
    id: string;
    productName: string;
    productImageUrl: string;
    appliedAt: string;
    status: 'APPLY' | 'WIN' | 'LOSE' | string;
  };
  
  type RaffleHistoryProps = {
    raffleHistory: RaffleItem[];
  };


export default function RaffleHistory({raffleHistory} : RaffleHistoryProps) {
//   const allItems = [
//     { name: "까치 호랑이 배지", date: "2025.07.14", status: "대기중" },
//     { name: "사자 보이즈 2차 키링", date: "2025.06.23", status: "당첨" },
//     { name: "한도스 부채", date: "2025.05.21", status: "미당첨" },
//     { name: "엽서 세트", date: "2025.05.05", status: "미당첨" },
//     { name: "스티커 팩", date: "2025.04.20", status: "당첨" },
//     { name: "빈티지 키링", date: "2025.03.11", status: "대기중" },
//   ];
    const allItems = raffleHistory;

//   const allItems = 
//   [
//     {
//       "id": "raffle_001",
//       "productName": "까치 호랑이 배지",
//       "productImageUrl": "https://cdn.example.com/images/badge.png",
//       "appliedAt": "2025-07-14",
//       "status": "APPLY"
//     },
//     {
//       "id": "raffle_002",
//       "productName": "사자 보이즈 2차 키링",
//       "productImageUrl": "https://cdn.example.com/images/keyring.png",
//       "appliedAt": "2025-06-23",
//       "status": "WIN"
//     },
//     {
//       "id": "raffle_003",
//       "productName": "한도스 부채",
//       "productImageUrl": "https://cdn.example.com/images/fan.png",
//       "appliedAt": "2025-05-21",
//       "status": "LOSE"
//     }
//   ]
  

  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Raffle 응모 내역</h2>
      <ul className="divide-y divide-gray-200">
        {visibleItems.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src="https://via.placeholder.com/60"
                alt={item.productName}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div>
                <div className="font-medium">{item.productName}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">

            <div className="text-xs text-gray-500">{item.appliedAt}</div>

            <div
              className="text-xs bg-gray-400 text-white px-2 py-1 rounded-full" >

              {item.status}
            </div>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div
          className="text-center text-sm mt-3 text-gray-500 cursor-pointer hover:underline"
          onClick={handleLoadMore}
        >
          더보기
        </div>
      )}
    </div>
  );
}

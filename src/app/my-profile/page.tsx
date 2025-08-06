import ProfilePage from "../../features/profile/components/ProfilePage";
import ActivityHistory from "features/profile/components/ActivityHistory";
import RaffleHistory from "../../features/profile/components/RaffleHistory";

/**
 * 마이 프로필 페이지 라우트
 */
export default function MyProfileRoute() {
  const activityHistory = [
    {
      id: "raffle_003",
      placeName: "청담동",
      visitedDate: "2025.07.23",
      placeImageUrl: "https://via.placeholder.com/80",
    },
    {
      id: "raffle_003",
      placeName: "청담동",
      visitedDate: "2025.07.23",
      placeImageUrl: "https://via.placeholder.com/80",
    },
    {
      id: "raffle_003",
      placeName: "이태원",
      visitedDate: "2025.07.23",
      placeImageUrl: "https://via.placeholder.com/80",
    },
    {
      id: "raffle_003",
      placeName: "신촌",
      visitedDate: "2025.07.23",
      placeImageUrl: "https://via.placeholder.com/80",
    },
    {
      id: "raffle_003",

      placeName: "홍대",
      visitedDate: "2025.07.22",
      placeImageUrl: "https://via.placeholder.com/80",
    },
    {
      id: "raffle_003",
      placeName: "성수",
      visitedDate: "2025.07.20",
      placeImageUrl: "https://via.placeholder.com/80",
    },
  ];

  const raffleHistory = [
    {
      id: "raffle_001",
      productName: "까치 호랑이 배지",
      productImageUrl: "https://cdn.example.com/images/badge.png",
      appliedAt: "2025-07-14",
      status: "APPLY",
    },
    {
      id: "raffle_002",
      productName: "사자 보이즈 키링",
      productImageUrl: "https://cdn.example.com/images/keyring.png",
      appliedAt: "2025-06-23",
      status: "WIN",
    },
    {
      id: "raffle_003",
      productName: "헌터스 부채",
      productImageUrl: "https://cdn.example.com/images/fan.png",
      appliedAt: "2025-05-21",
      status: "LOSE",
    },
    {
      id: "raffle_004",
      productName: "헌터스 부채",
      productImageUrl: "https://cdn.example.com/images/fan.png",
      appliedAt: "2025-04-20",
      status: "LOSE",
    },
  ];

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <ProfilePage />
      <ActivityHistory activityHistory={activityHistory} />
      <RaffleHistory raffleHistory={raffleHistory} />
    </div>
  );
}

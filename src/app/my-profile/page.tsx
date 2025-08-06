import ProfilePage from "../../features/profile/components/ProfilePage";
import ActivityHistory from "features/profile/components/ActivityHistory";
import RaffleHistory from "../../features/profile/components/RaffleHistory";
import CustomerCenterInfo from "../../features/profile/components/CustomerCenterInfo";
import activityHistory from "features/common/data/activityHistory";
import raffleHistory from "features/common/data/raffleHistory";

/**
 * 마이 프로필 페이지 라우트
 */

export default function MyProfileRoute() {
  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <ProfilePage />
      <ActivityHistory activityHistory={activityHistory} />
      <RaffleHistory raffleHistory={raffleHistory} />
      <CustomerCenterInfo />
    </div>
  );
}

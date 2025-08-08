import RaffleInfo from "../../features/raffle/components/raffleInfo";
import raffleItems from "features/common/data/raffleItems";

export default function Raffle() {
  return <RaffleInfo raffleItems={raffleItems} />;
}

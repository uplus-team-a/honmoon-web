"use client";

import { useEffect, useState } from "react";
import RaffleInfo from "../../features/raffle/components/raffleInfo";
import {
  fetchRaffleProducts,
  type RaffleProductSummary,
} from "../../services/raffleService";

export default function Raffle() {
  const [items, setItems] = useState<
    { id: string; title: string; imageUrl: string; deadline: string }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    fetchRaffleProducts()
      .then((list) => {
        if (cancelled) return;
        const mapped = list.map((p: RaffleProductSummary) => ({
          id: String(p.id),
          title: p.name,
          imageUrl: p.imageUrl || "https://via.placeholder.com/320x240",
          deadline: p.deadline || new Date(Date.now() + 86400e3).toISOString(),
        }));
        setItems(mapped);
      })
      .catch(() => setItems([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return <RaffleInfo raffleItems={items} />;
}

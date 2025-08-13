"use client";

import React from "react";
import { useParams } from "next/navigation";
//import DetailPages from "../../../features/mission/components/DetailPages";
import QuizPageJaYangStation from "../../../features/mission/components/QuizPageJaYangStation";

export default function MissionPage() {
  const params = useParams();
  const markerId = Number(params.id);

  return <QuizPageJaYangStation markerId={markerId} />;
  // <DetailPages markerId={markerId} />;
}
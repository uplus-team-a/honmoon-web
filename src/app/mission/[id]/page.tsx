"use client";

import React from "react";
import { useParams } from "next/navigation";
//import DetailPages from "../../../features/mission/components/DetailPages";
import QuizPageSeoulOlympicMainStadium from "../../../features/mission/components/QuizPageQuizPageSeoulOlympicMainStadium";

export default function MissionPage() {
  const params = useParams();
  const markerId = Number(params.id);

  return <QuizPageSeoulOlympicMainStadium markerId={markerId} />;
  // <DetailPages markerId={markerId} />;
}
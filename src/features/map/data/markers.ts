import { KakaoMarkerStyle } from "../../../shared/components/ui/marker-image";

export type Marker = {
  id: number;
  title: string;
  lat: number;
  lng: number;
  image?: string;
  description?: string;
  markerStyle?: KakaoMarkerStyle;
  missionsCount?: number;
  primaryMissionId?: number;
  source?: "api" | "kakao"; // 데이터 출처
  missions?: Array<{ id: number; title: string; missionType?: string }>; // 간략 미션 목록
};

const markers: Marker[] = [];

export default markers;

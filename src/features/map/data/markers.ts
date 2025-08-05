import { KakaoMarkerStyle } from "../../../shared/components/ui/marker-image";

/**
 * 지도에 표시할 마커 정보
 */
export type Marker = {
  id: number;
  title: string;
  lat: number;
  lng: number;
  image?: string;
  description?: string;
  markerStyle?: KakaoMarkerStyle;
};

/**
 * 지도에 표시할 마커 데이터
 */
const markers: Marker[] = [
  {
    id: 1,
    title: "서울올림픽주경기장",
    lat: 37.515948,
    lng: 127.072759,
    image: "https://picsum.photos/id/1011/320/240",
    description: "1988년 서울 올림픽이 개최된 주경기장",
    markerStyle: { type: "primary", iconType: "building", size: 45 },
  },
  {
    id: 2,
    title: "코엑스아티움 전광판",
    lat: 37.512343,
    lng: 127.05899,
    image: "https://picsum.photos/id/1015/320/240",
    description: "강남의 랜드마크인 코엑스 아티움 전광판",
    markerStyle: { type: "accent", iconType: "entertainment" },
  },
  {
    id: 3,
    title: "국밥집 (도심식당 추정)",
    lat: 37.566535,
    lng: 126.977969,
    image: "https://picsum.photos/id/1024/320/240",
    description: "전통적인 한국 국밥을 맛볼 수 있는 식당",
    markerStyle: { type: "success", iconType: "restaurant" },
  },
  {
    id: 4,
    title: "명동 거리",
    lat: 37.564719,
    lng: 126.985602,
    image: "https://picsum.photos/id/1036/320/240",
    description: "서울의 대표적인 쇼핑 명소",
    markerStyle: { type: "info", iconType: "shopping" },
  },
  {
    id: 5,
    title: "명동 길거리 음식 골목",
    lat: 37.56362,
    lng: 126.985132,
    image: "https://picsum.photos/id/1037/320/240",
    description: "다양한 길거리 음식을 맛볼 수 있는 명동의 음식 골목",
    markerStyle: { type: "warning", iconType: "restaurant" },
  },
  {
    id: 6,
    title: "서울스카이 (롯데타워)",
    lat: 37.513068,
    lng: 127.102524,
    image: "https://picsum.photos/id/1040/320/240",
    description: "서울에서 가장 높은 건물인 롯데월드타워의 전망대",
    markerStyle: { type: "primary", iconType: "building", size: 50 },
  },
  {
    id: 7,
    title: "종로구 한약방 (북촌·서촌 일대)",
    lat: 37.582604,
    lng: 126.983998,
    image: "https://picsum.photos/id/1047/320/240",
    description: "전통 한약재를 판매하는 종로구의 한약방",
    markerStyle: { type: "success", iconType: "building", size: 42 },
  },
  {
    id: 8,
    title: "북촌 한옥마을",
    lat: 37.582604,
    lng: 126.983998,
    image: "https://picsum.photos/id/1051/320/240",
    description: "전통 한옥이 보존된 서울의 역사적인 주거 지역",
    markerStyle: { type: "info", iconType: "building", size: 38 },
  },
  {
    id: 9,
    title: "청담대교 아래",
    lat: 37.531184,
    lng: 127.055592,
    image: "https://picsum.photos/id/1056/320/240",
    description: "한강을 가로지르는 청담대교의 아름다운 야경",
    markerStyle: { type: "accent", iconType: "location", size: 44 },
  },
  {
    id: 10,
    title: "자양역",
    lat: 37.5324,
    lng: 127.0715,
    image: "https://picsum.photos/id/1059/320/240",
    description: "서울 지하철 2호선의 자양역 주변 지역",
    markerStyle: { type: "info", iconType: "transport" },
  },
  {
    id: 11,
    title: "낙산공원",
    lat: 37.579617,
    lng: 127.007103,
    image: "https://picsum.photos/id/1025/320/240",
    description: "서울 성곽을 따라 걸을 수 있는 아름다운 공원",
    markerStyle: { type: "success", iconType: "park", size: 46 },
  },
  {
    id: 12,
    title: "남산서울타워",
    lat: 37.5511694,
    lng: 126.9882266,
    image: "https://picsum.photos/id/1069/320/240",
    description: "서울의 상징적인 랜드마크인 남산서울타워",
    markerStyle: { type: "primary", iconType: "building" },
  },
];

export default markers;

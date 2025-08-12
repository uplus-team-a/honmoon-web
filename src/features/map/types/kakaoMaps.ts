/**
 * 카카오 맵 API 관련 타입 정의
 *
 * 카카오 맵 API를 TypeScript에서 사용하기 위한 인터페이스 정의입니다.
 * 실제 카카오 맵 API의 일부 기능만 정의되어 있으며, 필요에 따라 확장할 수 있습니다.
 */

/**
 * 카카오 맵 위도/경도 좌표 객체
 */
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
  equals(latlng: KakaoLatLng): boolean;
  toString(): string;
}

/**
 * 카카오 맵 픽셀 좌표 객체
 */
export interface KakaoPoint {
  x: number;
  y: number;
  equals(point: KakaoPoint): boolean;
  toString(): string;
}

/**
 * 카카오 맵 크기 객체
 */
export interface KakaoSize {
  width: number;
  height: number;
  equals(size: KakaoSize): boolean;
  toString(): string;
}

/**
 * 카카오 맵 컨트롤 위치 상수
 */
export interface KakaoControlPosition {
  TOPLEFT: number;
  TOP: number;
  TOPRIGHT: number;
  LEFT: number;
  RIGHT: number;
  BOTTOMLEFT: number;
  BOTTOM: number;
  BOTTOMRIGHT: number;
}

/**
 * 카카오 맵 타입 ID 상수
 */
export interface KakaoMapTypeId {
  ROADMAP: string;
  SKYVIEW: string;
  HYBRID: string;
  OVERLAY: string;
  TERRAIN: string;
  TRAFFIC: string;
  BICYCLE: string;
  BICYCLE_HYBRID: string;
  USE_DISTRICT: string;
}

/**
 * 카카오 맵 옵션
 */
export interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
  mapTypeId?: string;
  draggable?: boolean;
  scrollwheel?: boolean;
  disableDoubleClick?: boolean;
  disableDoubleClickZoom?: boolean;
  projectionId?: string;
  tileAnimation?: boolean;
  keyboardShortcuts?: boolean;
}

/**
 * 카카오 맵 객체
 */
export interface KakaoMap {
  setCenter(position: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
  getLevel(): number;
  panTo(position: KakaoLatLng): void;
  panBy(dx: number, dy: number): void;
  addControl(
    control: KakaoZoomControl | KakaoMapTypeControl,
    position: number
  ): void;
  removeControl(control: KakaoZoomControl | KakaoMapTypeControl): void;
  setMapTypeId(mapTypeId: string): void;
  getMapTypeId(): string;
  setDraggable(draggable: boolean): void;
  getDraggable(): boolean;
  setZoomable(zoomable: boolean): void;
  getZoomable(): boolean;
  relayout(): void;
}

/**
 * 카카오 마커 이미지 객체
 */
export interface KakaoMarkerImage {
  src: string;
  size: KakaoSize;
  options?: {
    offset: KakaoPoint;
    alt?: string;
    spriteSize?: KakaoSize;
    spriteOrigin?: KakaoPoint;
  };
}

/**
 * 카카오 마커 옵션
 */
export interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap | null;
  title?: string;
  image?: KakaoMarkerImage;
  clickable?: boolean;
  draggable?: boolean;
  zIndex?: number;
  opacity?: number;
  altitude?: number;
  range?: number;
}

/**
 * 카카오 마커 객체
 */
export interface KakaoMarker {
  getPosition(): KakaoLatLng;
  setPosition(position: KakaoLatLng): void;
  setMap(map: KakaoMap | null): void;
  getMap(): KakaoMap | null;
  setImage(image: KakaoMarkerImage): void;
  getImage(): KakaoMarkerImage;
  setTitle(title: string): void;
  getTitle(): string;
  setClickable(clickable: boolean): void;
  getClickable(): boolean;
  setDraggable(draggable: boolean): void;
  getDraggable(): boolean;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
  setOpacity(opacity: number): void;
  getOpacity(): number;
  setVisible(visible: boolean): void;
  getVisible(): boolean;
}

/**
 * 카카오 인포윈도우 옵션
 */
export interface KakaoInfoWindowOptions {
  content: string;
  position?: KakaoLatLng;
  disableAutoPan?: boolean;
  removable?: boolean;
  zIndex?: number;
}

/**
 * 카카오 인포윈도우 객체
 */
export interface KakaoInfoWindow {
  open(map: KakaoMap, marker?: KakaoMarker): void;
  close(): void;
  setContent(content: string): void;
  getContent(): string;
  setPosition(position: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
}

/**
 * 카카오 맵 이벤트 객체
 */
export interface KakaoMapEvent {
  latLng: KakaoLatLng;
  point: KakaoPoint;
}

export interface KakaoMapsEvent {
  addListener(
    target: KakaoMap | KakaoMarker,
    type: string,
    handler: (e?: KakaoMapEvent) => void
  ): void;
  removeListener(
    target: KakaoMap | KakaoMarker,
    type: string,
    handler: (e?: KakaoMapEvent) => void
  ): void;
  trigger(target: KakaoMap | KakaoMarker, type: string, data?: unknown): void;
}

/**
 * 카카오 맵 컨트롤 기본 인터페이스
 */
export interface KakaoControl {
  setMap(map: KakaoMap | null): void;
  getMap(): KakaoMap | null;
}

/**
 * 카카오 맵 줌 컨트롤 생성자 타입
 */
export type KakaoZoomControlConstructor = {
  new (): KakaoZoomControl;
};

/**
 * 카카오 맵 타입 컨트롤 생성자 타입
 */
export type KakaoMapTypeControlConstructor = {
  new (): KakaoMapTypeControl;
};

/**
 * 카카오 맵 줌 컨트롤 객체
 */
export type KakaoZoomControl = KakaoControl;

/**
 * 카카오 맵 타입 컨트롤 객체
 */
export type KakaoMapTypeControl = KakaoControl;

/**
 * 카카오 맵 API 네임스페이스
 */
export interface KakaoMaps {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement | null,
    options: KakaoMapOptions
  ) => KakaoMap;
  Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
  MarkerImage: new (
    src: string,
    size: KakaoSize,
    options?: { offset: KakaoPoint }
  ) => KakaoMarkerImage;
  InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
  ZoomControl: KakaoZoomControlConstructor;
  MapTypeControl: KakaoMapTypeControlConstructor;
  ControlPosition: KakaoControlPosition;
  MapTypeId: KakaoMapTypeId;
  event: KakaoMapsEvent;
  Point: new (x: number, y: number) => KakaoPoint;
  Size: new (width: number, height: number) => KakaoSize;
  load(callback: () => void): void;
  // 추가된 메서드들
  setCenter(position: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
  getLevel(): number;
  /**
   * Places 등 부가 서비스 네임스페이스
   */
  services?: KakaoMapsServices;
}

/**
 * 카카오 API 전역 객체
 */
export interface KakaoStatic {
  maps: KakaoMaps;
}

declare global {
  interface Window {
    kakao: KakaoStatic;
  }
}

/**
 * Kakao Places 타입 정의 (간소화 버전)
 */
export type KakaoPlacesStatus = "OK" | "ZERO_RESULT" | "ERROR" | string;

export interface KakaoPlacesSearchResult {
  id?: string;
  place_name: string;
  x: string; // lng
  y: string; // lat
  address_name?: string;
  road_address_name?: string;
}

export interface KakaoPlacesPagination {
  current: number;
  last?: number;
  totalCount?: number;
  gotoPage: (page: number) => void;
}

export interface KakaoPlacesService {
  keywordSearch: (
    keyword: string,
    callback: (
      data: KakaoPlacesSearchResult[],
      status: KakaoPlacesStatus,
      pagination: KakaoPlacesPagination
    ) => void,
    options?: Record<string, unknown>
  ) => void;
}

export interface KakaoMapsServices {
  Places: new () => KakaoPlacesService;
  Status: {
    OK: KakaoPlacesStatus;
    ZERO_RESULT: KakaoPlacesStatus;
    ERROR: KakaoPlacesStatus;
    [key: string]: KakaoPlacesStatus;
  };
}

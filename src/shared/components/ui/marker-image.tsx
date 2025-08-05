"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "../../../shared/lib/utils";
import { DefaultCardImage } from "./default-card-image";

/**
 * 마커 이미지 컴포넌트 속성
 *
 * @param src - 이미지 URL
 * @param alt - 이미지 대체 텍스트
 * @param width - 이미지 너비
 * @param height - 이미지 높이
 * @param className - 추가 CSS 클래스
 * @param aspectRatio - 이미지 비율 (예: "4/3", "16/9")
 * @param priority - 이미지 우선 로딩 여부
 * @param shape - 이미지 모양 (circle, square 등)
 */
export interface MarkerImageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
  priority?: boolean;
  shape?: "circle" | "square" | "rounded";
}

/**
 * 카카오 맵 마커 타입
 */
export type MarkerType =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "custom";

/**
 * 카카오 맵 마커 아이콘 타입
 */
export type MarkerIconType =
  | "location"
  | "restaurant"
  | "shopping"
  | "entertainment"
  | "transport"
  | "park"
  | "building"
  | "custom";

/**
 * 카카오 맵 마커 스타일 옵션
 */
export interface KakaoMarkerStyle {
  type?: MarkerType;
  color?: string;
  size?: number;
  icon?: string;
  iconType?: MarkerIconType;
  hasShadow?: boolean;
  hasBorder?: boolean;
  borderColor?: string;
}

/**
 * 마커 아이콘 SVG 정의
 */
const MARKER_ICONS: Record<MarkerIconType, string> = {
  location: `
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
          fill="white" opacity="0.9"/>
  `,
  restaurant: `
    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" 
          fill="white" opacity="0.9"/>
  `,
  shopping: `
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" 
          fill="white" opacity="0.9"/>
  `,
  entertainment: `
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
          fill="white" opacity="0.9"/>
  `,
  transport: `
    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" 
          fill="white" opacity="0.9"/>
  `,
  park: `
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
          fill="white" opacity="0.9"/>
  `,
  building: `
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z" 
          fill="white" opacity="0.9"/>
  `,
  custom: `
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
          fill="white" opacity="0.9"/>
  `,
};

/**
 * 카카오 맵용 마커 SVG를 생성하는 함수
 *
 * @param style - 마커 스타일 옵션
 * @returns SVG 데이터 URL
 */
export const createKakaoMarkerSVG = (style: KakaoMarkerStyle = {}): string => {
  const {
    type = "default",
    color,
    size = 40,
    icon,
    iconType = "location",
    hasShadow = true,
    hasBorder = true,
    borderColor = "#ffffff",
  } = style;

  // 타입별 기본 색상
  const typeColors = {
    default: "#6B46C1",
    primary: "#6B46C1",
    secondary: "#F7FAFC",
    accent: "#DD6B20",
    destructive: "#E53E3E",
    success: "#38A169",
    warning: "#D69E2E",
    info: "#3182CE",
    custom: color || "#6B46C1",
  };

  const markerColor = typeColors[type];
  const halfSize = size / 2;
  const shadowOffset = hasShadow ? 2 : 0;

  // 아이콘 선택
  const selectedIcon = icon || MARKER_ICONS[iconType];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${
    size + shadowOffset
  }" viewBox="0 0 ${size} ${size + shadowOffset}">
      ${
        hasShadow
          ? `
        <!-- 그림자 -->
        <ellipse cx="${halfSize + 1}" cy="${size + 1}" rx="${
              halfSize - 2
            }" ry="3" fill="rgba(0,0,0,0.2)"/>
      `
          : ""
      }
      
      <!-- 마커 배경 -->
      <circle cx="${halfSize}" cy="${halfSize}" r="${
    halfSize - 2
  }" fill="${markerColor}"/>
      
      ${
        hasBorder
          ? `
        <!-- 테두리 -->
        <circle cx="${halfSize}" cy="${halfSize}" r="${
              halfSize - 2
            }" fill="none" stroke="${borderColor}" stroke-width="2"/>
      `
          : ""
      }
      
      <!-- 내부 원형 효과 -->
      <circle cx="${halfSize}" cy="${halfSize}" r="${
    halfSize - 6
  }" fill="rgba(255,255,255,0.2)"/>
      
      <!-- 아이콘 -->
      <g transform="translate(${halfSize - 12}, ${halfSize - 12}) scale(0.75)">
        ${selectedIcon}
      </g>
      
      <!-- 하이라이트 효과 -->
      <circle cx="${halfSize - 4}" cy="${
    halfSize - 4
  }" r="3" fill="rgba(255,255,255,0.6)"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * 마커 이미지 컴포넌트
 *
 * 최적화된 이미지 로딩을 위한 Next.js Image 컴포넌트를 사용하며,
 * 이미지 로딩 중이나 이미지가 없을 때는 DefaultCardImage를 표시합니다.
 */
const MarkerImage = React.forwardRef<HTMLDivElement, MarkerImageProps>(
  (
    {
      src,
      alt = "마커 이미지",
      width = "w-[120px]",
      height = "h-full",
      aspectRatio = "aspect-[4/3]",
      priority = false,
      shape = "circle",
      className,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);

    // 이미지 로딩 완료 핸들러
    const handleLoadingComplete = () => {
      setIsLoading(false);
    };

    // 이미지 로딩 에러 핸들러
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-muted/10",
          shape === "circle"
            ? "rounded-full"
            : shape === "rounded"
            ? "rounded-lg"
            : "rounded-none",
          width,
          height,
          aspectRatio,
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <>
            {/* 이미지 로딩 중일 때 표시할 스켈레톤 */}
            {isLoading && (
              <div className="absolute inset-0 animate-pulse bg-muted/20" />
            )}

            {/* 최적화된 이미지 */}
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={priority}
              className={cn(
                "object-cover transition-opacity duration-300",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={handleLoadingComplete}
              onError={handleError}
            />
          </>
        ) : (
          <DefaultCardImage width="w-full" height="h-full" />
        )}
      </div>
    );
  }
);

MarkerImage.displayName = "MarkerImage";

export { MarkerImage };

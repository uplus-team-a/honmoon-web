"use client";

import * as React from "react";
import { cn } from "../../../shared/lib/utils";

/**
 * 눈 아이콘 컴포넌트 속성
 * 
 * @param visible - 표시 상태 (열린 눈 / 닫힌 눈)
 * @param className - 추가 CSS 클래스
 */
export interface EyeIconProps extends React.SVGAttributes<SVGElement> {
  visible?: boolean;
}

/**
 * 눈 아이콘 컴포넌트
 * 
 * 마커 표시 여부를 나타내는 토글 아이콘으로,
 * visible 속성에 따라 열린 눈 또는 닫힌 눈 아이콘을 표시합니다.
 * shadcn UI 스타일을 사용하여 구현되었습니다.
 */
const EyeIcon = React.forwardRef<SVGSVGElement, EyeIconProps>(
  ({ visible = true, className, ...props }, ref) => {
    return visible ? (
      // 열린 눈 아이콘 (표시 중)
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-4", className)}
        {...props}
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      // 닫힌 눈 아이콘 (숨김)
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-4", className)}
        {...props}
      >
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </svg>
    );
  }
);

EyeIcon.displayName = "EyeIcon";

export { EyeIcon };

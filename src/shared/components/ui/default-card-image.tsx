"use client";

import * as React from "react";
import { cn } from "../../../shared/lib/utils";

/**
 * 이미지 로딩 중이나 이미지가 없을 때 표시되는 기본 카드 이미지 컴포넌트
 * 
 * @param className - 추가 CSS 클래스
 * @param width - 이미지 너비
 * @param height - 이미지 높이
 */
export interface DefaultCardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

/**
 * 이미지 로딩 중이나 이미지가 없을 때 표시되는 기본 카드 이미지
 * 
 * shadcn UI 스타일을 사용하여 구현된 로딩 상태 표시 컴포넌트입니다.
 */
const DefaultCardImage = React.forwardRef<HTMLDivElement, DefaultCardImageProps>(
  ({ className, width = "w-32", height = "h-32", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          width,
          height,
          "flex items-center justify-center bg-muted/20 rounded-l-lg",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">이미지 로딩 중</span>
        </div>
      </div>
    );
  }
);

DefaultCardImage.displayName = "DefaultCardImage";

export { DefaultCardImage };

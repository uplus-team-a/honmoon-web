"use client";

import React, { useEffect } from "react";
import type { AnimationSequence } from "motion/react";
import { motion, useAnimate } from "motion/react";
// shadcn Card 제거 — 토스 스타일 미니멀: plain container 사용

/**
 * HonmoonSealed — Pastel Aurora Edition
 * Tailwind + shadcn/ui + motion/react only
 *
 * 레이어 구성
 *  - Backdrop: 파스텔 그라데이션 + 입체 노이즈
 *  - Aurora: 상하로 흐르는 오로라 블롭 2장
 *  - Starfield: 은은한 별/먼지
 *  - Rings: 확장 파동 링 3겹 (soft pastel)
 *  - Waves: 직선 파도 라인
 *  - Sigil: 문양 트레이싱 (원형 경로)
 *  - Particles: 잔광 입자 산란
 */

export type HonmoonSealedProps = {
  className?: string;
  /** 애니메이션 자동 재생 여부 */
  autoplay?: boolean;
  /** 애니메이션 종료 콜백 */
  onComplete?: () => void;
  /** 크리에이티브 모드: 파티클 수 증가 */
  vivid?: boolean;
};

// 파스텔 팔레트 (H, S, L)
const PASTELS = {
  peach: "hsl(16 92% 88%)",
  apricot: "hsl(28 92% 84%)",
  lemon: "hsl(52 95% 86%)",
  mint: "hsl(162 58% 85%)",
  sky: "hsl(198 82% 88%)",
  periwinkle: "hsl(230 75% 90%)",
  lavender: "hsl(268 62% 90%)",
  pink: "hsl(330 80% 90%)",
};

export default function HonmoonSealed({
  className,
  autoplay = false,
  onComplete,
  vivid = false,
}: HonmoonSealedProps) {
  const [scope, animate] = useAnimate();

  // 파티클/랜덤 요소 제거로 초기 페인트 안정화

  useEffect(() => {
    if (!autoplay) return;

    const sequence: AnimationSequence = [
      // Backdrop glow in
      [".backdrop", { opacity: [0, 1] }, { duration: 0.6, ease: "easeOut" }],
      // Aurora drift + brighten
      [
        ".aurora",
        { opacity: [0, 0.9], y: [20, 0] },
        { at: 0.05, duration: 1.2, ease: "easeOut" },
      ],
      // Starfield fade
      [
        ".stars",
        { opacity: [0, 0.8] },
        { at: 0.15, duration: 1.0, ease: "easeOut" },
      ],
      // Rings pulse — removed
      // Waves sweep (더 빠르게)
      [
        ".waves",
        { opacity: [0, 0.55, 0.2, 0], y: [10, 3, -3, -10] },
        { at: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      ],
      // Sigil draw
      [
        ".sigil path",
        { pathLength: [0, 1], opacity: [0, 1] },
        { at: 0.3, duration: 1.1, ease: "easeInOut" },
      ],
      // Particles burst
      [
        ".particle",
        { opacity: [0, 1, 0], y: [0, -8, -16], scale: [0.8, 1, 0.9] },
        { at: 0.35, duration: 1.2, ease: "easeOut" },
      ],
    ];

    animate(sequence).then(() => onComplete?.());
  }, [animate, autoplay, onComplete]);

  return (
    <div
      ref={scope as unknown as React.RefObject<HTMLDivElement>}
      className={[
        "relative isolate w-full h-full overflow-hidden z-0",
        "flex items-center justify-center",
        "rounded-2xl border-0",
        className ?? "",
      ].join(" ")}
      style={{
        // 글로벌 CSS 변수 (Pastel Core)
        // 노출: 개발자가 필요 시 조정 가능
        // @ts-expect-error: CSSVariables
        "--p1": PASTELS.apricot,
        "--p2": PASTELS.mint,
        "--p3": PASTELS.sky,
        "--p4": PASTELS.lavender,
        "--p5": PASTELS.peach,
      }}
    >
      {/* Backdrop — soft radial pastel gradient + film grain */}
      <motion.div
        className="backdrop absolute inset-0 -z-20 will-change-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background:
            `radial-gradient(120% 80% at 20% 10%, var(--p1) 0%, transparent 60%),` +
            `radial-gradient(120% 80% at 80% 15%, var(--p3) 0%, transparent 55%),` +
            `radial-gradient(100% 70% at 50% 80%, var(--p2) 0%, transparent 65%),` +
            `linear-gradient(180deg, var(--p5), var(--p4))`,
          mixBlendMode: "screen",
          filter: "saturate(110%) blur(0.2px)",
        }}
      />

      {/* Subtle noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.18) 0.5px, rgba(255,255,255,0) 0.5px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Aurora Blobs */}
      <motion.div
        className="aurora absolute -inset-16 -z-5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            `radial-gradient(40% 30% at 30% 20%, var(--p2) 0%, transparent 60%),` +
            `radial-gradient(45% 35% at 70% 25%, var(--p3) 0%, transparent 60%),` +
            `radial-gradient(35% 25% at 50% 70%, var(--p4) 0%, transparent 70%)`,
          filter: "blur(24px)",
          opacity: 0.85,
        }}
      />

      {/* Starfield 제거: 초기 페인트 안정화를 위해 랜덤/반복 애니메이션 배제 */}

      {/* Rings 제거 */}

      {/* Waves — 직선 파도 라인 */}
      <motion.svg
        className="waves absolute inset-0 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0, y: 24 }}
      >
        <defs>
          <linearGradient id="hmn-pastel-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PASTELS.periwinkle} stopOpacity="0" />
            <stop offset="20%" stopColor={PASTELS.sky} stopOpacity="0.85" />
            <stop offset="80%" stopColor={PASTELS.mint} stopOpacity="0.85" />
            <stop
              offset="100%"
              stopColor={PASTELS.periwinkle}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.line
            key={i}
            x1="-5"
            x2="105"
            y1={12 + i * 10}
            y2={12 + i * 10}
            stroke="url(#hmn-pastel-stroke)"
            strokeWidth={i % 3 === 0 ? 1.0 : i % 2 === 0 ? 0.7 : 0.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.9, 0.18] }}
            transition={{ duration: 0.9, delay: i * 0.05, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.35))" }}
          />
        ))}
      </motion.svg>

      {/* Sigil — removed for minimal toss-style */}

      {/* Particles 제거 */}

      {/* Soft vignette */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          boxShadow: "inset 0 0 160px rgba(255,255,255,0.25)",
        }}
      />
    </div>
  );
}

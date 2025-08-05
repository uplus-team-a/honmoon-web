import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * 클래스명을 조합하는 유틸리티 함수
 *
 * Tailwind 클래스를 조합하고 충돌을 해결합니다.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

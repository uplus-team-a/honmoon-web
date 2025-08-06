/**
 * 로그인 관련 타입 정의
 */

/**
 * 로그인 폼 데이터 타입
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * 로그인 응답 타입
 */
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

/**
 * 사용자 정보 타입
 */
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

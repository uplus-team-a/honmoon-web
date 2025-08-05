# Project Guidelines

## 1. 프로젝트 개요

Honmoon은 Next.js와 React를 기반으로 한 웹 애플리케이션으로, 카카오 맵 API를 활용하여 위치 기반 서비스를 제공합니다. 이 프로젝트는 Feature-Sliced Design(FSD) 아키텍처 패턴을 따르며, TypeScript와 Tailwind CSS를 사용합니다.

## 2. 패키지 구조

```
src/
├── app/                  # Next.js App Router 페이지
├── constants/            # 전역 상수
├── features/             # 기능별 모듈화된 코드
│   ├── common/           # 공통 기능 (헤더, 푸터 등)
│   ├── map/              # 지도 관련 기능
│   │   ├── components/   # 지도 컴포넌트
│   │   ├── data/         # 지도 데이터
│   │   ├── hooks/        # 지도 관련 훅
│   │   ├── types/        # 지도 관련 타입
│   │   └── index.ts      # 지도 기능 내보내기
│   └── profile/          # 프로필 관련 기능
├── lib/                  # 외부 라이브러리 래퍼
├── shared/               # 공유 코드
│   ├── components/       # 공유 컴포넌트
│   │   └── ui/           # UI 컴포넌트
│   ├── constants/        # 공유 상수
│   ├── hooks/            # 공유 훅
│   ├── lib/              # 공유 라이브러리
│   ├── styles/           # 공유 스타일
│   ├── types/            # 공유 타입
│   └── utils/            # 공유 유틸리티
├── store/                # 전역 상태 관리
├── styles/               # 전역 스타일
└── types/                # 전역 타입
```

## 3. 코딩 규칙

### 3.1 컴포넌트 구조

- 모든 컴포넌트는 기능별로 `features/` 디렉토리 내에 배치합니다.
- 여러 기능에서 공유되는 컴포넌트는 `shared/components/` 디렉토리에 배치합니다.
- UI 컴포넌트(버튼, 입력 필드 등)는 `shared/components/ui/` 디렉토리에 배치합니다.
- 각 컴포넌트는 다음 구조를 따릅니다:

  ```tsx
  "use client"; // 클라이언트 컴포넌트인 경우

  import React from "react";

  /**
   * 컴포넌트 설명
   *
   * @param prop1 - 속성 설명
   * @param prop2 - 속성 설명
   */
  interface ComponentProps {
    prop1: string;
    prop2?: number;
  }

  export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
    return (
      // JSX
    );
  };

  export default Component;
  ```

### 3.2 타입 정의

- 모든 타입은 해당 기능의 `types/` 디렉토리에 정의합니다.
- 여러 기능에서 공유되는 타입은 `shared/types/` 또는 루트 `types/` 디렉토리에 정의합니다.
- 타입 이름은 파스칼 케이스(PascalCase)를 사용합니다.

### 3.3 훅 구조

- 모든 훅은 해당 기능의 `hooks/` 디렉토리에 배치합니다.
- 여러 기능에서 공유되는 훅은 `shared/hooks/` 디렉토리에 배치합니다.
- 훅 이름은 camelCase로 시작하며 `use` 접두사를 사용합니다.

### 3.4 문서화

- 모든 컴포넌트, 함수, 타입에는 한글로 된 docstring을 추가합니다.
- 주석은 필요한 경우에만 사용하고, 코드가 자체적으로 설명되도록 작성합니다.

## 4. 환경 변수 및 설정

- 모든 환경 변수는 `.env` 파일에 정의합니다.
- 환경 변수의 예시는 `.env.example` 파일에 포함시킵니다.
- 클라이언트에서 접근 가능한 환경 변수는 `NEXT_PUBLIC_` 접두사를 사용합니다.
- 현재 사용 중인 환경 변수:
  - `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`: 카카오 맵 API 키

## 5. 서버 연동

- 서버 연동이 필요한 기능은 다음 구조를 따릅니다:
  ```
  features/feature-name/
  ├── api/              # API 관련 코드
  │   ├── client.ts     # API 클라이언트
  │   ├── mocks.ts      # 목업 데이터
  │   └── types.ts      # API 관련 타입
  ```
- 개발 중에는 `mocks.ts`에 정의된 목업 데이터를 사용합니다.
- API 클라이언트는 실제 API와 목업 데이터를 모두 지원하도록 구현합니다.

## 6. 상태 관리

- 전역 상태 관리는 Zustand를 사용합니다.
- 상태 저장소는 `store/` 디렉토리에 정의합니다.
- 각 기능별 상태는 해당 기능의 디렉토리 내에 정의합니다.
- 상태 저장소 구조 예시:

  ```ts
  import { create } from "zustand";

  interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
  }

  export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }));
  ```

## 7. 테스트

- 테스트는 Jest와 React Testing Library를 사용합니다.
- 각 컴포넌트와 훅에 대한 단위 테스트를 작성합니다.
- 테스트 파일은 해당 코드 파일과 동일한 디렉토리에 위치하며, `.test.ts` 또는 `.test.tsx` 확장자를 사용합니다.

## 개요

Honmoon Web은 Next.js 기반 클라이언트 애플리케이션이며, 모든 데이터는 서버 API(`https://honmoon-api.site`)를 통해 호출한다. 스타일은 tailwind와 shadcn 컴포넌트만 사용한다.

## 서비스 구조 요약

- 인증
  - Google OAuth: 백엔드에서 발급한 인증 URL로 리다이렉트, 콜백에서 `code/state`를 서버로 교환해 세션 토큰 저장
  - 이메일 매직링크: 요청/콜백 모두 서버 API 사용, 세션 토큰 저장 후 프로필 조회
  - 세션 토큰은 `localStorage.appSessionToken`에 저장되고 모든 API 요청에 Bearer 토큰으로 첨부
- 파일 업로드
  - 서버에서 presigned URL을 발급받아 GCS에 업로드
  - 업로드 후 퍼블릭 URL을 서버에 전달해 리소스 연결
- 지도/미션
  - 지도 마커는 서버 `미션 장소` API로 가져와 표시
  - 미션 상세, 미션별 퀴즈 제출 등 서버 API로 처리
- 래플
  - 래플 상품 목록/상세, 응모/내 응모내역 등 서버 API로 연동
- 프로필
  - 내 요약/포인트/퀴즈/미션 통계, 활동 내역, 프로필 이미지 업데이트 등 `users/me`, `user-activities` API 사용

## 개발/실행

- 환경변수: `NEXT_PUBLIC_API_BASE_URL` 미지정 시 기본값 `https://www.honmoon-api.site`
- 개발
  - `pnpm dev`
- 빌드/실행
  - `pnpm build && pnpm start`

## 서버 API 참고

- `http/*.http` 파일에 주요 엔드포인트 예시가 정리되어 있다
- 개발 환경에서는 Basic 인증으로 테스트 토큰 발급 가능

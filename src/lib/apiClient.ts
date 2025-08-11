// 공통 API 클라이언트
// 외부 API 호출 시 기본 설정과 인증 토큰 첨부를 담당합니다.

export interface ApiRequestOptions extends RequestInit {
  withAuth?: boolean;
  basicAuth?: { username: string; password: string };
}

const getBaseUrl = () => {
  // 환경변수에서 API Base URL을 읽습니다. 기본값은 https://honmoon-api.site
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://honmoon-api.site";
};

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("appSessionToken");
  } catch {
    return null;
  }
};

const toBasicAuthHeader = (username: string, password: string): string => {
  const raw = `${username}:${password}`;
  if (typeof btoa === "function") {
    return `Basic ${btoa(raw)}`;
  }
  // Node.js or environments without btoa
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const base64 = Buffer.from(raw, "utf8").toString("base64");
  return `Basic ${base64}`;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { withAuth = true, basicAuth, headers, ...rest } = options;

  const baseUrl = getBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const token = withAuth ? getAuthToken() : null;

  const authHeader: Record<string, string> = basicAuth
    ? {
        Authorization: toBasicAuthHeader(
          basicAuth.username,
          basicAuth.password
        ),
      }
    : token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
      ...authHeader,
    },
    // 쿠키 기반 인증이 필요할 수 있으므로 포함 옵션은 상황에 따라 조정
    // credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `API 요청 실패: ${response.status}`);
  }

  // 일부 API는 비어있는 본문을 반환할 수 있음
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  // 타입 안전성은 호출부에서 보장
  return (await response.text()) as unknown as T;
}

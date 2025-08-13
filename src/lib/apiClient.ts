export interface ApiRequestOptions extends RequestInit {
  withAuth?: boolean;
  basicAuth?: { username: string; password: string };
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.honmoon-api.site";
};

// 비로그인 기본 인증 헤더 (Base64 고정 값)
const DEFAULT_GUEST_AUTH_HEADER =
  "Basic YTUxODljMzgtZmJlMi00MzczLWJmNmItZDA0ZWE4ZjJhNjgzOmppd29uZGV2";
const DEFAULT_PASSWORD = "jiwondev";

const getStoredUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("currentUserId");
  } catch {
    return null;
  }
};

const toBasicAuthHeader = (username: string, password: string): string => {
  const raw = `${username}:${password}`;
  if (typeof btoa === "function") {
    return `Basic ${btoa(raw)}`;
  }
  const base64 = Buffer.from(raw, "utf8").toString("base64");
  return `Basic ${base64}`;
};

const isProfileRelatedPath = (path: string): boolean => {
  try {
    // Normalize to pathname for both absolute and relative inputs
    const url = path.startsWith("http")
      ? new URL(path)
      : new URL(path, getBaseUrl());
    const p = url.pathname;
    return (
      p === "/api/auth/me" ||
      p === "/api/users/me" ||
      p.startsWith("/api/users/me/")
    );
  } catch {
    // Fallback: simple includes check
    return path.includes("/api/auth/me") || path.includes("/api/users/me");
  }
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { withAuth = true, basicAuth, headers, ...rest } = options;

  const baseUrl = getBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const userId = withAuth ? getStoredUserId() : null;

  let authHeader: Record<string, string> = {};
  if (basicAuth) {
    authHeader = {
      Authorization: toBasicAuthHeader(basicAuth.username, basicAuth.password),
    };
  } else if (userId) {
    authHeader = { Authorization: toBasicAuthHeader(userId, DEFAULT_PASSWORD) };
  } else if (withAuth && !isProfileRelatedPath(path)) {
    // 로그인 전 기본 게스트 자격으로 인증 적용 (프로필 관련 API 제외)
    authHeader = { Authorization: DEFAULT_GUEST_AUTH_HEADER };
  }

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
      ...authHeader,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && withAuth) {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("appSessionToken");
        } catch {}
        // 로그인 필요한 기능: 로그인 페이지로 이동 (현재 위치를 redirect 파라미터로 전달)
        const current = window.location?.href || "/";
        const search = new URLSearchParams({ redirect: current }).toString();
        const loginUrl = `/login${search ? `?${search}` : ""}`;
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = loginUrl;
        }
      }
      throw new Error("AUTH_REQUIRED");
    }

    const text = await response.text().catch(() => "");
    throw new Error(text || `API 요청 실패: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}

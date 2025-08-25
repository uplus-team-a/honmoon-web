export interface ApiRequestOptions extends RequestInit {
  withAuth?: boolean;
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.honmoon-api.site";
};

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("authToken");
  } catch {
    return null;
  }
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { withAuth = true, headers, ...rest } = options;

  const baseUrl = getBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const token = withAuth ? getStoredToken() : null;

  let authHeader: Record<string, string> = {};
  if (token) {
    authHeader = { Authorization: `Bearer ${token}` };
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
          localStorage.removeItem("authToken");
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

    let errorData: unknown = null;
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text);
      }
    } catch {}

    if (errorData && typeof errorData === "object" && "message" in errorData) {
      const message = (errorData as { message?: unknown }).message;
      if (typeof message === "string") {
        throw new Error(message);
      }
    }
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}

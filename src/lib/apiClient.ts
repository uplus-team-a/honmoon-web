export interface ApiRequestOptions extends RequestInit {
  withAuth?: boolean;
  basicAuth?: { username: string; password: string };
}

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.honmoon-api.site";
};

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
    authHeader = { Authorization: toBasicAuthHeader(userId, "jiwondev") };
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
        localStorage.removeItem("appSessionToken");
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

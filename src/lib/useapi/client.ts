import { env } from "@/lib/env";
import { sleep } from "@/lib/utils";
import { UseApiError } from "@/lib/useapi/errors";

const USEAPI_GOOGLE_FLOW_BASE_URL = "https://api.useapi.net/v1/google-flow";
const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504]);

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  rawBody?: BodyInit;
  contentType?: string;
  signal?: AbortSignal;
  retrySafe?: boolean;
};

export async function useApiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const e = env();
  const token = normalizeUseApiToken(e.USEAPI_TOKEN);

  if (!token) {
    throw new UseApiError(
      503,
      "USEAPI_NOT_CONFIGURED",
      "USEAPI_TOKEN chưa được cấu hình trên Vercel.",
    );
  }

  const attempts = options.retrySafe === false ? 1 : 3;
  let last: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), e.USEAPI_TIMEOUT_MS);
    const onAbort = () => controller.abort();
    options.signal?.addEventListener("abort", onAbort, { once: true });

    try {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      let body: BodyInit | undefined;
      if (options.rawBody) {
        body = options.rawBody;
        if (options.contentType) headers["Content-Type"] = options.contentType;
      } else if (options.body !== undefined) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(options.body);
      }

      const response = await fetch(`${USEAPI_GOOGLE_FLOW_BASE_URL}${path}`, {
        method: options.method ?? "GET",
        headers,
        body,
        signal: controller.signal,
        cache: "no-store",
      });

      const text = await response.text();
      const data = text ? safeJson(text) : {};

      if (!response.ok) {
        const code = extractCode(data);
        const message = providerMessage(response.status, data);
        const error = new UseApiError(response.status, code, message, data);

        if (!RETRYABLE.has(response.status) || attempt === attempts - 1) {
          throw error;
        }
        last = error;
      } else {
        return data as T;
      }
    } catch (error) {
      last = error;
      if (error instanceof UseApiError && !RETRYABLE.has(error.status)) throw error;

      if (attempt === attempts - 1) {
        if (error instanceof UseApiError) throw error;
        throw new UseApiError(
          504,
          "PROVIDER_TIMEOUT",
          "Dịch vụ AI phản hồi quá chậm. Vui lòng thử lại.",
          error,
        );
      }
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", onAbort);
    }

    await sleep(500 * 2 ** attempt + Math.floor(Math.random() * 250));
  }

  throw last;
}

function normalizeUseApiToken(raw: string): string {
  return raw
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500) };
  }
}

function extractCode(data: unknown): string {
  const record = asRecord(data);
  const error = record.error;

  if (typeof error === "string" && error.trim()) return error.trim();
  if (error && typeof error === "object") {
    const nested = asRecord(error);
    if (typeof nested.code === "string") return nested.code;
    if (typeof nested.type === "string") return nested.type;
  }
  if (typeof record.code === "string") return record.code;
  return "PROVIDER_ERROR";
}

function providerMessage(status: number, data: unknown): string {
  const details = extractProviderText(data);

  if (status === 401) {
    return "USEAPI_TOKEN bị useapi.net từ chối. Trong Vercel chỉ dán token dạng user:123-..., không thêm chữ Bearer, dấu nháy hoặc khoảng trắng.";
  }
  if (status === 403) {
    return details || "Token useapi.net không có quyền sử dụng Google Flow API.";
  }
  if (status === 404) {
    return details || "Không tìm thấy tài khoản Google Flow đã cấu hình. Hãy kiểm tra USEAPI_ACCOUNT_EMAIL.";
  }
  if (status === 402) {
    return details || "Tài khoản useapi.net hoặc Google Flow chưa có gói hỗ trợ tạo video.";
  }
  if (status === 429) {
    return details || "Không có tài khoản Flow đủ quota, tài khoản đang quarantine hoặc captcha credit đã hết.";
  }
  if (status >= 500) {
    return details || "useapi.net đang gặp sự cố. Vui lòng thử lại sau.";
  }
  return details || `useapi.net từ chối yêu cầu tạo nội dung (HTTP ${status}).`;
}

function extractProviderText(data: unknown): string {
  const record = asRecord(data);
  for (const key of ["message", "detail", "reason", "description"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim().slice(0, 300);
  }

  const error = record.error;
  if (typeof error === "string" && error.trim()) return error.trim().slice(0, 300);
  if (error && typeof error === "object") {
    const nested = asRecord(error);
    for (const key of ["message", "detail", "reason", "description"]) {
      const value = nested[key];
      if (typeof value === "string" && value.trim()) return value.trim().slice(0, 300);
    }
  }

  return "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

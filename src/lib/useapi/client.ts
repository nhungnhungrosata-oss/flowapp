import { env } from "@/lib/env";
import { sleep } from "@/lib/utils";
import { UseApiError } from "@/lib/useapi/errors";
import { normalizeUseApiToken } from "@/lib/useapi/token";

const USEAPI_GOOGLE_FLOW_BASE_URL = "https://api.useapi.net/v1/google-flow";
const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504, 596]);

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  rawBody?: BodyInit;
  contentType?: string;
  signal?: AbortSignal;
  retrySafe?: boolean;
  timeoutMs?: number;
};

export async function useApiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const e = env();
  const token = normalizeUseApiToken(e.USEAPI_TOKEN);

  if (!token) {
    throw new UseApiError(503, "USEAPI_NOT_CONFIGURED", "USEAPI_TOKEN chưa được cấu hình trên Vercel.");
  }

  const attempts = options.retrySafe === false ? 1 : 3;
  const timeoutMs = options.timeoutMs ?? e.USEAPI_TIMEOUT_MS;
  let last: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
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
        const error = new UseApiError(
          response.status,
          extractCode(data),
          providerMessage(response.status, data),
          data,
        );

        if (!RETRYABLE.has(response.status) || attempt === attempts - 1) throw error;
        last = error;
      } else {
        return data as T;
      }
    } catch (error) {
      last = error;
      if (error instanceof UseApiError && !RETRYABLE.has(error.status)) throw error;

      if (attempt === attempts - 1) {
        if (error instanceof UseApiError) throw error;
        const timedOut = error instanceof Error && error.name === "AbortError";
        throw new UseApiError(
          504,
          timedOut ? "PROVIDER_REQUEST_TIMEOUT" : "PROVIDER_TIMEOUT",
          timedOut
            ? `useapi.net chưa trả jobId sau ${Math.round(timeoutMs / 1000)} giây trong bước captcha. Không bấm tạo liên tục; chờ 60 giây rồi thử lại một lần.`
            : "Không thể kết nối ổn định tới useapi.net. Vui lòng thử lại.",
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
    if (typeof nested.code === "string" || typeof nested.code === "number") return String(nested.code);
    if (typeof nested.type === "string") return nested.type;
    if (typeof nested.status === "string") return nested.status;
  }
  if (typeof record.code === "string" || typeof record.code === "number") return String(record.code);
  return "PROVIDER_ERROR";
}

function providerMessage(status: number, data: unknown): string {
  const details = extractProviderText(data);
  const normalized = details.toUpperCase();

  if (normalized.includes("CAPTCHA_QUALITY") || normalized.includes("UNUSUAL_ACTIVITY")) {
    return "Free captcha vẫn còn nhưng Google chấm token captcha quá thấp. Hệ thống đã thử tối đa 10 lần; hãy chờ ít nhất 60 giây rồi thử lại. Nếu lặp lại nhiều lần, cần thêm captcha provider dự phòng.";
  }

  if (status === 401) {
    return "useapi.net trả về 401 Unauthorized. Backend đã gửi nguyên token theo header Authorization: Bearer {token}; hãy kiểm tra deployment hiện tại đã nhận đúng secret mới.";
  }
  if (status === 402) return details || "Subscription useapi.net đã hết hạn hoặc tài khoản không đủ credits.";
  if (status === 403) return details || "Google từ chối captcha. Hãy chờ 60 giây rồi thử lại hoặc cấu hình thêm captcha provider.";
  if (status === 404) return details || "Không tìm thấy tài khoản Google Flow đã cấu hình. Hãy kiểm tra USEAPI_ACCOUNT_EMAIL.";
  if (status === 408) return details || "Quá thời gian chờ tạo video từ Google Flow.";
  if (status === 429) return details || "Tài khoản Flow đang quá tải, thiếu quota hoặc captcha không đạt chất lượng.";
  if (status === 596) return details || "useapi.net mất kết nối với Google Flow trong lúc xử lý.";
  if (status >= 500) return details || "useapi.net hoặc Google Flow đang gặp sự cố. Vui lòng thử lại sau.";
  return details || `useapi.net từ chối yêu cầu (HTTP ${status}).`;
}

function extractProviderText(data: unknown): string {
  const record = asRecord(data);
  for (const key of ["message", "detail", "reason", "description", "errorDetails"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim().slice(0, 400);
  }

  const error = record.error;
  if (typeof error === "string" && error.trim()) return error.trim().slice(0, 400);
  if (error && typeof error === "object") {
    const nested = asRecord(error);
    for (const key of ["message", "detail", "reason", "description", "status"]) {
      const value = nested[key];
      if (typeof value === "string" && value.trim()) return value.trim().slice(0, 400);
    }
  }

  const response = asRecord(record.response);
  const responseError = asRecord(response.error);
  if (typeof responseError.message === "string") return responseError.message.slice(0, 400);

  return "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

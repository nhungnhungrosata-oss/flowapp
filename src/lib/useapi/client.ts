import { env } from "@/lib/env";
import { sleep } from "@/lib/utils";
import { UseApiError } from "@/lib/useapi/errors";

const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504]);

type RequestOptions = { method?: "GET" | "POST" | "DELETE"; body?: unknown; rawBody?: BodyInit; contentType?: string; signal?: AbortSignal; retrySafe?: boolean };

export async function useApiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const e = env();
  if (!e.USEAPI_TOKEN) throw new UseApiError(503, "USEAPI_NOT_CONFIGURED", "Dịch vụ tạo nội dung chưa được cấu hình.");
  const attempts = options.retrySafe === false ? 1 : 3;
  let last: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), e.USEAPI_TIMEOUT_MS);
    const onAbort = () => controller.abort();
    options.signal?.addEventListener("abort", onAbort, { once: true });
    try {
      const headers: HeadersInit = { Authorization: `Bearer ${e.USEAPI_TOKEN}` };
      let body: BodyInit | undefined;
      if (options.rawBody) { body = options.rawBody; if (options.contentType) headers["Content-Type"] = options.contentType; }
      else if (options.body !== undefined) { headers["Content-Type"] = "application/json"; body = JSON.stringify(options.body); }
      const response = await fetch(`${e.USEAPI_BASE_URL}${path}`, { method: options.method ?? "GET", headers, body, signal: controller.signal, cache: "no-store" });
      const text = await response.text();
      const data = text ? safeJson(text) : {};
      if (!response.ok) {
        const err = new UseApiError(response.status, extractCode(data), safeProviderMessage(response.status), data);
        if (!RETRYABLE.has(response.status) || attempt === attempts - 1) throw err;
        last = err;
      } else return data as T;
    } catch (error) {
      last = error;
      if (error instanceof UseApiError && !RETRYABLE.has(error.status)) throw error;
      if (attempt === attempts - 1) {
        if (error instanceof UseApiError) throw error;
        throw new UseApiError(504, "PROVIDER_TIMEOUT", "Dịch vụ AI phản hồi quá chậm. Vui lòng thử lại.", error);
      }
    } finally {
      clearTimeout(timer); options.signal?.removeEventListener("abort", onAbort);
    }
    await sleep(500 * 2 ** attempt + Math.floor(Math.random() * 250));
  }
  throw last;
}

function safeJson(text: string): unknown { try { return JSON.parse(text); } catch { return { raw: text.slice(0, 500) }; } }
function extractCode(data: unknown) { return typeof data === "object" && data && "error" in data ? String((data as { error: unknown }).error) : "PROVIDER_ERROR"; }
function safeProviderMessage(status: number) { if (status === 401) return "Cấu hình nhà cung cấp không hợp lệ."; if (status === 429) return "Hệ thống AI đang quá tải hoặc hết quota."; if (status >= 500) return "Nhà cung cấp AI đang gặp sự cố."; return "Yêu cầu tạo nội dung không hợp lệ."; }

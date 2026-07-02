import { env } from "@/lib/env";
import { UseApiError } from "./errors";
import { useApiRequest } from "./client";

export type FlowVideoModel = {
  key?: string;
  displayName?: string;
  creditCost?: number;
  paygateTier?: string;
  supportedAspectRatios?: string[];
};

export type CaptchaStatus = {
  freeCaptchaCredits?: number;
  providers: string[];
  usingFreeCredits: boolean;
};

export type FlowAccountSummary = {
  health?: string;
  error?: string;
  credits?: { credits?: number; userPaygateTier?: string };
  models?: { videoModels?: FlowVideoModel[] };
  recommendations?: string[];
  captcha?: CaptchaStatus;
};

let cache: { key: string; expiresAt: number; value: FlowAccountSummary } | null = null;

export async function assertFlowVideoReady(): Promise<FlowAccountSummary> {
  const email = normalizeEmail(env().USEAPI_ACCOUNT_EMAIL);
  const cacheKey = email || "__auto__";

  if (cache && cache.key === cacheKey && cache.expiresAt > Date.now()) {
    return cache.value;
  }

  const account = email
    ? await getSpecificAccount(email)
    : await getHealthyAccountFromPool();

  const health = String(account.health || "").toUpperCase();
  if (health !== "OK") {
    throw new UseApiError(
      503,
      "FLOW_ACCOUNT_UNHEALTHY",
      account.error || `Tài khoản Google Flow chưa sẵn sàng (health: ${account.health || "unknown"}).`,
      account,
    );
  }

  const credits = account.credits?.credits;
  if (typeof credits === "number" && credits <= 0) {
    throw new UseApiError(
      402,
      "FLOW_NO_CREDITS",
      "Tài khoản Google Flow không còn credits để tạo video với model đã chọn.",
      account,
    );
  }

  const videoModels = account.models?.videoModels ?? [];
  if (videoModels.length === 0) {
    throw new UseApiError(
      402,
      "FLOW_VIDEO_NOT_AVAILABLE",
      "Tài khoản Google Flow hiện không có model video khả dụng. Hãy kiểm tra gói Google AI của tài khoản.",
      account,
    );
  }

  const captcha = await getCaptchaStatus();
  if (!captcha.usingFreeCredits && captcha.providers.length === 0) {
    throw new UseApiError(
      402,
      "CAPTCHA_NOT_AVAILABLE",
      "Free captcha credits đã hết và chưa có captcha provider nào được cấu hình.",
      captcha,
    );
  }

  const ready = { ...account, captcha };
  cache = { key: cacheKey, expiresAt: Date.now() + 30_000, value: ready };
  return ready;
}

export async function getCaptchaStatus(): Promise<CaptchaStatus> {
  const response = await useApiRequest<Record<string, unknown>>("/accounts/captcha-providers", {
    method: "GET",
    retrySafe: true,
  });

  const freeCaptchaCredits = numberValue(response.freeCaptchaCredits);
  const providers = Object.entries(response)
    .filter(([name, value]) => name !== "freeCaptchaCredits" && typeof value === "string" && value.length > 0)
    .map(([name]) => name);

  return {
    freeCaptchaCredits,
    providers,
    usingFreeCredits: providers.length === 0 && typeof freeCaptchaCredits === "number" && freeCaptchaCredits > 0,
  };
}

async function getSpecificAccount(email: string): Promise<FlowAccountSummary> {
  return useApiRequest<FlowAccountSummary>(`/accounts/${encodeURIComponent(email)}`, {
    method: "GET",
    retrySafe: true,
  });
}

async function getHealthyAccountFromPool(): Promise<FlowAccountSummary> {
  const accounts = await useApiRequest<Record<string, FlowAccountSummary>>("/accounts", {
    method: "GET",
    retrySafe: true,
  });

  const entries = Object.entries(accounts || {});
  if (entries.length === 0) {
    throw new UseApiError(
      404,
      "FLOW_ACCOUNT_NOT_CONFIGURED",
      "Chưa có tài khoản Google Flow nào được cấu hình trong useapi.net.",
      accounts,
    );
  }

  const healthy = entries.find(([, account]) => String(account.health || "").toUpperCase() === "OK");
  if (healthy) {
    const [email] = healthy;
    return getSpecificAccount(email);
  }

  const [, first] = entries[0];
  throw new UseApiError(
    503,
    "FLOW_ACCOUNT_UNHEALTHY",
    first.error || "Không có tài khoản Google Flow nào ở trạng thái health OK.",
    accounts,
  );
}

function normalizeEmail(raw: string): string {
  const value = raw.trim().replace(/^['"]+|['"]+$/g, "").trim();
  return value.includes("@") ? value : "";
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

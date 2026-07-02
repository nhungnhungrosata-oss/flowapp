import { env } from "@/lib/env";
import { UseApiError } from "./errors";
import { useApiRequest } from "./client";

export type FlowAccountSummary = {
  health?: string;
  error?: string;
  credits?: { credits?: number; userPaygateTier?: string };
  models?: { videoModels?: Array<Record<string, unknown>> };
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

  cache = { key: cacheKey, expiresAt: Date.now() + 30_000, value: account };
  return account;
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
  if (healthy) return healthy[1];

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

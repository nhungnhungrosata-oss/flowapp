import { createHash } from "node:crypto";

export function normalizeUseApiToken(raw: string): string {
  let value = String(raw || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
    .trim();

  value = value
    .replace(/^USEAPI_TOKEN\s*=\s*/i, "")
    .replace(/^Authorization\s*:\s*/i, "")
    .replace(/^Bearer\s+/i, "")
    .replace(/^Your\s+API\s+token\s*:?\s*/i, "")
    .replace(/^['"`]+|['"`]+$/g, "")
    .trim();

  const tokenStart = value.indexOf("user:");
  if (tokenStart >= 0) value = value.slice(tokenStart);

  return value.replace(/[\s\u200B-\u200D\u2060\uFEFF]+/g, "");
}

export function getUseApiTokenDiagnostics(raw: string) {
  const normalized = normalizeUseApiToken(raw);
  return {
    present: normalized.length > 0,
    startsWithUser: normalized.startsWith("user:"),
    length: normalized.length,
    prefix: normalized ? normalized.slice(0, Math.min(10, normalized.length)) : "",
    fingerprint: normalized
      ? createHash("sha256").update(normalized).digest("hex").slice(0, 12)
      : "",
  };
}

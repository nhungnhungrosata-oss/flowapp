import { createHash, timingSafeEqual } from "node:crypto";

export function sha256(input: string | Buffer) { return createHash("sha256").update(input).digest("hex"); }
export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function redact(value: string) { return value.length <= 8 ? "***" : `${value.slice(0, 3)}…${value.slice(-3)}`; }
export function sanitizeFileName(name: string) { return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 120); }

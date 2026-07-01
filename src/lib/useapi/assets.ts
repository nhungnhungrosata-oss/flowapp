import { env } from "@/lib/env";
import { useApiRequest } from "./client";
import type { UseApiJob } from "./types";

export async function uploadProviderAsset(bytes: Uint8Array, contentType: string) {
  const email = env().USEAPI_ACCOUNT_EMAIL;
  const path = email ? `/assets/${encodeURIComponent(email)}` : "/assets";
  return useApiRequest<UseApiJob>(path, { method: "POST", rawBody: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer, contentType, retrySafe: false });
}

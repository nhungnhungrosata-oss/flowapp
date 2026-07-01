import { env } from "@/lib/env";
import { useApiRequest } from "./client";
import { useApiJobSchema, type ImageModel } from "./types";

export type GenerateCompositeInput = { prompt: string; model: ImageModel; aspectRatio: "9:16" | "1:1" | "16:9"; productAssetProviderId: string; characterRef: string; replyUrl: string; replyRef: string };

export async function generateCompositeImage(input: GenerateCompositeInput) {
  const response = await useApiRequest<unknown>("/images", { method: "POST", retrySafe: false, body: {
    prompt: input.prompt,
    model: input.model,
    aspectRatio: input.aspectRatio,
    count: 1,
    ...(env().USEAPI_ACCOUNT_EMAIL ? { email: env().USEAPI_ACCOUNT_EMAIL } : {}),
    reference_1: input.productAssetProviderId,
    character_1: input.characterRef,
    replyUrl: input.replyUrl,
    replyRef: input.replyRef
  }});
  return useApiJobSchema.parse(response);
}

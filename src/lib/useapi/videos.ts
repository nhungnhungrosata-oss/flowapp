import { env } from "@/lib/env";
import { useApiRequest } from "./client";
import { useApiJobSchema, type VideoModel } from "./types";

export type GenerateVideoInput = {
  prompt: string;
  model: VideoModel;
  aspectRatio: "portrait" | "landscape" | "1:1" | "4:3" | "3:4";
  duration: 4 | 6 | 8 | 10;
  startImage?: string;
  characterRef?: string;
  voiceRef?: string;
  replyUrl?: string;
  replyRef?: string;
};

export async function generateVideo(input: GenerateVideoInput) {
  const response = await useApiRequest<unknown>("/videos", {
    method: "POST",
    retrySafe: false,
    body: {
      prompt: input.prompt,
      model: input.model,
      aspectRatio: input.aspectRatio,
      duration: input.duration,
      count: 1,
      ...(input.startImage ? { startImage: input.startImage } : {}),
      ...(input.characterRef ? { character_1: input.characterRef } : {}),
      ...(input.voiceRef ? { referenceAudio_1: input.voiceRef } : {}),
      ...(env().USEAPI_ACCOUNT_EMAIL ? { email: env().USEAPI_ACCOUNT_EMAIL } : {}),
      async: true,
      ...(input.replyUrl ? { replyUrl: input.replyUrl } : {}),
      ...(input.replyRef ? { replyRef: input.replyRef } : {}),
    },
  });
  return useApiJobSchema.parse(response);
}

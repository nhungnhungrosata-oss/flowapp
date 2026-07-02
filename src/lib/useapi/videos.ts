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
  const accountEmail = normalizeAccountEmail(env().USEAPI_ACCOUNT_EMAIL);

  const response = await useApiRequest<unknown>("/videos", {
    method: "POST",
    retrySafe: false,
    body: {
      prompt: input.prompt.trim(),
      model: input.model,
      aspectRatio: input.aspectRatio,
      duration: input.duration,
      count: 1,
      ...(input.startImage ? { startImage: input.startImage.trim() } : {}),
      ...(input.characterRef ? { character_1: input.characterRef.trim() } : {}),
      ...(input.voiceRef ? { referenceAudio_1: input.voiceRef.trim() } : {}),
      ...(accountEmail ? { email: accountEmail } : {}),
      async: true,
      ...(input.replyUrl ? { replyUrl: input.replyUrl.trim() } : {}),
      ...(input.replyRef ? { replyRef: input.replyRef.trim() } : {}),
    },
  });

  return useApiJobSchema.parse(response);
}

function normalizeAccountEmail(raw: string): string {
  const value = raw
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .trim();

  return value.includes("@") ? value : "";
}

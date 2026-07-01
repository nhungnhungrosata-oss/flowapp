import { z } from "zod";

export const compositeSchema = z.object({
  projectId: z.string().min(1),
  productAssetProviderId: z.string().min(1),
  characterRef: z.string().min(1),
  scenePrompt: z.string().min(10).max(4000),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
  model: z.enum(["imagen-4", "nano-banana-2", "nano-banana-pro"]).default("nano-banana-pro"),
  idempotencyKey: z.string().min(8).max(128)
});

export const videoSchema = z.object({
  projectId: z.string().min(1),
  startImageProviderId: z.string().min(1),
  prompt: z.string().min(10).max(4000),
  aspectRatio: z.enum(["portrait", "landscape", "1:1", "4:3", "3:4"]).default("portrait"),
  duration: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(10)]).default(8),
  model: z.enum(["veo-3.1-quality", "veo-3.1-fast", "veo-3.1-lite", "veo-3.1-lite-low-priority", "omni-flash"]).default("veo-3.1-fast"),
  voiceRef: z.string().optional(),
  characterRef: z.string().optional(),
  idempotencyKey: z.string().min(8).max(128)
});

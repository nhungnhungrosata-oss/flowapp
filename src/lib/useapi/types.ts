import { z } from "zod";

const providerValue = z.union([z.string(), z.number(), z.null(), z.undefined()]).transform((value) => {
  if (value === null || value === undefined) return undefined;
  return String(value);
});

export const useApiJobSchema = z.object({
  jobid: providerValue,
  jobId: providerValue,
  status: providerValue,
  error: z.unknown().optional(),
  videoUrl: providerValue,
  thumbnailUrl: providerValue,
  fifeUrl: providerValue,
  mediaGenerationId: providerValue
}).passthrough();

export type UseApiJob = z.infer<typeof useApiJobSchema>;
export type ImageModel = "imagen-4" | "nano-banana-2" | "nano-banana-pro";
export type VideoModel = "veo-3.1-quality" | "veo-3.1-fast" | "veo-3.1-lite" | "veo-3.1-lite-low-priority" | "omni-flash";

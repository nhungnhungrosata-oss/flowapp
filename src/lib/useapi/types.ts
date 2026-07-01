import { z } from "zod";

export const useApiJobSchema = z.object({
  jobid: z.string().optional(),
  jobId: z.string().optional(),
  status: z.string().optional(),
  error: z.unknown().optional(),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  fifeUrl: z.string().optional(),
  mediaGenerationId: z.string().optional()
}).passthrough();

export type UseApiJob = z.infer<typeof useApiJobSchema>;
export type ImageModel = "imagen-4" | "nano-banana-2" | "nano-banana-pro";
export type VideoModel = "veo-3.1-quality" | "veo-3.1-fast" | "veo-3.1-lite" | "veo-3.1-lite-low-priority" | "omni-flash";

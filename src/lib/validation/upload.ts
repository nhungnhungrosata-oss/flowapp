import { z } from "zod";
export const presignUploadSchema = z.object({
  fileName: z.string().min(1).max(160),
  contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  projectId: z.string().optional()
});

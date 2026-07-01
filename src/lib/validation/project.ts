import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  industry: z.enum(["beauty", "fashion", "food", "home", "electronics", "other"]),
  productName: z.string().trim().min(2).max(160),
  productNotes: z.string().trim().max(1500).optional(),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
  targetDuration: z.union([z.literal(5), z.literal(8), z.literal(10), z.literal(15), z.literal(20), z.literal(30)]).default(8)
});

export const updateWizardSchema = z.object({
  characterId: z.string().min(1).optional(),
  sceneId: z.string().min(1).optional(),
  productAssetId: z.string().min(1).optional(),
  script: z.object({ hook: z.string().max(200), body: z.string().max(2000), cta: z.string().max(300), voiceoverText: z.string().max(3000), caption: z.string().max(2200), hashtags: z.array(z.string()).max(30) }).optional()
});

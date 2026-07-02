import { useApiRequest } from "./client";
import { useApiJobSchema, type UseApiJob } from "./types";

export async function getProviderJob(jobId: string): Promise<UseApiJob> {
  const raw = await useApiRequest<unknown>(`/jobs/${encodeURIComponent(jobId)}`, { retrySafe: true });
  const base = useApiJobSchema.parse(raw);
  const root = record(raw);
  const response = record(root.response);
  const items = Array.isArray(response.media) ? response.media : [];
  const media = record(items[0]);
  const image = record(media.image);
  const generated = record(image.generatedImage);

  return {
    ...base,
    videoUrl: base.videoUrl || text(media.videoUrl),
    thumbnailUrl: base.thumbnailUrl || text(media.thumbnailUrl),
    fifeUrl: base.fifeUrl || text(media.fifeUrl) || text(generated.fifeUrl),
    mediaGenerationId: base.mediaGenerationId || text(media.mediaGenerationId) || text(generated.mediaGenerationId),
    error: base.error || root.error || root.errorDetails || response.error,
  };
}

function text(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return undefined;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

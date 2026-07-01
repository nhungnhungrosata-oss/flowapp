import { useApiRequest } from "./client";
import { useApiJobSchema } from "./types";
export async function getProviderJob(jobId: string) { return useApiJobSchema.parse(await useApiRequest<unknown>(`/jobs/${encodeURIComponent(jobId)}`, { retrySafe: true })); }

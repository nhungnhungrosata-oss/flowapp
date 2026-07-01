import { Queue } from "bullmq";
import { env } from "@/lib/env";

export type GenerationJob = { generationId: string; kind: "SUBMIT_COMPOSITE" | "SUBMIT_VIDEO" | "SYNC_PROVIDER_JOB" | "PERSIST_OUTPUT" };

function redisConnection() {
  const url = new URL(env().REDIS_URL);
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    tls: url.protocol === "rediss:" ? {} : undefined
  };
}

let queue: Queue<GenerationJob, void, GenerationJob["kind"]> | undefined;
export function generationQueue() {
  return queue ??= new Queue<GenerationJob, void, GenerationJob["kind"]>("generations", { connection: redisConnection() });
}
export async function enqueueGeneration(data: GenerationJob, delay = 0) {
  await generationQueue().add(data.kind, data, { delay, attempts: 5, backoff: { type: "exponential", delay: 2000 }, removeOnComplete: 1000, removeOnFail: 5000 });
}

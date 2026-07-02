import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { assertFlowVideoReady, generateVideo, getProviderJob } from "@/lib/ai";
import { UseApiError } from "@/lib/useapi/errors";

export const runtime = "nodejs";
export const maxDuration = 280;

const submitSchema = z.object({
  action: z.literal("submit"),
  sceneId: z.string().min(1).max(80),
  prompt: z.string().min(20).max(5000),
  aspectRatio: z.enum(["portrait", "landscape", "1:1"]).default("portrait"),
  model: z.enum(["veo-3.1-fast", "veo-3.1-quality", "veo-3.1-lite", "veo-3.1-lite-low-priority"]).default("veo-3.1-fast"),
});

const progressSchema = z.object({
  action: z.literal("progress"),
  jobId: z.string().min(1).max(200),
});

const requestSchema = z.discriminatedUnion("action", [submitSchema, progressSchema]);

export async function POST(request: NextRequest) {
  try {
    await requireUser();
    const input = requestSchema.parse(await request.json());

    if (input.action === "progress") {
      const result = await getProviderJob(input.jobId);
      const providerStatus = String(result.status || "processing").toLowerCase();
      const status = ["completed", "succeeded"].includes(providerStatus)
        ? "completed"
        : ["failed", "error"].includes(providerStatus)
          ? "failed"
          : "processing";

      return NextResponse.json({
        jobId: input.jobId,
        status,
        providerStatus,
        videoUrl: result.videoUrl || result.fifeUrl || null,
        thumbnailUrl: result.thumbnailUrl || null,
        error: errorText(result.error),
      });
    }

    await assertFlowVideoReady();

    const result = await generateVideo({
      prompt: input.prompt,
      model: input.model,
      aspectRatio: input.aspectRatio,
      duration: 8,
      replyRef: input.sceneId,
    });

    const jobId = result.jobid ?? result.jobId;
    if (!jobId) throw new Error("useapi.net không trả về jobId cho yêu cầu async.");

    return NextResponse.json({
      jobId,
      status: result.status || "created",
      sceneId: input.sceneId,
    }, { status: 202 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    if (error instanceof UseApiError) {
      return NextResponse.json({ error: error.safeMessage, code: error.code }, { status: normalizeStatus(error.status) });
    }

    return NextResponse.json({
      error: error instanceof Error ? error.message : "Không thể xử lý yêu cầu tạo video.",
    }, { status: 500 });
  }
}

function errorText(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
  }
  return "Video tạo thất bại tại nhà cung cấp.";
}

function normalizeStatus(status: number): number {
  return status >= 400 && status <= 599 ? status : 500;
}

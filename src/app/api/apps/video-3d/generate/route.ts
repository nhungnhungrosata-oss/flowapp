import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { generateVideo } from "@/lib/useapi/videos";

export const runtime = "nodejs";

const requestSchema = z.object({
  sceneId: z.string().min(1).max(80),
  prompt: z.string().min(20).max(5000),
  aspectRatio: z.enum(["portrait", "landscape", "1:1"]).default("portrait"),
  model: z.enum(["veo-3.1-fast", "veo-3.1-quality", "veo-3.1-lite", "veo-3.1-lite-low-priority"]).default("veo-3.1-fast"),
});

export async function POST(request: NextRequest) {
  try {
    await requireUser();
    const input = requestSchema.parse(await request.json());
    const result = await generateVideo({
      prompt: input.prompt,
      model: input.model,
      aspectRatio: input.aspectRatio,
      duration: 8,
      replyRef: input.sceneId,
    });

    const jobId = result.jobid ?? result.jobId;
    if (!jobId) throw new Error("useapi.net không trả về jobId.");

    return NextResponse.json({
      jobId,
      status: result.status || "queued",
      sceneId: input.sceneId,
    }, { status: 202 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Dữ liệu không hợp lệ." }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Không thể gửi yêu cầu tạo video.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

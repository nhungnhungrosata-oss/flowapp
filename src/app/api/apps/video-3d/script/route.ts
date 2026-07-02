import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { generateVideo3DScript } from "@/lib/video-3d-script";

export const runtime = "nodejs";

const requestSchema = z.object({
  topic: z.string().trim().min(5, "Chủ đề cần ít nhất 5 ký tự.").max(600),
  sceneCount: z.number().int().min(1).max(5),
  style: z.enum(["Vui vẻ", "Giáo dục", "Truyền cảm hứng", "Hài hước", "Dễ thương", "Điện ảnh", "Chuyên nghiệp"]),
  provider: z.enum(["gemini", "deepseek"]),
});

export async function POST(request: NextRequest) {
  try {
    await requireUser();
    const input = requestSchema.parse(await request.json());
    const script = await generateVideo3DScript(input);
    return NextResponse.json({ script, provider: input.provider });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Dữ liệu không hợp lệ." }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Không thể tạo kịch bản.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

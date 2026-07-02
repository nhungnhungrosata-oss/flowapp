import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { generateText } from "@/lib/ai";
import { useApiRequest } from "@/lib/useapi/client";

const bodySchema = z.object({ service: z.enum(["gemini", "deepseek", "useapi"]) });

export async function POST(request: NextRequest) {
  const started = Date.now();
  try {
    await requireUser();
    const { service } = bodySchema.parse(await request.json());

    if (service === "useapi") {
      await useApiRequest("/accounts", { method: "GET" });
    } else {
      await generateText({
        provider: service,
        systemPrompt: "Return only OK.",
        userPrompt: "Connection test",
        temperature: 0,
        maxTokens: 8,
      });
    }

    return NextResponse.json({ ok: true, service, latencyMs: Date.now() - started });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Connection failed",
      latencyMs: Date.now() - started,
    }, { status: 500 });
  }
}

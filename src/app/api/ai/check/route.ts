import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { assertFlowVideoReady, generateText } from "@/lib/ai";
import { UseApiError } from "@/lib/useapi/errors";

const bodySchema = z.object({ service: z.enum(["gemini", "deepseek", "useapi"]) });

export async function POST(request: NextRequest) {
  const started = Date.now();

  try {
    await requireUser();
    const { service } = bodySchema.parse(await request.json());

    if (service === "useapi") {
      const account = await assertFlowVideoReady();
      return NextResponse.json({
        ok: true,
        service,
        latencyMs: Date.now() - started,
        health: account.health || "OK",
        credits: account.credits?.credits ?? null,
        tier: account.credits?.userPaygateTier ?? null,
        videoModels: account.models?.videoModels?.length ?? null,
      });
    }

    await generateText({
      provider: service,
      systemPrompt: "Return only OK.",
      userPrompt: "Connection test",
      temperature: 0,
      maxTokens: 8,
    });

    return NextResponse.json({ ok: true, service, latencyMs: Date.now() - started });
  } catch (error) {
    if (error instanceof UseApiError) {
      return NextResponse.json({
        ok: false,
        error: error.safeMessage,
        code: error.code,
        latencyMs: Date.now() - started,
      }, { status: error.status >= 400 && error.status <= 599 ? error.status : 500 });
    }

    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Connection failed",
      latencyMs: Date.now() - started,
    }, { status: 500 });
  }
}

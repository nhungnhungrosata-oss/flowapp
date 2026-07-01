import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UseApiError } from "@/lib/useapi/errors";

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "INVALID_INPUT", details: error.issues }, { status: 400 });
  if (error instanceof UseApiError) return NextResponse.json({ error: "PROVIDER_ERROR", code: error.code, message: error.safeMessage }, { status: error.status >= 400 && error.status < 500 ? error.status : 502 });
  if (error instanceof Error && error.message === "FORBIDDEN") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  console.error("Unhandled API error", error);
  return NextResponse.json({ error: "INTERNAL_ERROR", message: "Đã xảy ra lỗi. Vui lòng thử lại." }, { status: 500 });
}

"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, LoaderCircle, RefreshCw } from "lucide-react";

type StatusResponse = {
  ok: boolean;
  error?: string;
  health?: string;
  credits?: number | null;
  tier?: string | null;
  videoModels?: number;
  freeCaptchaCredits?: number | null;
  captchaProviders?: string[];
  usingFreeCaptcha?: boolean;
  recommendations?: string[];
};

export function UseApiStatusBanner() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function check() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "useapi" }),
        cache: "no-store",
      });
      const data = await response.json() as StatusResponse;
      setStatus(data);
    } catch {
      setStatus({ ok: false, error: "Không thể kiểm tra kết nối useapi.net." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void check(); }, []);

  if (loading) {
    return (
      <div className="border-b border-white/7 bg-[#0a0d13] px-4 py-2.5 text-xs text-slate-400">
        <div className="mx-auto flex max-w-[1500px] items-center gap-2"><LoaderCircle size={14} className="animate-spin" /> Đang kiểm tra Google Flow và captcha...</div>
      </div>
    );
  }

  if (!status?.ok) {
    return (
      <div className="border-b border-rose-400/15 bg-rose-400/7 px-4 py-3 text-xs text-rose-100">
        <div className="mx-auto flex max-w-[1500px] items-start gap-3">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1"><p className="font-bold">Google Flow chưa sẵn sàng</p><p className="mt-1 text-rose-100/70">{status?.error}</p></div>
          <button onClick={check} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-300/15 px-2.5 py-1.5 font-bold"><RefreshCw size={12} /> Kiểm tra lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-emerald-400/12 bg-emerald-400/6 px-4 py-2.5 text-xs text-slate-300">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex items-center gap-2 font-bold text-emerald-200"><CheckCircle2 size={14} /> Google Flow: {status.health || "OK"}</span>
        <span>Flow credits: <strong className="text-white">{status.credits ?? "—"}</strong></span>
        <span>Video models: <strong className="text-white">{status.videoModels ?? 0}</strong></span>
        {status.usingFreeCaptcha ? (
          <span>Free captcha: <strong className="text-white">{status.freeCaptchaCredits ?? 0}</strong> lượt</span>
        ) : (
          <span>Captcha providers: <strong className="text-white">{status.captchaProviders?.join(", ") || "—"}</strong></span>
        )}
        <button onClick={check} className="ml-auto flex items-center gap-1.5 text-slate-500 hover:text-white"><RefreshCw size={12} /> Làm mới</button>
      </div>
      {status.recommendations?.length ? <div className="mx-auto mt-1 max-w-[1500px] text-[11px] text-amber-200/80">Khuyến nghị: {status.recommendations[0]}</div> : null}
    </div>
  );
}

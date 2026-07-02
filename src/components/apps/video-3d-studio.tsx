"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clapperboard,
  Copy,
  Download,
  LoaderCircle,
  Monitor,
  Play,
  RefreshCw,
  Smartphone,
  Sparkles,
  Square,
  WandSparkles,
} from "lucide-react";

type Scene = {
  id: string;
  title: string;
  narration: string;
  visualPrompt: string;
  camera: string;
  onScreenText: string;
};

type Script = {
  title: string;
  concept: string;
  scenes: Scene[];
};

type JobState = {
  status: "idle" | "submitting" | "processing" | "completed" | "failed";
  jobId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
};

const sceneOptions = [1, 2, 3, 4, 5];
const styles = ["Vui vẻ", "Giáo dục", "Truyền cảm hứng", "Hài hước", "Dễ thương", "Điện ảnh", "Chuyên nghiệp"] as const;

export function Video3DStudio() {
  const [topic, setTopic] = useState("");
  const [sceneCount, setSceneCount] = useState(3);
  const [style, setStyle] = useState<(typeof styles)[number]>("Vui vẻ");
  const [provider, setProvider] = useState<"gemini" | "deepseek">("gemini");
  const [aspectRatio, setAspectRatio] = useState<"portrait" | "landscape" | "1:1">("portrait");
  const [model, setModel] = useState<"veo-3.1-fast" | "veo-3.1-quality">("veo-3.1-fast");
  const [script, setScript] = useState<Script | null>(null);
  const [jobs, setJobs] = useState<Record<string, JobState>>({});
  const [scriptLoading, setScriptLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const jobsRef = useRef(jobs);
  useEffect(() => { jobsRef.current = jobs; }, [jobs]);

  const hasActiveJobs = useMemo(
    () => Object.values(jobs).some((job) => job.status === "processing"),
    [jobs],
  );

  useEffect(() => {
    if (!hasActiveJobs) return;
    let cancelled = false;

    async function poll() {
      const active = Object.entries(jobsRef.current).filter(([, job]) => job.status === "processing" && job.jobId);
      await Promise.all(active.map(async ([sceneId, job]) => {
        try {
          const response = await fetch("/api/apps/video-3d/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "progress", jobId: job.jobId }),
          });
          const data = await response.json() as {
            status?: string;
            videoUrl?: string | null;
            thumbnailUrl?: string | null;
            error?: string | null;
          };
          if (cancelled) return;
          if (!response.ok) throw new Error(data.error || "Không thể kiểm tra tiến độ.");

          if (data.status === "completed") {
            setJobs((current) => ({
              ...current,
              [sceneId]: {
                ...current[sceneId],
                status: "completed",
                videoUrl: data.videoUrl || undefined,
                thumbnailUrl: data.thumbnailUrl || undefined,
              },
            }));
          } else if (data.status === "failed") {
            setJobs((current) => ({
              ...current,
              [sceneId]: { ...current[sceneId], status: "failed", error: data.error || "Video tạo thất bại." },
            }));
          }
        } catch (pollError) {
          console.error("Video progress check failed", pollError);
        }
      }));
    }

    poll();
    const timer = window.setInterval(poll, 7000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [hasActiveJobs]);

  async function createScript() {
    if (topic.trim().length < 5) {
      setError("Hãy nhập chủ đề có ít nhất 5 ký tự.");
      return;
    }

    setScriptLoading(true);
    setError("");
    setJobs({});

    try {
      const response = await fetch("/api/apps/video-3d/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), sceneCount, style, provider }),
      });
      const data = await response.json() as { script?: Script; error?: string };
      if (!response.ok || !data.script) throw new Error(data.error || "Không thể tạo kịch bản.");
      setScript(data.script);
      setJobs(Object.fromEntries(data.script.scenes.map((scene) => [scene.id, { status: "idle" }])));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể tạo kịch bản.");
    } finally {
      setScriptLoading(false);
    }
  }

  function updateScene(sceneId: string, field: "title" | "narration" | "visualPrompt" | "camera" | "onScreenText", value: string) {
    setScript((current) => current ? {
      ...current,
      scenes: current.scenes.map((scene) => scene.id === sceneId ? { ...scene, [field]: value } : scene),
    } : current);
  }

  function buildVideoPrompt(scene: Scene) {
    return `${scene.visualPrompt}\nCamera direction: ${scene.camera}.\nMaintain one consistent anthropomorphic 3D character design, same face, proportions, colors and outfit across all scenes. Premium stylized 3D animation, cinematic lighting, polished materials, smooth natural motion, no subtitles, no logos, no watermark, no malformed anatomy.`;
  }

  async function submitScene(scene: Scene) {
    setError("");
    setJobs((current) => ({ ...current, [scene.id]: { status: "submitting" } }));

    try {
      const response = await fetch("/api/apps/video-3d/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          sceneId: scene.id,
          prompt: buildVideoPrompt(scene),
          aspectRatio,
          model,
        }),
      });
      const data = await response.json() as { jobId?: string; error?: string };
      if (!response.ok || !data.jobId) throw new Error(data.error || "Không thể gửi cảnh sang useapi.net.");
      setJobs((current) => ({ ...current, [scene.id]: { status: "processing", jobId: data.jobId } }));
    } catch (requestError) {
      setJobs((current) => ({
        ...current,
        [scene.id]: { status: "failed", error: requestError instanceof Error ? requestError.message : "Tạo video thất bại." },
      }));
    }
  }

  async function submitAll() {
    if (!script) return;
    setAllLoading(true);
    for (const scene of script.scenes) {
      const current = jobsRef.current[scene.id];
      if (current?.status === "processing" || current?.status === "completed") continue;
      await submitScene(scene);
    }
    setAllLoading(false);
  }

  async function copyPrompt(scene: Scene) {
    await navigator.clipboard.writeText(buildVideoPrompt(scene));
    setCopied(scene.id);
    window.setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#080a0f]">
      <div className="border-b border-white/7 bg-[#0b0e14]/92 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/apps" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/[.035] text-slate-400 transition hover:bg-white/8 hover:text-white">
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2"><h1 className="truncate font-extrabold">Tạo Video 3D</h1><span className="rounded-full border border-violet-300/15 bg-violet-400/8 px-2 py-0.5 text-[9px] font-bold text-violet-100">BETA</span></div>
              <p className="mt-0.5 truncate text-xs text-slate-500">Kịch bản AI · Nhân vật 3D nhân hóa · Video 8 giây mỗi cảnh</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Backend bảo vệ API key</div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[370px_minmax(0,1fr)]">
        <aside className="border-b border-white/8 bg-[#0b0d12] p-4 sm:p-5 lg:min-h-[calc(100vh-133px)] lg:border-b-0 lg:border-r">
          <div className="lg:sticky lg:top-[88px]">
            <p className="text-[11px] font-black uppercase tracking-[.16em] text-slate-300">Nhập tiêu đề nội dung</p>
            <textarea
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-white/14 bg-[#0d1016] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-4 focus:ring-violet-500/8"
              placeholder="Ví dụ: Tác dụng của quả chanh, Lợi ích của củ tỏi..."
              maxLength={600}
            />
            <div className="mt-1 text-right text-[10px] text-slate-600">{topic.length}/600</div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Field label="Số cảnh">
                <select value={sceneCount} onChange={(event) => setSceneCount(Number(event.target.value))} className="studio-select">
                  {sceneOptions.map((count) => <option key={count} value={count}>{count} cảnh ({count * 8}s)</option>)}
                </select>
              </Field>

              <Field label="Phong cách">
                <select value={style} onChange={(event) => setStyle(event.target.value as (typeof styles)[number])} className="studio-select">
                  {styles.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </Field>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold text-slate-500">AI viết kịch bản</p>
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/9 bg-black/20 p-1.5">
                <button onClick={() => setProvider("gemini")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition ${provider === "gemini" ? "bg-blue-500/18 text-blue-100 ring-1 ring-blue-300/20" : "text-slate-500 hover:text-white"}`}><Sparkles size={15} /> Gemini</button>
                <button onClick={() => setProvider("deepseek")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition ${provider === "deepseek" ? "bg-cyan-500/16 text-cyan-100 ring-1 ring-cyan-300/20" : "text-slate-500 hover:text-white"}`}><Bot size={15} /> DeepSeek</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Tỷ lệ video">
                <select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value as typeof aspectRatio)} className="studio-select">
                  <option value="portrait">9:16 Dọc</option>
                  <option value="landscape">16:9 Ngang</option>
                  <option value="1:1">1:1 Vuông</option>
                </select>
              </Field>
              <Field label="Model video">
                <select value={model} onChange={(event) => setModel(event.target.value as typeof model)} className="studio-select">
                  <option value="veo-3.1-fast">Veo Fast</option>
                  <option value="veo-3.1-quality">Veo Quality</option>
                </select>
              </Field>
            </div>

            {error ? <div className="mt-4 flex gap-2 rounded-xl border border-rose-400/20 bg-rose-400/8 p-3 text-xs leading-5 text-rose-100"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</div> : null}

            <button onClick={createScript} disabled={scriptLoading} className="btn-primary mt-5 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60">
              {scriptLoading ? <LoaderCircle className="animate-spin" size={18} /> : <WandSparkles size={18} />}
              {scriptLoading ? "Đang viết kịch bản..." : script ? "Tạo lại kịch bản" : "Tạo kịch bản 3D"}
            </button>
          </div>
        </aside>

        <main className="min-w-0 bg-[#090b10] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-5 border-b border-white/7 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xl font-black tracking-tight">Kịch bản 3D: {script?.title || (topic.trim() || "Chưa có tiêu đề")}</p>
                <p className="mt-1 text-xs text-slate-500">Nhân vật 3D nhân hóa · Mỗi cảnh 8 giây · Tổng {sceneCount * 8} giây</p>
              </div>
              {script ? <button onClick={submitAll} disabled={allLoading} className="btn-primary shrink-0 disabled:opacity-60">{allLoading ? <LoaderCircle size={17} className="animate-spin" /> : <Clapperboard size={17} />} Tạo tất cả video</button> : null}
            </div>

            {!script && !scriptLoading ? (
              <div className="grid min-h-[430px] place-items-center text-center">
                <div className="max-w-md">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/8 bg-white/[.03] text-slate-500"><Clapperboard size={27} /></span>
                  <h2 className="mt-5 text-lg font-bold">Bắt đầu bằng một chủ đề</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Nhập nội dung ở cột bên trái, chọn số cảnh và phong cách. AI sẽ xây dựng kịch bản 3D có thể chỉnh sửa trước khi tạo video.</p>
                </div>
              </div>
            ) : null}

            {scriptLoading ? <ScriptSkeleton count={sceneCount} /> : null}

            {script ? (
              <div className="mt-6">
                <div className="rounded-2xl border border-violet-300/12 bg-violet-500/6 p-4 text-sm leading-6 text-slate-400"><span className="font-bold text-violet-100">Ý tưởng tổng thể:</span> {script.concept}</div>
                <div className="mt-5 space-y-5">
                  {script.scenes.map((scene, index) => (
                    <SceneEditor
                      key={scene.id}
                      scene={scene}
                      index={index}
                      job={jobs[scene.id] || { status: "idle" }}
                      aspectRatio={aspectRatio}
                      copied={copied === scene.id}
                      onChange={updateScene}
                      onCopy={() => copyPrompt(scene)}
                      onGenerate={() => submitScene(scene)}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block rounded-2xl border border-white/12 bg-[#0d1016] px-3 py-2.5"><span className="block text-[11px] text-slate-500">{label}</span>{children}</label>;
}

function SceneEditor({ scene, index, job, aspectRatio, copied, onChange, onCopy, onGenerate }: {
  scene: Scene;
  index: number;
  job: JobState;
  aspectRatio: "portrait" | "landscape" | "1:1";
  copied: boolean;
  onChange: (sceneId: string, field: "title" | "narration" | "visualPrompt" | "camera" | "onScreenText", value: string) => void;
  onCopy: () => void;
  onGenerate: () => void;
}) {
  const RatioIcon = aspectRatio === "portrait" ? Smartphone : aspectRatio === "landscape" ? Monitor : Square;
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/9 bg-[#0d1016]">
      <div className="flex items-center gap-3 border-b border-white/7 px-4 py-3 sm:px-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-violet-500/14 text-xs font-black text-violet-100">{index + 1}</span>
        <input value={scene.title} onChange={(event) => onChange(scene.id, "title", event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none" />
        <span className="flex shrink-0 items-center gap-1.5 text-[10px] text-slate-600"><RatioIcon size={13} /> 8 giây</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="space-y-4 p-4 sm:p-5">
          <EditorField label="Lời dẫn tiếng Việt">
            <textarea value={scene.narration} onChange={(event) => onChange(scene.id, "narration", event.target.value)} className="scene-textarea min-h-20" />
          </EditorField>
          <EditorField label="Prompt hình ảnh & chuyển động 3D">
            <textarea value={scene.visualPrompt} onChange={(event) => onChange(scene.id, "visualPrompt", event.target.value)} className="scene-textarea min-h-32 font-mono text-[12px]" />
          </EditorField>
          <div className="grid gap-3 sm:grid-cols-2">
            <EditorField label="Camera">
              <input value={scene.camera} onChange={(event) => onChange(scene.id, "camera", event.target.value)} className="scene-input" />
            </EditorField>
            <EditorField label="Text hiển thị">
              <input value={scene.onScreenText} onChange={(event) => onChange(scene.id, "onScreenText", event.target.value)} className="scene-input" />
            </EditorField>
          </div>
        </div>

        <div className="border-t border-white/7 bg-black/15 p-4 lg:border-l lg:border-t-0">
          {job.status === "completed" && job.videoUrl ? (
            <div>
              <video controls playsInline poster={job.thumbnailUrl} className={`w-full rounded-xl border border-white/9 bg-black object-cover ${aspectRatio === "portrait" ? "aspect-[9/16]" : aspectRatio === "landscape" ? "aspect-video" : "aspect-square"}`} src={job.videoUrl} />
              <a href={job.videoUrl} target="_blank" rel="noreferrer" className="btn-secondary mt-3 w-full text-xs"><Download size={15} /> Tải video cảnh {index + 1}</a>
              <p className="mt-2 text-center text-[10px] text-slate-600">Link nhà cung cấp có thời hạn ngắn.</p>
            </div>
          ) : (
            <div className={`grid place-items-center rounded-xl border border-dashed border-white/10 bg-black/20 text-center ${aspectRatio === "portrait" ? "min-h-64" : "min-h-44"}`}>
              <div className="px-4">
                {job.status === "submitting" || job.status === "processing" ? (
                  <><LoaderCircle className="mx-auto animate-spin text-violet-300" size={27} /><p className="mt-3 text-sm font-bold">Đang tạo video...</p><p className="mt-1 break-all text-[10px] text-slate-600">{job.jobId || "Đang gửi yêu cầu"}</p></>
                ) : job.status === "failed" ? (
                  <><AlertCircle className="mx-auto text-rose-300" size={27} /><p className="mt-3 text-sm font-bold text-rose-100">Tạo cảnh thất bại</p><p className="mt-1 text-[10px] leading-4 text-slate-600">{job.error}</p></>
                ) : (
                  <><Play className="mx-auto text-slate-600" size={28} /><p className="mt-3 text-xs text-slate-500">Video cảnh {index + 1} sẽ xuất hiện tại đây</p></>
                )}
              </div>
            </div>
          )}

          {job.status !== "completed" ? (
            <button onClick={onGenerate} disabled={job.status === "submitting" || job.status === "processing"} className="btn-primary mt-3 w-full text-xs disabled:cursor-not-allowed disabled:opacity-50">
              {job.status === "failed" ? <RefreshCw size={15} /> : <Clapperboard size={15} />}
              {job.status === "failed" ? "Thử tạo lại" : job.status === "processing" || job.status === "submitting" ? "Đang xử lý" : "Tạo video cảnh này"}
            </button>
          ) : null}
          <button onClick={onCopy} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-500 transition hover:bg-white/5 hover:text-white">
            {copied ? <CheckCircle2 size={14} className="text-emerald-300" /> : <Copy size={14} />}{copied ? "Đã sao chép" : "Sao chép prompt"}
          </button>
        </div>
      </div>
    </article>
  );
}

function EditorField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-600">{label}</span>{children}</label>;
}

function ScriptSkeleton({ count }: { count: number }) {
  return <div className="mt-6 space-y-5">{Array.from({ length: count }).map((_, index) => <div key={index} className="animate-pulse rounded-[22px] border border-white/7 bg-white/[.025] p-5"><div className="h-5 w-40 rounded bg-white/7" /><div className="mt-5 h-20 rounded-xl bg-white/[.04]" /><div className="mt-3 h-28 rounded-xl bg-white/[.04]" /></div>)}</div>;
}

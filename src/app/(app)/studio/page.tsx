import { Search, Sparkles } from "lucide-react";
import { AppCard } from "@/components/apps/app-card";
import { appCatalog, appCategories } from "@/lib/app-catalog";

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="pill border-violet-300/15 bg-violet-500/8 text-violet-100"><Sparkles size={14} /> Creative App Studio</div>
          <h1 className="mt-5 text-4xl font-black tracking-[-.04em]">Ứng dụng AI của bạn</h1>
          <p className="mt-3 leading-7 text-slate-400">Chọn một công cụ chuyên biệt để bắt đầu công việc mới.</p>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
          <input className="input py-3.5 pl-11" placeholder="Tìm ứng dụng..." />
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-white/7 pb-6 scrollbar">
        {appCategories.map((category, index) => (
          <button key={category} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${index === 0 ? "border-violet-300/25 bg-violet-500/12 text-white" : "border-white/8 bg-white/[.025] text-slate-500 hover:text-white"}`}>
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {appCatalog.map((app) => <AppCard key={app.slug} app={app} />)}
      </div>
    </div>
  );
}

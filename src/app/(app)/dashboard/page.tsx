import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Coins,
  FolderKanban,
  Search,
  Sparkles,
} from "lucide-react";
import { AppCard } from "@/components/apps/app-card";
import { appCatalog, appCollections } from "@/lib/app-catalog";

const recentWork = [
  { name: "Serum GlowUp — Campaign", type: "Creative Bundle", time: "2 giờ trước", gradient: "from-pink-500/30 to-orange-400/10" },
  { name: "Bộ ảnh áo linen", type: "Product to Model", time: "Hôm qua", gradient: "from-cyan-500/25 to-blue-500/10" },
  { name: "Kịch bản máy xay mini", type: "AI Script Writer", time: "2 ngày trước", gradient: "from-emerald-500/20 to-cyan-500/10" },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative overflow-hidden rounded-[28px] border border-white/9 bg-gradient-to-br from-violet-600/18 via-[#101827] to-cyan-500/8 p-6 sm:p-8">
        <div className="ambient-orb -right-16 -top-16 h-56 w-56 bg-cyan-500/10" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">Creative workspace</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-.035em] sm:text-4xl">Bạn muốn tạo gì hôm nay?</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">Chọn một ứng dụng AI và bắt đầu công việc trong không gian chuyên biệt.</p>
            <div className="relative mt-6 max-w-xl">
              <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input className="input py-3.5 pl-11" placeholder="Tìm ứng dụng, ví dụ: ghép sản phẩm vào người mẫu..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[400px]">
            <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500"><Coins size={15} /> Credit</div>
              <p className="mt-3 text-2xl font-black">680</p>
              <p className="mt-1 text-[11px] text-slate-600">Pro plan</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500"><FolderKanban size={15} /> Projects</div>
              <p className="mt-3 text-2xl font-black">12</p>
              <p className="mt-1 text-[11px] text-slate-600">3 đang hoạt động</p>
            </div>
            <Link href="/apps" className="group col-span-2 flex items-center justify-between rounded-2xl border border-violet-300/15 bg-violet-500/10 p-4 sm:col-span-1 sm:block">
              <div className="flex items-center gap-2 text-xs text-violet-200"><Sparkles size={15} /> App catalog</div>
              <p className="mt-0 text-sm font-bold sm:mt-4">Xem tất cả <ArrowRight className="ml-1 inline transition group-hover:translate-x-1" size={14} /></p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-300">Your apps</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Ứng dụng nổi bật</h2>
          </div>
          <Link href="/apps" className="text-sm font-semibold text-cyan-300">Tất cả ứng dụng</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {appCatalog.slice(0, 8).map((app) => <AppCard key={app.slug} app={app} compact />)}
        </div>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Bộ giải pháp đề xuất</h2>
              <p className="mt-1 text-xs text-slate-500">Các app được nhóm theo mục tiêu kinh doanh.</p>
            </div>
            <Link href="/apps#collections" className="text-xs font-bold text-cyan-300">Khám phá</Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            {appCollections.map((collection) => {
              const Icon = collection.icon;
              return (
                <Link key={collection.title} href="/apps" className={`group flex items-center gap-4 rounded-2xl border border-white/7 bg-gradient-to-r ${collection.gradient} p-4 transition hover:border-white/14`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/9 bg-black/15"><Icon size={19} /></span>
                  <div className="min-w-0 flex-1"><p className="font-bold">{collection.title}</p><p className="mt-1 truncate text-xs text-slate-500">{collection.apps.join(" · ")}</p></div>
                  <ArrowRight size={16} className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Công việc gần đây</h2>
              <p className="mt-1 text-xs text-slate-500">Tiếp tục nơi bạn đã dừng lại.</p>
            </div>
            <Clock3 size={18} className="text-slate-600" />
          </div>
          <div className="mt-5 divide-y divide-white/7">
            {recentWork.map((item) => (
              <Link href="/projects" key={item.name} className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/8 bg-gradient-to-br ${item.gradient}`}><Sparkles size={17} /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.type} · {item.time}</p></div>
                <ArrowRight size={15} className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

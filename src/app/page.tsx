import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CirclePlay,
  Search,
  Sparkles,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AppCard } from "@/components/apps/app-card";
import { appCatalog, appCategories, appCollections } from "@/lib/app-catalog";

const industries = [
  { name: "Sản phẩm & 3D", count: "2 ứng dụng", gradient: "from-violet-500/30 to-blue-500/5" },
  { name: "Thương hiệu & kiến thức", count: "2 ứng dụng", gradient: "from-cyan-500/25 to-emerald-500/5" },
  { name: "BĐS & dịch vụ", count: "3 ứng dụng", gradient: "from-amber-500/25 to-orange-500/5" },
  { name: "Thời trang & làm đẹp", count: "2 ứng dụng", gradient: "from-pink-500/30 to-fuchsia-500/5" },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <MarketingHeader />

      <section className="relative border-b border-white/6">
        <div className="subtle-grid absolute inset-0" />
        <div className="ambient-orb -left-32 top-16 h-72 w-72 bg-violet-600/20" />
        <div className="ambient-orb -right-20 top-24 h-80 w-80 bg-cyan-500/10" />

        <div className="relative mx-auto grid min-h-[740px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
          <div>
            <div className="pill border-violet-300/15 bg-violet-500/8 text-violet-100">
              <Sparkles size={14} /> 10 AI Video Apps chuyên ngành
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-.045em] sm:text-6xl lg:text-[72px]">
              Mỗi ngành nghề,
              <span className="gradient-text block">một ứng dụng video AI riêng.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Tạo video 3D, video nhân hiệu, bất động sản, mẹo vặt, sản phẩm, thời trang và nhiều lĩnh vực khác trong một hệ sinh thái duy nhất.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/apps" className="btn-primary px-6 py-3.5">
                Khám phá 10 ứng dụng <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="btn-secondary px-6 py-3.5">
                Mở Dashboard <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              {["10 ứng dụng chuyên biệt", "Tối ưu video dọc", "Dành cho seller & doanh nghiệp"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><Check size={12} /></span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[590px]">
            <div className="absolute -inset-10 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="glass relative overflow-hidden rounded-[30px] p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-white/7 px-2 pb-4">
                <div>
                  <p className="text-sm font-bold">Video App Center</p>
                  <p className="mt-1 text-xs text-slate-500">Chọn đúng ứng dụng cho nội dung của bạn</p>
                </div>
                <span className="rounded-full border border-emerald-300/15 bg-emerald-400/8 px-2.5 py-1 text-[10px] font-bold text-emerald-100">10 APPS</span>
              </div>

              <div className="relative mt-4 flex items-center rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-500">
                <Search size={17} className="mr-3" /> Tìm app: BĐS, thời trang, 3D...
                <span className="ml-auto rounded-lg border border-white/8 bg-white/4 px-2 py-1 text-[10px]">⌘ K</span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {appCatalog.slice(0, 4).map((app) => {
                  const Icon = app.icon;
                  return (
                    <Link key={app.slug} href={app.href} className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${app.gradient} p-4 transition hover:-translate-y-1 hover:border-white/15`}>
                      <div className="flex items-start justify-between">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${app.iconStyle}`}><Icon size={19} /></span>
                        {app.badge ? <span className="rounded-full bg-white/8 px-2 py-1 text-[9px] font-bold text-white">{app.badge}</span> : null}
                      </div>
                      <p className="mt-5 text-sm font-bold">{app.name}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{app.tags.slice(0, 2).join(" · ")}</p>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[.025] p-4">
                <div><p className="text-sm font-bold">10 ứng dụng đã sẵn sàng</p><p className="mt-1 text-[11px] text-slate-500">Mỗi app có một trang và nhận diện riêng</p></div>
                <Link href="/apps" className="grid h-11 w-11 place-items-center rounded-xl border border-white/8 bg-white/[.035] text-slate-400 transition hover:bg-white/8 hover:text-white"><ArrowUpRight size={19} /></Link>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-6 hidden rounded-2xl border border-white/10 bg-[#111827]/90 p-3 shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-200"><CirclePlay size={19} /></span>
              <div><p className="text-xs font-bold">Video-first platform</p><p className="mt-1 text-[10px] text-slate-500">TikTok · Reels · Shorts</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">10 video apps</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.035em] sm:text-5xl">Chọn ứng dụng theo đúng ngành của bạn.</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">Mỗi app có tên, mục tiêu và không gian làm việc riêng. Chức năng chi tiết sẽ được triển khai lần lượt bên trong từng app.</p>
          </div>
          <Link href="/apps" className="btn-secondary self-start lg:self-auto">Xem trang ứng dụng <ArrowRight size={17} /></Link>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar">
          {appCategories.map((category, index) => (
            <span key={category} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${index === 0 ? "border-violet-300/25 bg-violet-500/12 text-white" : "border-white/8 bg-white/[.025] text-slate-500"}`}>
              {category}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {appCatalog.map((app) => <AppCard key={app.slug} app={app} compact />)}
        </div>
      </section>

      <section id="collections" className="border-y border-white/7 bg-white/[.012] py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-violet-300">App collections</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.035em] sm:text-5xl">Ba nhóm giải pháp video chính.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {appCollections.map((collection) => {
              const Icon = collection.icon;
              return (
                <Link key={collection.title} href="/apps" className={`group relative overflow-hidden rounded-[26px] border border-white/8 bg-gradient-to-br ${collection.gradient} p-7 transition hover:-translate-y-1 hover:border-white/15`}>
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/15 text-white"><Icon size={22} /></span>
                    <ArrowUpRight className="text-slate-600 transition group-hover:text-white" size={19} />
                  </div>
                  <h3 className="mt-8 text-xl font-extrabold">{collection.title}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{collection.description}</p>
                  <div className="mt-6 space-y-2">
                    {collection.apps.map((app) => <div key={app} className="flex items-center gap-2 text-sm text-slate-300"><ChevronRight size={14} className="text-cyan-300" />{app}</div>)}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Danh mục</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.035em]">Bắt đầu từ lĩnh vực của bạn.</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-500">Danh sách đầu tiên tập trung vào các nhu cầu video phổ biến nhất của seller, chuyên gia và doanh nghiệp.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, index) => (
            <Link href="/apps" key={industry.name} className={`group relative min-h-52 overflow-hidden rounded-[24px] border border-white/8 bg-gradient-to-br ${industry.gradient} p-6 transition hover:-translate-y-1 hover:border-white/15`}>
              <div className="absolute -bottom-12 -right-10 h-40 w-40 rounded-full border border-white/8 bg-white/[.025]" />
              <span className="text-xs font-bold text-slate-500">0{index + 1}</span>
              <h3 className="mt-16 text-xl font-extrabold">{industry.name}</h3>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{industry.count}</span><ArrowRight size={16} className="transition group-hover:translate-x-1 group-hover:text-white" /></div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

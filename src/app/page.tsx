import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronRight,
  CirclePlay,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AppCard } from "@/components/apps/app-card";
import { appCatalog, appCategories, appCollections } from "@/lib/app-catalog";

const industries = [
  { name: "Mỹ phẩm & làm đẹp", count: "18 apps & templates", gradient: "from-pink-500/30 to-orange-400/5" },
  { name: "Thời trang", count: "14 apps & templates", gradient: "from-violet-500/30 to-indigo-400/5" },
  { name: "TikTok Shop", count: "22 apps & templates", gradient: "from-cyan-500/25 to-blue-500/5" },
  { name: "Gia dụng", count: "11 apps & templates", gradient: "from-emerald-500/20 to-cyan-500/5" },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <MarketingHeader />

      <section className="relative border-b border-white/6">
        <div className="subtle-grid absolute inset-0" />
        <div className="ambient-orb -left-32 top-16 h-72 w-72 bg-violet-600/20" />
        <div className="ambient-orb -right-20 top-24 h-80 w-80 bg-cyan-500/10" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
          <div>
            <div className="pill border-violet-300/15 bg-violet-500/8 text-violet-100">
              <Sparkles size={14} /> AI Creative Apps for Commerce
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-.045em] sm:text-6xl lg:text-[72px]">
              Mỗi nhu cầu bán hàng,
              <span className="gradient-text block">một ứng dụng AI chuyên biệt.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Một không gian duy nhất để tạo hình ảnh sản phẩm, nội dung quảng cáo, video social và tài sản thương hiệu — dành cho seller, shop và agency.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/apps" className="btn-primary px-6 py-3.5">
                Khám phá ứng dụng <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="btn-secondary px-6 py-3.5">
                Mở Dashboard <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              {["12+ ứng dụng AI", "Tối ưu social commerce", "Dành cho seller Việt"].map((item) => (
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
                  <p className="text-sm font-bold">Creative App Center</p>
                  <p className="mt-1 text-xs text-slate-500">Chọn công cụ phù hợp với mục tiêu của bạn</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
              </div>

              <div className="relative mt-4 flex items-center rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-500">
                <Search size={17} className="mr-3" /> Tìm ứng dụng cho sản phẩm của bạn...
                <span className="ml-auto rounded-lg border border-white/8 bg-white/4 px-2 py-1 text-[10px]">⌘ K</span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {appCatalog.slice(0, 4).map((app, index) => {
                  const Icon = app.icon;
                  return (
                    <Link key={app.slug} href={app.href} className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${app.gradient} p-4 transition hover:-translate-y-1 hover:border-white/15`}>
                      <div className="flex items-start justify-between">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${app.iconStyle}`}><Icon size={19} /></span>
                        {index === 0 ? <span className="rounded-full bg-white/8 px-2 py-1 text-[9px] font-bold text-white">POPULAR</span> : null}
                      </div>
                      <p className="mt-5 text-sm font-bold">{app.name}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{app.tags.slice(0, 2).join(" · ")}</p>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
                <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500"><WandSparkles size={18} /></span>
                    <div><p className="text-sm font-bold">12 công cụ sẵn sàng</p><p className="mt-1 text-[11px] text-slate-500">Ảnh · Video · Script · Brand</p></div>
                  </div>
                </div>
                <Link href="/apps" className="grid w-14 place-items-center rounded-2xl border border-white/8 bg-white/[.035] text-slate-400 transition hover:bg-white/8 hover:text-white">
                  <ArrowUpRight size={19} />
                </Link>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-6 hidden rounded-2xl border border-white/10 bg-[#111827]/90 p-3 shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-200"><CirclePlay size={19} /></span>
              <div><p className="text-xs font-bold">Social-ready output</p><p className="mt-1 text-[10px] text-slate-500">TikTok · Reels · Shorts</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Featured apps</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.035em] sm:text-5xl">Bộ công cụ sáng tạo cho mọi chiến dịch.</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">Chọn đúng ứng dụng cho từng công việc. Mỗi app được thiết kế tập trung, dễ dùng và tối ưu cho nội dung thương mại.</p>
          </div>
          <Link href="/apps" className="btn-secondary self-start lg:self-auto">Xem tất cả ứng dụng <ArrowRight size={17} /></Link>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar">
          {appCategories.map((category, index) => (
            <span key={category} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${index === 0 ? "border-violet-300/25 bg-violet-500/12 text-white" : "border-white/8 bg-white/[.025] text-slate-500"}`}>
              {category}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {appCatalog.slice(0, 8).map((app) => <AppCard key={app.slug} app={app} compact />)}
        </div>
      </section>

      <section id="collections" className="border-y border-white/7 bg-white/[.012] py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-violet-300">App collections</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.035em] sm:text-5xl">Bộ giải pháp theo cách bạn kinh doanh.</h2>
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
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Theo ngành hàng</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.035em]">Bắt đầu từ lĩnh vực của bạn.</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-500">Các ứng dụng và template được sắp xếp theo ngành để đội ngũ của bạn tìm đúng công cụ nhanh hơn.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, index) => (
            <Link href="/apps" key={industry.name} className={`group relative min-h-52 overflow-hidden rounded-[24px] border border-white/8 bg-gradient-to-br ${industry.gradient} p-6 transition hover:-translate-y-1 hover:border-white/15`}>
              <div className="absolute -bottom-12 -right-10 h-40 w-40 rounded-full border border-white/8 bg-white/[.025]" />
              <span className="text-xs font-bold text-slate-500">0{index + 1}</span>
              <h3 className="mt-16 text-xl font-extrabold">{industry.name}</h3>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{industry.count}</span><ArrowRight size={16} className="transition group-hover:translate-x-1 group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-600/22 via-indigo-500/10 to-cyan-500/10 px-7 py-14 text-center sm:px-12 sm:py-16">
          <div className="ambient-orb left-1/2 top-0 h-52 w-52 -translate-x-1/2 bg-violet-500/20" />
          <div className="relative">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/8 text-violet-100"><Boxes size={25} /></span>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black tracking-[-.035em] sm:text-5xl">Một hệ sinh thái AI cho toàn bộ nội dung bán hàng.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">Khám phá các ứng dụng phù hợp và xây dựng bộ công cụ sáng tạo riêng cho shop hoặc agency của bạn.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/apps" className="btn-primary px-6 py-3.5">Khám phá tất cả Apps <ArrowRight size={18} /></Link>
              <Link href="/dashboard" className="btn-secondary px-6 py-3.5">Vào Dashboard</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

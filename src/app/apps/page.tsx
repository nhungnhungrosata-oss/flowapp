import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AppCard } from "@/components/apps/app-card";
import { appCatalog, appCategories, appCollections } from "@/lib/app-catalog";

export default function AppsPage() {
  return (
    <main>
      <MarketingHeader />

      <section className="relative overflow-hidden border-b border-white/7 py-20 sm:py-24">
        <div className="subtle-grid absolute inset-0" />
        <div className="ambient-orb left-1/4 top-0 h-72 w-72 bg-violet-600/15" />
        <div className="relative mx-auto max-w-7xl px-5 text-center">
          <div className="pill border-violet-300/15 bg-violet-500/8 text-violet-100"><Sparkles size={14} /> AI App Marketplace</div>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black tracking-[-.045em] sm:text-6xl">Tất cả ứng dụng AI cho nội dung thương mại.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">Khám phá công cụ dành cho hình ảnh sản phẩm, video quảng cáo, kịch bản bán hàng và quản lý thương hiệu.</p>

          <div className="mx-auto mt-9 flex max-w-2xl items-center rounded-2xl border border-white/10 bg-white/[.035] p-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <Search className="ml-3 text-slate-500" size={19} />
            <input className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600" placeholder="Tìm app theo nhu cầu, ngành hàng hoặc đầu ra..." />
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/5 text-slate-400"><SlidersHorizontal size={17} /></button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col gap-6 border-b border-white/7 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar">
            {appCategories.map((category, index) => (
              <button key={category} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium ${index === 0 ? "border-violet-300/25 bg-violet-500/12 text-white" : "border-white/8 bg-white/[.025] text-slate-500 hover:text-white"}`}>
                {category}
              </button>
            ))}
          </div>
          <p className="shrink-0 text-sm text-slate-500"><span className="font-bold text-white">{appCatalog.length}</span> ứng dụng có sẵn</p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {appCatalog.map((app) => <AppCard key={app.slug} app={app} />)}
        </div>
      </section>

      <section id="collections" className="border-y border-white/7 bg-white/[.012] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Curated collections</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-.035em]">Bộ ứng dụng được thiết kế để làm việc cùng nhau.</h2>
            </div>
            <Link href="/dashboard" className="btn-secondary self-start md:self-auto">Mở Dashboard <ArrowRight size={17} /></Link>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {appCollections.map((collection) => {
              const Icon = collection.icon;
              return (
                <div key={collection.title} className={`rounded-[26px] border border-white/8 bg-gradient-to-br ${collection.gradient} p-7`}>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/15"><Icon size={22} /></span>
                  <h3 className="mt-7 text-xl font-extrabold">{collection.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{collection.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {collection.apps.map((app) => <span key={app} className="rounded-full border border-white/8 bg-white/[.035] px-3 py-1.5 text-xs text-slate-300">{app}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

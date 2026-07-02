import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { appCatalog } from "@/lib/app-catalog";

export function generateStaticParams() {
  return appCatalog.map((app) => ({ slug: app.slug }));
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = appCatalog.find((item) => item.slug === slug);

  if (!app) notFound();

  const Icon = app.icon;

  return (
    <main>
      <MarketingHeader />
      <section className="relative min-h-[720px] overflow-hidden border-b border-white/7">
        <div className="subtle-grid absolute inset-0" />
        <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient}`} />
        <div className="ambient-orb -left-24 top-24 h-72 w-72 bg-violet-600/15" />

        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <Link href="/apps" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white">
            <ArrowLeft size={16} /> Quay lại tất cả ứng dụng
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_.82fr] lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <span className={`grid h-16 w-16 place-items-center rounded-[22px] ring-1 ${app.iconStyle}`}>
                  <Icon size={30} strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-500">{app.category}</p>
                  {app.badge ? <span className="mt-2 inline-flex rounded-full border border-white/9 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300">{app.badge}</span> : null}
                </div>
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-[-.045em] sm:text-6xl">{app.name}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">{app.description}</p>

              <div className="mt-7 flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/8 bg-white/[.035] px-3 py-1.5 text-xs text-slate-300">{tag}</span>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <span className="btn-primary px-6 py-3.5 opacity-75">
                  <Sparkles size={18} /> Đang hoàn thiện ứng dụng
                </span>
                <Link href="/dashboard" className="btn-secondary px-6 py-3.5">Mở Dashboard <ArrowRight size={17} /></Link>
              </div>
            </div>

            <div className="glass relative overflow-hidden rounded-[30px] p-6 sm:p-8">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/7 bg-white/[.025]" />
              <div className="relative">
                <div className="flex items-center justify-between border-b border-white/7 pb-5">
                  <div><p className="text-sm font-bold">App Workspace</p><p className="mt-1 text-xs text-slate-500">Giao diện chi tiết sẽ được xây ở bước tiếp theo</p></div>
                  <span className="rounded-full border border-amber-300/15 bg-amber-400/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-amber-100">Coming next</span>
                </div>

                <div className="mt-6 space-y-3">
                  {["Giao diện riêng theo đúng ngành", "Quy trình tạo video chuyên biệt", "Template và prompt dành riêng cho app", "Kết nối API tạo nội dung ở backend"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/7 bg-black/12 p-4 text-sm text-slate-300">
                      <CheckCircle2 size={17} className="shrink-0 text-emerald-300" /> {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-violet-300/15 bg-violet-500/8 p-5">
                  <p className="text-sm font-bold text-violet-100">Ứng dụng đã được tạo trong catalog</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Ở giai đoạn này, app có trang riêng và nhận diện riêng. Chức năng tạo video sẽ được triển khai lần lượt trong từng app con.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

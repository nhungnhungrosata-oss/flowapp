import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AppDefinition } from "@/lib/app-catalog";

const badgeStyles: Record<NonNullable<AppDefinition["badge"]>, string> = {
  "Phổ biến": "border-violet-300/20 bg-violet-400/10 text-violet-100",
  "Mới": "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
  "Pro": "border-amber-300/20 bg-amber-400/10 text-amber-100",
};

export function AppCard({ app, compact = false }: { app: AppDefinition; compact?: boolean }) {
  const Icon = app.icon;

  return (
    <Link
      href={app.href}
      className={`app-card group relative overflow-hidden ${compact ? "p-5" : "p-6"}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-80`} />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/5 bg-white/[.025] transition duration-500 group-hover:scale-125" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <span className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${app.iconStyle}`}>
            <Icon size={23} strokeWidth={1.8} />
          </span>
          <div className="flex items-center gap-2">
            {app.badge ? (
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${badgeStyles[app.badge]}`}>
                {app.badge}
              </span>
            ) : null}
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/8 bg-black/10 text-slate-500 transition duration-300 group-hover:border-white/15 group-hover:bg-white/8 group-hover:text-white">
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>

        <div className={compact ? "mt-5" : "mt-7"}>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">{app.category}</p>
          <h3 className="mt-2 text-lg font-extrabold tracking-tight text-white">{app.name}</h3>
          <p className={`mt-2 text-sm leading-6 text-slate-400 ${compact ? "line-clamp-2" : "min-h-12"}`}>
            {app.description}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {app.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/7 bg-white/[.035] px-2.5 py-1 text-[11px] font-medium text-slate-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

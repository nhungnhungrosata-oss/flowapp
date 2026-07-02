import Link from "next/link";
import {
  AppWindow,
  Boxes,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Palette,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

const nav = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/studio", label: "Ứng dụng AI", icon: AppWindow },
  { href: "/projects", label: "Dự án", icon: FolderKanban },
  { href: "/library", label: "Thư viện", icon: Boxes },
  { href: "/brand-kit", label: "Brand Kit", icon: Palette },
  { href: "/billing", label: "Gói & Credit", icon: CreditCard },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/7 bg-[#080c15]/96 p-4 lg:block">
      <div className="px-2 py-2"><Logo /></div>
      <Link href="/studio" className="btn-primary mt-6 w-full"><Sparkles size={17} /> Khám phá Apps</Link>
      <nav className="mt-6 space-y-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
            <item.icon size={18} />{item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <Link href="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-white/5 hover:text-white"><Shield size={18} /> Admin</Link>
        <Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-white/5 hover:text-white"><Settings size={18} /> Cài đặt</Link>
        <div className="mt-3 rounded-2xl border border-violet-400/20 bg-violet-500/8 p-4">
          <div className="flex items-center justify-between text-xs"><span className="font-bold text-violet-200">PRO PLAN</span><span>680 / 1.200</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full w-[57%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" /></div>
          <p className="mt-2 text-[11px] text-slate-500">Reset sau 18 ngày</p>
        </div>
      </div>
    </aside>
  );
}

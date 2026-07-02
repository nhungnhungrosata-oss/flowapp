import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070a12]/78 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
          <Link className="transition hover:text-white" href="/apps">Ứng dụng</Link>
          <Link className="transition hover:text-white" href="/apps#collections">Bộ giải pháp</Link>
          <Link className="transition hover:text-white" href="/pricing">Bảng giá</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link className="btn-secondary hidden sm:inline-flex" href="/dashboard">Đăng nhập</Link>
          <Link className="btn-primary" href="/apps">
            Khám phá Apps <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
}

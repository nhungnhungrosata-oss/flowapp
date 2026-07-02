import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/7 bg-black/10 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.3fr_.7fr_.7fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Hệ sinh thái ứng dụng AI dành cho seller, thương hiệu và agency sáng tạo nội dung thương mại.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-600">Sản phẩm</p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <Link className="block hover:text-white" href="/apps">Tất cả ứng dụng</Link>
            <Link className="block hover:text-white" href="/apps#collections">Bộ giải pháp</Link>
            <Link className="block hover:text-white" href="/pricing">Bảng giá</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-600">Tài khoản</p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <Link className="block hover:text-white" href="/dashboard">Dashboard</Link>
            <Link className="block hover:text-white" href="/library">Thư viện</Link>
            <Link className="block hover:text-white" href="/brand-kit">Brand Kit</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/7 px-5 pt-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 AdForge AI. All rights reserved.</p>
        <div className="flex gap-5"><span>Điều khoản</span><span>Bảo mật</span><span>Hỗ trợ</span></div>
      </div>
    </footer>
  );
}

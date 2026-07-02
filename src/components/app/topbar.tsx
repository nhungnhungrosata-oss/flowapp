import { Bell, ChevronDown, Command, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/7 bg-[#070a12]/82 px-5 backdrop-blur-2xl lg:px-8">
      <div className="relative hidden w-full max-w-md md:block">
        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
        <input className="input py-2 pl-10 pr-16" placeholder="Tìm ứng dụng, dự án, tài nguyên..." />
        <span className="absolute right-2.5 top-2 flex items-center gap-1 rounded-lg border border-white/8 bg-white/4 px-2 py-1 text-[10px] text-slate-500"><Command size={11} /> K</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button aria-label="Thông báo" className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/3 text-slate-400 transition hover:bg-white/7 hover:text-white"><Bell size={18} /></button>
        <button className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3 py-2 transition hover:bg-white/7">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-black">DS</span>
          <span className="hidden text-sm font-semibold sm:block">Demo Shop</span>
          <ChevronDown size={15} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}

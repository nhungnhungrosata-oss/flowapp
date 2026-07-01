import Link from "next/link";
import { Sparkles } from "lucide-react";
export function Logo({ compact=false }: { compact?: boolean }) { return <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-950/40"><Sparkles size={20}/></span>{!compact&&<span className="text-lg font-extrabold tracking-tight">AdForge<span className="text-cyan-300"> AI</span></span>}</Link>; }

import { Sidebar } from "@/components/app/sidebar";import { Topbar } from "@/components/app/topbar";
export default function AppLayout({children}:{children:React.ReactNode}){return <div className="min-h-screen"><Sidebar/><div className="lg:pl-64"><Topbar/><main className="p-5 lg:p-8">{children}</main></div></div>}

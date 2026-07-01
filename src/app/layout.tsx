import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "AdForge AI — Video quảng cáo từ ảnh sản phẩm", description: "SaaS tạo video quảng cáo AI cho TikTok, Reels và Shorts." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi"><body>{children}</body></html>; }

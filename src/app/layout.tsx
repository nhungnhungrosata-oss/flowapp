import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdForge AI — Hệ sinh thái ứng dụng AI cho bán hàng",
  description: "Khám phá các ứng dụng AI tạo ảnh sản phẩm, video quảng cáo, kịch bản bán hàng và tài sản thương hiệu.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}

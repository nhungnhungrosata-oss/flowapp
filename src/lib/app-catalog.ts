import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Boxes,
  Captions,
  Clapperboard,
  Expand,
  Images,
  Layers3,
  MessageSquareText,
  Palette,
  ScanFace,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export type AppCategory =
  | "Tất cả"
  | "Ảnh sản phẩm"
  | "Video quảng cáo"
  | "Nội dung bán hàng"
  | "Thương hiệu";

export type AppDefinition = {
  slug: string;
  name: string;
  description: string;
  category: Exclude<AppCategory, "Tất cả">;
  icon: LucideIcon;
  href: string;
  badge?: "Phổ biến" | "Mới" | "Pro";
  tags: string[];
  gradient: string;
  iconStyle: string;
};

export const appCategories: AppCategory[] = [
  "Tất cả",
  "Ảnh sản phẩm",
  "Video quảng cáo",
  "Nội dung bán hàng",
  "Thương hiệu",
];

export const appCatalog: AppDefinition[] = [
  {
    slug: "product-to-model",
    name: "Product to Model",
    description: "Đặt sản phẩm vào tay người mẫu AI với bố cục tự nhiên và hình ảnh thương mại cao cấp.",
    category: "Ảnh sản phẩm",
    icon: ScanFace,
    href: "/projects/new",
    badge: "Phổ biến",
    tags: ["Beauty", "Fashion", "Image"],
    gradient: "from-fuchsia-500/30 via-violet-500/15 to-transparent",
    iconStyle: "bg-fuchsia-400/15 text-fuchsia-200 ring-fuchsia-300/20",
  },
  {
    slug: "ai-scene-creator",
    name: "AI Scene Creator",
    description: "Tạo ảnh sản phẩm trong studio, lifestyle, phòng tắm, bàn trang điểm hoặc bối cảnh bán hàng.",
    category: "Ảnh sản phẩm",
    icon: Images,
    href: "/projects/new",
    badge: "Mới",
    tags: ["Studio", "Lifestyle", "Image"],
    gradient: "from-cyan-500/25 via-blue-500/15 to-transparent",
    iconStyle: "bg-cyan-400/15 text-cyan-200 ring-cyan-300/20",
  },
  {
    slug: "ai-ad-video",
    name: "AI Ad Video",
    description: "Biến ảnh sản phẩm thành video quảng cáo dọc dành cho TikTok, Reels và Shorts.",
    category: "Video quảng cáo",
    icon: Clapperboard,
    href: "/projects/new",
    badge: "Phổ biến",
    tags: ["TikTok", "Reels", "Video"],
    gradient: "from-violet-500/30 via-indigo-500/15 to-transparent",
    iconStyle: "bg-violet-400/15 text-violet-200 ring-violet-300/20",
  },
  {
    slug: "ugc-ad-maker",
    name: "UGC Ad Maker",
    description: "Tạo concept quảng cáo theo phong cách creator, review thật, unbox và trải nghiệm sản phẩm.",
    category: "Video quảng cáo",
    icon: ShoppingBag,
    href: "/projects/new",
    badge: "Pro",
    tags: ["UGC", "Review", "Video"],
    gradient: "from-orange-500/25 via-rose-500/15 to-transparent",
    iconStyle: "bg-orange-400/15 text-orange-200 ring-orange-300/20",
  },
  {
    slug: "script-writer",
    name: "AI Script Writer",
    description: "Tạo hook, kịch bản ngắn, CTA và caption bán hàng theo sản phẩm và nền tảng.",
    category: "Nội dung bán hàng",
    icon: MessageSquareText,
    href: "/projects/new",
    badge: "Mới",
    tags: ["Script", "Hook", "Caption"],
    gradient: "from-emerald-500/25 via-cyan-500/10 to-transparent",
    iconStyle: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20",
  },
  {
    slug: "voice-studio",
    name: "Voice Studio",
    description: "Tạo giọng đọc quảng cáo rõ ràng, giàu cảm xúc và phù hợp phong cách thương hiệu.",
    category: "Nội dung bán hàng",
    icon: AudioLines,
    href: "/projects/new",
    badge: "Pro",
    tags: ["Voice", "Audio", "Vietnamese"],
    gradient: "from-sky-500/25 via-indigo-500/10 to-transparent",
    iconStyle: "bg-sky-400/15 text-sky-200 ring-sky-300/20",
  },
  {
    slug: "subtitle-maker",
    name: "Subtitle Maker",
    description: "Tạo subtitle, text overlay và caption nổi bật cho video bán hàng dạng ngắn.",
    category: "Nội dung bán hàng",
    icon: Captions,
    href: "/projects/new",
    tags: ["Subtitle", "Caption", "Social"],
    gradient: "from-amber-500/25 via-orange-500/10 to-transparent",
    iconStyle: "bg-amber-400/15 text-amber-100 ring-amber-300/20",
  },
  {
    slug: "brand-kit",
    name: "Brand Kit Studio",
    description: "Quản lý logo, màu sắc, giọng điệu và quy chuẩn để mọi nội dung luôn đồng nhất.",
    category: "Thương hiệu",
    icon: Palette,
    href: "/brand-kit",
    tags: ["Logo", "Colors", "Brand"],
    gradient: "from-pink-500/25 via-purple-500/10 to-transparent",
    iconStyle: "bg-pink-400/15 text-pink-200 ring-pink-300/20",
  },
  {
    slug: "asset-library",
    name: "Creative Library",
    description: "Lưu trữ và quản lý toàn bộ ảnh sản phẩm, video, voice và tài nguyên sáng tạo.",
    category: "Thương hiệu",
    icon: Boxes,
    href: "/library",
    tags: ["Library", "Assets", "Cloud"],
    gradient: "from-slate-400/20 via-blue-500/10 to-transparent",
    iconStyle: "bg-slate-300/10 text-slate-200 ring-slate-300/15",
  },
  {
    slug: "campaign-templates",
    name: "Campaign Templates",
    description: "Bộ mẫu chiến dịch theo ngành hàng dành cho mỹ phẩm, thời trang và TikTok Shop.",
    category: "Thương hiệu",
    icon: Layers3,
    href: "/projects/new",
    badge: "Mới",
    tags: ["Templates", "Campaign", "Commerce"],
    gradient: "from-purple-500/25 via-fuchsia-500/10 to-transparent",
    iconStyle: "bg-purple-400/15 text-purple-200 ring-purple-300/20",
  },
  {
    slug: "social-resize",
    name: "Social Resize",
    description: "Chuyển đổi nhanh nội dung sang tỷ lệ phù hợp TikTok, Reels, Shorts và sàn thương mại.",
    category: "Video quảng cáo",
    icon: Expand,
    href: "/library",
    tags: ["9:16", "1:1", "Resize"],
    gradient: "from-blue-500/25 via-cyan-500/10 to-transparent",
    iconStyle: "bg-blue-400/15 text-blue-200 ring-blue-300/20",
  },
  {
    slug: "creative-bundle",
    name: "Creative Bundle",
    description: "Tạo đồng thời ảnh chính, video ngắn, caption và tài nguyên cho một chiến dịch bán hàng.",
    category: "Thương hiệu",
    icon: Sparkles,
    href: "/projects/new",
    badge: "Pro",
    tags: ["Bundle", "Launch", "Campaign"],
    gradient: "from-indigo-500/30 via-violet-500/10 to-transparent",
    iconStyle: "bg-indigo-400/15 text-indigo-200 ring-indigo-300/20",
  },
];

export const appCollections = [
  {
    title: "TikTok Seller Kit",
    description: "Bộ ứng dụng giúp seller tạo nội dung bán hàng đều đặn mỗi ngày.",
    apps: ["AI Script Writer", "UGC Ad Maker", "Subtitle Maker"],
    icon: ShoppingBag,
    gradient: "from-violet-500/25 to-cyan-500/5",
  },
  {
    title: "Beauty Brand Suite",
    description: "Tạo hình ảnh cao cấp, video review và nhận diện nhất quán cho thương hiệu mỹ phẩm.",
    apps: ["Product to Model", "AI Scene Creator", "Brand Kit Studio"],
    icon: Sparkles,
    gradient: "from-pink-500/25 to-orange-500/5",
  },
  {
    title: "Creative Agency Pack",
    description: "Quản lý nhiều tài sản và sản xuất nhanh bộ nội dung hoàn chỉnh cho khách hàng.",
    apps: ["Creative Bundle", "Campaign Templates", "Creative Library"],
    icon: Layers3,
    gradient: "from-cyan-500/20 to-blue-500/5",
  },
] as const;

import type { LucideIcon } from "lucide-react";
import {
  Box,
  BriefcaseBusiness,
  Building2,
  Hotel,
  Lightbulb,
  MapPin,
  Package,
  Shirt,
  Sparkles,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

export type AppCategory =
  | "Tất cả"
  | "Sản phẩm & 3D"
  | "Thương hiệu & Kiến thức"
  | "BĐS & Dịch vụ"
  | "Thời trang & Làm đẹp"
  | "Doanh nghiệp";

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
  "Sản phẩm & 3D",
  "Thương hiệu & Kiến thức",
  "BĐS & Dịch vụ",
  "Thời trang & Làm đẹp",
  "Doanh nghiệp",
];

export const appCatalog: AppDefinition[] = [
  {
    slug: "video-3d",
    name: "Tạo Video 3D",
    description: "Biến sản phẩm thành video 3D nổi bật với chuyển động camera, ánh sáng và không gian hiện đại.",
    category: "Sản phẩm & 3D",
    icon: Box,
    href: "/apps/video-3d",
    badge: "Mới",
    tags: ["3D", "Product", "Cinematic"],
    gradient: "from-violet-500/30 via-indigo-500/15 to-transparent",
    iconStyle: "bg-violet-400/15 text-violet-200 ring-violet-300/20",
  },
  {
    slug: "video-nhan-hieu",
    name: "Tạo Video Nhân Hiệu",
    description: "Xây dựng hình ảnh chuyên gia, nhà sáng lập hoặc thương hiệu cá nhân bằng video kể chuyện chuyên nghiệp.",
    category: "Thương hiệu & Kiến thức",
    icon: UserRound,
    href: "/apps/video-nhan-hieu",
    badge: "Phổ biến",
    tags: ["Personal Brand", "Founder", "Story"],
    gradient: "from-cyan-500/25 via-blue-500/15 to-transparent",
    iconStyle: "bg-cyan-400/15 text-cyan-200 ring-cyan-300/20",
  },
  {
    slug: "video-bat-dong-san",
    name: "Tạo Video Giới Thiệu BĐS",
    description: "Trình bày căn hộ, nhà phố, đất nền và dự án bất động sản bằng video sang trọng, rõ thông tin.",
    category: "BĐS & Dịch vụ",
    icon: Building2,
    href: "/apps/video-bat-dong-san",
    badge: "Phổ biến",
    tags: ["BĐS", "Property", "Project"],
    gradient: "from-amber-500/25 via-orange-500/12 to-transparent",
    iconStyle: "bg-amber-400/15 text-amber-100 ring-amber-300/20",
  },
  {
    slug: "video-meo-vat",
    name: "Tạo Video Chia Sẻ Mẹo Vặt",
    description: "Tạo video ngắn chia sẻ mẹo hữu ích, kiến thức đời sống và nội dung dễ xem, dễ lưu, dễ chia sẻ.",
    category: "Thương hiệu & Kiến thức",
    icon: Lightbulb,
    href: "/apps/video-meo-vat",
    badge: "Mới",
    tags: ["Tips", "How-to", "Shorts"],
    gradient: "from-emerald-500/25 via-cyan-500/10 to-transparent",
    iconStyle: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20",
  },
  {
    slug: "video-gioi-thieu-san-pham",
    name: "Tạo Video Giới Thiệu Sản Phẩm",
    description: "Tạo video quảng cáo sản phẩm với điểm nổi bật, lợi ích, tình huống sử dụng và lời kêu gọi mua hàng.",
    category: "Sản phẩm & 3D",
    icon: Package,
    href: "/apps/video-gioi-thieu-san-pham",
    badge: "Phổ biến",
    tags: ["Product", "Ads", "TikTok Shop"],
    gradient: "from-fuchsia-500/30 via-rose-500/12 to-transparent",
    iconStyle: "bg-fuchsia-400/15 text-fuchsia-200 ring-fuchsia-300/20",
  },
  {
    slug: "video-thoi-trang",
    name: "Tạo Video Giới Thiệu Thời Trang",
    description: "Tạo video lookbook, phối đồ, giới thiệu bộ sưu tập và quảng bá sản phẩm thời trang theo xu hướng.",
    category: "Thời trang & Làm đẹp",
    icon: Shirt,
    href: "/apps/video-thoi-trang",
    badge: "Pro",
    tags: ["Fashion", "Lookbook", "Model"],
    gradient: "from-pink-500/30 via-purple-500/12 to-transparent",
    iconStyle: "bg-pink-400/15 text-pink-200 ring-pink-300/20",
  },
  {
    slug: "video-my-pham",
    name: "Tạo Video Quảng Cáo Mỹ Phẩm",
    description: "Tạo video beauty cao cấp cho serum, son, kem dưỡng và sản phẩm chăm sóc cá nhân.",
    category: "Thời trang & Làm đẹp",
    icon: Sparkles,
    href: "/apps/video-my-pham",
    badge: "Pro",
    tags: ["Beauty", "Skincare", "Cosmetics"],
    gradient: "from-rose-500/28 via-orange-400/10 to-transparent",
    iconStyle: "bg-rose-400/15 text-rose-200 ring-rose-300/20",
  },
  {
    slug: "video-am-thuc",
    name: "Tạo Video Nhà Hàng & Ẩm Thực",
    description: "Giới thiệu món ăn, thực đơn, không gian quán và chương trình ưu đãi bằng video hấp dẫn vị giác.",
    category: "BĐS & Dịch vụ",
    icon: UtensilsCrossed,
    href: "/apps/video-am-thuc",
    tags: ["Food", "Restaurant", "Menu"],
    gradient: "from-orange-500/28 via-amber-500/10 to-transparent",
    iconStyle: "bg-orange-400/15 text-orange-200 ring-orange-300/20",
  },
  {
    slug: "video-du-lich-khach-san",
    name: "Tạo Video Du Lịch & Khách Sạn",
    description: "Quảng bá điểm đến, tour, resort và khách sạn bằng video giàu cảm xúc, phù hợp mạng xã hội.",
    category: "BĐS & Dịch vụ",
    icon: Hotel,
    href: "/apps/video-du-lich-khach-san",
    badge: "Mới",
    tags: ["Travel", "Hotel", "Resort"],
    gradient: "from-sky-500/28 via-cyan-500/10 to-transparent",
    iconStyle: "bg-sky-400/15 text-sky-200 ring-sky-300/20",
  },
  {
    slug: "video-doanh-nghiep-tuyen-dung",
    name: "Tạo Video Doanh Nghiệp & Tuyển Dụng",
    description: "Giới thiệu công ty, văn hóa, dịch vụ và vị trí tuyển dụng bằng video chuyên nghiệp, đáng tin cậy.",
    category: "Doanh nghiệp",
    icon: BriefcaseBusiness,
    href: "/apps/video-doanh-nghiep-tuyen-dung",
    tags: ["Corporate", "Recruitment", "Employer"],
    gradient: "from-blue-500/28 via-indigo-500/10 to-transparent",
    iconStyle: "bg-blue-400/15 text-blue-200 ring-blue-300/20",
  },
];

export const appCollections = [
  {
    title: "Bộ Video Bán Hàng",
    description: "Nhóm ứng dụng dành cho shop, seller và thương hiệu cần giới thiệu sản phẩm chuyên nghiệp.",
    apps: ["Tạo Video 3D", "Tạo Video Giới Thiệu Sản Phẩm", "Tạo Video Quảng Cáo Mỹ Phẩm"],
    icon: Package,
    gradient: "from-violet-500/25 to-cyan-500/5",
  },
  {
    title: "Bộ Video Thương Hiệu",
    description: "Xây dựng hình ảnh cá nhân, doanh nghiệp và nội dung chia sẻ kiến thức nhất quán.",
    apps: ["Tạo Video Nhân Hiệu", "Tạo Video Chia Sẻ Mẹo Vặt", "Tạo Video Doanh Nghiệp & Tuyển Dụng"],
    icon: UserRound,
    gradient: "from-cyan-500/20 to-blue-500/5",
  },
  {
    title: "Bộ Video Dịch Vụ",
    description: "Quảng bá bất động sản, nhà hàng, điểm đến và không gian dịch vụ giàu cảm xúc.",
    apps: ["Tạo Video Giới Thiệu BĐS", "Tạo Video Nhà Hàng & Ẩm Thực", "Tạo Video Du Lịch & Khách Sạn"],
    icon: MapPin,
    gradient: "from-orange-500/20 to-pink-500/5",
  },
] as const;

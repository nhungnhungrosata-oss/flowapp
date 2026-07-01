# AdForge AI

SaaS tạo video quảng cáo AI từ ảnh sản phẩm, tối ưu cho TikTok, Reels và Shorts.

## Workflow cốt lõi

`Upload Product → Select AI Character → Select Scene → Generate Product Composite Image → Generate Video → Add Voice & Subtitle → Export`

## Bộ bàn giao

- PRD: `docs/PRD.md`
- Site map: `docs/SITE_MAP.md`
- UI layout: `docs/UI_SPEC.md`
- Database: `prisma/schema.prisma`
- API nội bộ: `docs/API_DESIGN.md` và `docs/internal-api.yaml`
- Folder structure: `docs/FOLDER_STRUCTURE.md`
- Frontend: `src/app` + `src/components`
- Backend architecture: `docs/ARCHITECTURE.md`
- MVP task list: `docs/MVP_TASKS.md`
- Code skeleton: toàn bộ repository này

## Chạy local

```bash
cp .env.example .env.local
docker compose up -d
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Chạy worker ở terminal thứ hai:

```bash
npm run worker
```

Mở `http://localhost:3000`.

## Biến môi trường bắt buộc

Để xem UI: `DATABASE_URL`, `USEAPI_WEBHOOK_SECRET`, `S3_BUCKET`.

Để generation thực tế: thêm `USEAPI_TOKEN`, cấu hình S3-compatible storage và chạy Redis worker. Token useapi.net chỉ được dùng ở server.

## Kiến trúc tóm tắt

- Next.js App Router: marketing, dashboard và route handlers.
- PostgreSQL/Prisma: workspace, project, generation, asset, credit, billing, audit.
- BullMQ/Redis: submit job, poll fallback, persist output.
- useapi.net adapter: images, videos, jobs, assets.
- S3 private bucket: file upload và output lâu dài.
- Stripe: subscription/credit packs.

## Lưu ý production

1. `src/lib/auth.ts` đang là development adapter có boundary rõ ràng. Thay bằng Auth.js/Clerk trước public launch.
2. Thêm media inspection/virus scan sau upload và trước khi đẩy sang provider.
3. useapi.net không được giả định có chữ ký webhook. Endpoint nhận webhook dùng secret khó đoán và luôn gọi lại `GET /jobs/{jobId}` để xác minh.
4. Provider URL có thể hết hạn; worker tải output về S3 ngay khi job hoàn tất.
5. Duration 15–30s cần orchestration nhiều shot + concatenate/extend. MVP đầu tiên nên ship clip 5–10s, sau đó mở multi-shot.

## Kiểm thử

```bash
npm run typecheck
npm test
npm run build
```

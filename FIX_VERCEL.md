# Vercel install fix

## Root cause

`package-lock.json` cũ chứa 268 URL `resolved` trỏ tới một npm registry nội bộ không thể truy cập từ Vercel.

## Changes

- Chuyển toàn bộ lockfile sang `https://registry.npmjs.org/`.
- Thêm `.npmrc` để bắt buộc dùng npm registry công khai.
- Khóa Node.js `20.x` và npm `10.9.2`.
- Thêm `vercel.json` với install command ổn định:
  `npm ci --ignore-scripts --no-audit --no-fund`.
- Prisma Client được generate trong `npm run build`.

## Vercel settings

- Framework Preset: Next.js
- Root Directory: thư mục chứa `package.json`
- Node.js Version: 20.x
- Install Command: để trống để dùng `vercel.json`, hoặc nhập đúng lệnh bên trên
- Build Command: để trống để dùng `vercel.json`, hoặc `npm run build`

Sau khi cập nhật repository, chọn **Redeploy** và bỏ chọn cache cũ hoặc dùng **Redeploy without cache**.

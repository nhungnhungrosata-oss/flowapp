# Google Flow API v1 — Tài liệu tổng hợp (useapi.net)

> Nguồn gốc: https://useapi.net/docs/api-google-flow-v1
> File spec đầy đủ (khuyên dùng để feed cho LLM khi code): https://useapi.net/assets/aibot/api-google-flow-v1.txt
> Postman collection: https://www.postman.com/useapinet/useapi-net/collection

## 1. Đây là gì?

Đây là API bên thứ ba (useapi.net) cho phép bạn **điều khiển tài khoản Google Flow của chính mình** (Google Labs) qua REST API, thay vì phải dùng Gemini API tính phí theo lượt gọi. Bạn trả một khoản subscription cố định cho useapi.net ($15/tháng) và dùng credit của gói Google AI cá nhân (Plus/Pro/Ultra) để generate.

**Chức năng chính:**
- Sinh video cinematic bằng **Veo 3.1** (fast/quality/lite) và **Gemini Omni Flash** (video có giọng nói, nhân vật, chỉnh sửa video-to-video)
- Sinh ảnh bằng **Imagen 4**, **Nano Banana**, **Nano Banana 2**, **Nano Banana Pro**
- Quản lý nhân vật (characters) và giọng nói (voices) tái sử dụng được
- Upscale, extend, ghép nối (concatenate), tạo GIF từ video

Sinh ảnh dùng được với **mọi gói Google AI kể cả tài khoản free**; sinh video **bắt buộc phải có gói trả phí** (Plus trở lên).

## 2. Xác thực (áp dụng cho mọi API của useapi.net)

```
Header: Authorization: Bearer user:<number>-<unique-string>
```
Dùng **toàn bộ token**, không cắt bớt, không URL-encode. Một token dùng chung cho mọi API trong subscription.

## 3. Danh sách Model

| Model id | Tên | Loại output |
|---|---|---|
| `veo-3.1-fast` / `veo-3.1-quality` / `veo-3.1-lite` | Veo 3.1 | Video — text-to-video & image-to-video |
| `omni-flash` | Gemini Omni Flash | Video có giọng nói, nhân vật, chỉnh sửa video-to-video, clip 10s |
| `imagen-4` | Imagen 4 | Ảnh |
| `nano-banana-2` | Nano Banana 2 / Gemini 3.1 Flash Image | Ảnh |
| `nano-banana-pro` | Nano Banana Pro / Gemini 3 Pro Image | Ảnh |

## 4. Bảng giá tham khảo (so với Gemini API chính thức)

| Model | Gemini API chính thức | useapi.net (Flow Pro) | useapi.net (Flow Ultra) |
|---|---|---|---|
| Veo 3.1 Fast — clip 8s | $0.80 | ~$0.40 | ~$0.10 |
| Veo 3.1 Quality — clip 8s | $3.20 | ~$2.00 | ~$1.00 |
| Veo 3.1 Lite — clip 8s | $0.40 | ~$0.20 | ~$0.05 |
| Gemini Omni Flash — clip 8s | — (chỉ có trên Flow) | ~$0.50 | ~$0.25 |
| Nano Banana Pro / ảnh | $0.134 | đã bao gồm | đã bao gồm |
| Imagen 4 / ảnh | tính theo lượt | đã bao gồm | đã bao gồm |

Hạn mức Flow credit hàng tháng theo gói Google AI:

| Gói | Giá | Credit/tháng |
|---|---|---|
| Plus | $7.99/mo | 200 |
| Pro | $9.99/mo (6 tháng đầu), sau đó $19.99/mo | 1,000 |
| Ultra $99 | $99.99/mo | 10,000 |
| Ultra $199 | $199.99/mo | 25,000 |

## 5. Captcha & tài khoản

- Sinh ảnh/video/giọng nói yêu cầu giải reCAPTCHA — useapi.net tự động xử lý.
- Tài khoản Google Flow đầu tiên được tặng **300 captcha credit miễn phí**.
- Sau đó cần cấu hình provider riêng qua `POST /accounts/captcha-providers` (chi phí ~$0.80–$3.00/1000 lượt giải). Các provider hỗ trợ: AntiCaptcha, EzCaptcha, CapSolver, YesCaptcha, SolveCaptcha, 2Captcha.
- Có thể cấu hình **tối đa 50 tài khoản Google Flow** trong một subscription useapi.net — hệ thống tự load-balancing giữa các account.

**Thiết lập tài khoản Google Flow:** cần dùng trình duyệt riêng (không dùng Chrome cá nhân), xoá hết cookie, đăng nhập Google Flow, rồi copy cookie phiên đăng nhập từ `accounts.google.com` để "add account" vào useapi.net. useapi.net cũng cung cấp form "Automated setup" tự động hoá bước này (xem trang Setup Google Flow).

## 6. Danh sách Endpoint đầy đủ

Base URL: `https://api.useapi.net/v1/google-flow/`

### Quản lý tài khoản
| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/accounts` | Thêm tài khoản Google Flow (qua cookie) |
| GET | `/accounts` | Liệt kê tất cả tài khoản đã cấu hình |
| GET | `/accounts/{email}` | Chi tiết 1 tài khoản: health, credit, model khả dụng |
| DELETE | `/accounts/{email}` | Xoá tài khoản |
| POST | `/accounts/captcha-providers` | Cấu hình API key provider giải captcha |
| GET | `/accounts/captcha-providers` | Xem provider đã cấu hình (key bị che) |
| GET | `/accounts/captcha-stats` | Thống kê tỉ lệ thành công giải captcha theo provider |

### Assets
| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/assets/{email}` | Upload asset (ảnh nguồn...) |
| GET | `/assets/{mediaGenerationId}` | Lấy asset đã sinh ra |

### Ảnh
| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/images` | Sinh ảnh (Imagen 4 / Nano Banana / Nano Banana Pro...) |
| POST | `/images/upscale` | Upscale ảnh |

### Video
| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/videos` | Sinh video (Veo 3.1 / Omni Flash) |
| POST | `/videos/upscale` | Upscale video |
| POST | `/videos/gif` | Xuất video sang GIF |
| POST | `/videos/extend` | Kéo dài video |
| POST | `/videos/concatenate` | Ghép nhiều video |

### Giọng nói (Voices)
| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/voices` | Tạo giọng nói tuỳ chỉnh (dựa trên 1 trong 30 giọng hệ thống) |
| GET | `/voices` | Liệt kê giọng (system + user) |
| GET | `/voices/{ref}` | Lấy 1 giọng kèm audioUrl phát thử |
| DELETE | `/voices/{ref}` | Xoá giọng tuỳ chỉnh |

### Nhân vật (Characters)
| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/characters` | Tạo nhân vật tái sử dụng (ảnh + giọng nói) |
| GET | `/characters` | Liệt kê nhân vật (nhanh, không resolve URL ảnh/audio) |
| GET | `/characters/{ref}` | Lấy 1 nhân vật kèm URL ảnh preview + audio giọng |
| DELETE | `/characters/{ref}` | Xoá nhân vật |

### Jobs (theo dõi tiến trình sinh nội dung)
| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/jobs` | Thống kê load-balancing giữa các tài khoản |
| GET | `/jobs/{jobId}` | Trạng thái + kết quả 1 job cụ thể |

## 7. Cơ chế Job & Polling

Mọi lệnh sinh ảnh/video trả về `jobid`. Có 2 cách lấy kết quả:

1. **Polling**: gọi `GET /jobs/{jobId}` định kỳ (vd mỗi 5 giây) cho tới khi `status` là `completed` hoặc `failed`.
2. **Webhook (async mode)**: truyền `async: true` và `replyUrl` trong request — useapi.net sẽ POST kết quả job về URL đó khi xong (kèm `replyRef` tuỳ chọn để bạn định danh request).

Trạng thái job: `created` → `started` → `completed` / `failed`.
Job được lưu giữ **7 ngày**, sau đó gọi lại sẽ nhận lỗi `410 Gone`.

Kết quả trả về:
- **Video**: `videoUrl` (mp4, hiệu lực ~24h), `thumbnailUrl`, `mediaGenerationId` (dùng để tham chiếu lại, ví dụ làm ảnh start/end cho video khác)
- **Ảnh**: `fifeUrl` (hiệu lực ~24h), `mediaGenerationId`

## 8. Load Balancing đa tài khoản

Nếu không truyền `email` cụ thể trong `POST /images` hoặc `POST /videos`, hệ thống tự chọn tài khoản tốt nhất theo 2 bước:

1. **Loại tài khoản đang bị quarantine** (do dính lỗi 429 quota/throttle gần đây)
2. **Chấm điểm** các tài khoản còn lại theo công thức:
   `score = executing + completed + (failed × 10) + (rateLimited × 20)` — điểm càng thấp càng ưu tiên.

Nếu tất cả tài khoản đều bị quarantine cho model yêu cầu → trả lỗi `429 no_eligible_account`.

## 9. Ví dụ nhanh — Sinh ảnh

```bash
curl -X POST https://api.useapi.net/v1/google-flow/images \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene mountain landscape at sunset",
    "model": "imagen-4",
    "aspectRatio": "landscape",
    "count": 2
  }'
```

```javascript
const res = await fetch('https://api.useapi.net/v1/google-flow/images', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A serene mountain landscape at sunset',
    model: 'imagen-4',
    aspectRatio: 'landscape',
    count: 2
  })
});
const { jobid } = await res.json();

// Poll job
async function waitJob(jobid) {
  while (true) {
    const r = await fetch(`https://api.useapi.net/v1/google-flow/jobs/${jobid}`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    const job = await r.json();
    if (job.status === 'completed') return job;
    if (job.status === 'failed') throw new Error(job.error);
    await new Promise(r => setTimeout(r, 5000));
  }
}
```

## 10. Ví dụ nhanh — Sinh video (async + webhook)

```javascript
await fetch('https://api.useapi.net/v1/google-flow/videos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A serene mountain landscape at sunset, camera slowly panning right',
    model: 'veo-3.1-fast',
    aspectRatio: 'landscape',
    count: 1,
    async: true,
    replyUrl: 'https://your-domain.com/webhook',
    replyRef: 'order-123'
  })
});
// Server của bạn nhận POST tại /webhook khi job xong, đối chiếu qua replyRef
```

## 11. Gợi ý kiến trúc tích hợp cho app/web

1. **Backend (bắt buộc)** — không gọi API này trực tiếp từ frontend vì cần giấu token. Tạo 1 lớp service (Node/Python) bọc các endpoint: `generateImage()`, `generateVideo()`, `getJobStatus()`.
2. **Hàng đợi job** — vì sinh video có thể mất vài phút, nên dùng model async + webhook thay vì để client chờ (polling từ backend cũng được nếu là app nội bộ nhỏ).
3. **Lưu trữ file** — `videoUrl`/`fifeUrl` chỉ có hiệu lực ~24h, nên tải về lưu trữ (S3, Cloud Storage...) ngay khi job hoàn tất nếu cần giữ lâu dài.
4. **Đa tài khoản** — nếu app có traffic lớn, cấu hình nhiều tài khoản Google Flow (tối đa 50) và để hệ thống tự load-balance, hoặc chỉ định `email` cụ thể nếu muốn cố định theo user/gói dịch vụ.
5. **Theo dõi chi phí captcha** — dùng `GET /accounts/captcha-stats` để theo dõi tỉ lệ thành công và chi phí giải captcha theo thời gian thực.

## 12. Tài nguyên khác

- Hướng dẫn thiết lập tài khoản: https://useapi.net/docs/start-here/setup-google-flow
- Ví dụ thực tế (blog): @-mentions, Reusable Voices & Characters, Omni Flash V2V edit, so sánh 17 model ảnh, Video Extend/Concatenate...(xem mục Examples trên trang chính)
- Discord: https://discord.gg/w28uK3cnmF | Telegram: https://t.me/use_api
- **File spec đầy đủ từng endpoint (rất chi tiết, nên tải để feed cho AI khi code)**: https://useapi.net/assets/aibot/api-google-flow-v1.txt

---
*Tài liệu này tổng hợp lại nội dung công khai từ useapi.net (truy cập 07/2026) để tiện tra cứu offline. Vui lòng đối chiếu trang gốc khi cần thông tin cập nhật nhất, vì đây là API "experimental" có thể thay đổi.*

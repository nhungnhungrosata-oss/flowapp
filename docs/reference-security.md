# Bảo mật và vận hành

## Bí mật cần bảo vệ

- `USEAPI_TOKEN`: chỉ tồn tại ở backend/secret manager.
- Bảng cookies dùng để cấu hình Google Flow: xử lý như credential có độ nhạy cao.
- API keys của captcha providers.
- Webhook secret do hệ thống của bạn tự tạo.

## Không nên làm

- Không đưa token vào React/Vue/HTML, mobile bundle hoặc Git.
- Không log request body của `POST /accounts`.
- Không cho client tự truyền URL webhook tùy ý; tránh SSRF.
- Không tin hoàn toàn `replyRef`; đối chiếu với job đã lưu trong database.
- Không retry 429/5xx không giới hạn.

## Nên làm

- Secret manager + rotation.
- Allowlist domain cho webhook outbound nếu có thể.
- Rate limit theo người dùng và theo account Google Flow.
- Idempotency ở tầng ứng dụng: lưu request hash, jobId, trạng thái và output.
- Timeout, exponential backoff có jitter và circuit breaker.
- Redact token, email, cookie, media refs khỏi log công khai.
- Quét file upload, giới hạn MIME/size, không tin extension.
- Tách account production khỏi account thử nghiệm.

## Webhook

Tài liệu nguồn mô tả `replyUrl` nhận callback trạng thái. Vì không thấy cơ chế chữ ký webhook được công bố trong trang tổng hợp, hãy đặt URL khó đoán hoặc gateway riêng, yêu cầu secret của bạn trong query/header nếu kiến trúc cho phép, giới hạn IP khi có danh sách đáng tin cậy, và luôn xác minh lại trạng thái bằng `GET /jobs/{jobId}` trước khi coi kết quả là hợp lệ.

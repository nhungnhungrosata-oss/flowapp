# Product Requirements Document — AdForge AI

## 1. Tầm nhìn

AdForge AI giúp seller biến ảnh sản phẩm thành video quảng cáo short-form mà không cần người mẫu, studio hoặc kỹ năng edit. Giá trị cốt lõi là giảm thời gian từ “có ảnh sản phẩm” đến “có video sẵn sàng đăng” xuống dưới một phiên làm việc ngắn.

## 2. Khách hàng mục tiêu

- Chủ shop online và seller TikTok Shop/Shopee.
- Shop mỹ phẩm, skincare, thời trang, gia dụng.
- Agency nhỏ sản xuất nhiều biến thể quảng cáo.
- Người dùng không chuyên về prompt, quay dựng hoặc motion design.

## 3. Job-to-be-done

“Khi cần đăng video bán hàng đều mỗi ngày, tôi muốn upload ảnh sản phẩm, chọn kiểu người mẫu và bối cảnh, để nhận video dọc có lời đọc, phụ đề và caption mà không phải tự quay.”

## 4. North-star metric

Số **video export thành công / workspace / tuần**.

Các metric phụ:
- Activation: tạo được composite đầu tiên trong ngày đăng ký.
- Time-to-first-preview.
- Tỷ lệ composite được duyệt.
- Tỷ lệ job video thành công.
- Credit gross margin.
- D7/D30 retention.

## 5. Phạm vi MVP

### P0 — bắt buộc

1. Đăng nhập và workspace đơn.
2. Upload ảnh sản phẩm PNG/JPG/WebP tối đa 10MB.
3. Chọn AI Character có sẵn.
4. Chọn Scene Template.
5. Script Generator tiếng Việt.
6. Tạo composite image từ product reference + character reference.
7. Duyệt/chọn composite.
8. Image-to-video 5–10 giây, mặc định 9:16.
9. Job tracking không phụ thuộc việc người dùng ở lại trang.
10. Voice/subtitle/caption configuration và export metadata.
11. Library cho ảnh/video.
12. Credit wallet, reserve/capture/refund.
13. Free/Pro/Business và checkout skeleton.
14. Admin health dashboard.

### P1 — sau MVP

- Multi-shot 15–30 giây bằng extend/concatenate.
- Custom reusable characters và voices.
- Brand Kit áp trực tiếp vào render overlay/outro.
- Variant matrix: 3 hook × 2 character × 2 scene.
- Team members, approvals và comments.
- TikTok/Shopee direct publishing.

### Ngoài phạm vi MVP

- Timeline editor đầy đủ như CapCut.
- Marketplace template do cộng đồng bán.
- Native mobile app.
- Model training riêng cho từng shop.

## 6. User flow chính

1. Người dùng tạo project và nhập tên/ngành hàng.
2. Upload ảnh sản phẩm; hệ thống validate và lưu private S3.
3. Backend upload asset đến provider để nhận `mediaGenerationId`.
4. Người dùng chọn character và scene template.
5. Script Generator tạo hook/body/CTA/voiceover/caption.
6. Backend tạo `Generation(COMPOSITE_IMAGE)`, reserve credit, submit job.
7. Webhook/fallback poll cập nhật trạng thái; worker lưu output về S3.
8. Người dùng duyệt composite và tạo video.
9. Backend tạo `Generation(VIDEO)`, reserve credit, submit async job.
10. Worker lưu MP4, capture credit, tạo output.
11. Người dùng chọn voice/subtitle style, xem caption và export.

## 7. Functional requirements

### Upload
- Chỉ chấp nhận MIME allowlist, kiểm tra size server-side.
- Signed URL tối đa 15 phút.
- Không tin extension; production cần magic-byte inspection.
- Mọi asset gắn user/project và kiểm tra ownership.

### Character & Scene
- Character card có preview, tags, voiceRef/providerRef.
- Scene template gồm prompt ảnh và prompt chuyển động.
- Template lọc theo ngành hàng.

### Composite
- Bảo toàn hình dạng, logo, label, màu và tỷ lệ sản phẩm.
- Có ít nhất 1 output; P1 hỗ trợ 2–4 biến thể.
- Không trừ credit nếu job fail.

### Video
- MVP hỗ trợ model video được tài liệu provider công bố.
- Không hiển thị phần trăm giả khi provider chỉ có trạng thái.
- Client chỉ poll API nội bộ; không gọi provider trực tiếp.

### Script/Voice/Subtitle
- Script gồm hook, body, CTA, voiceover, caption, hashtags.
- Subtitle style theo template; production render có thể dùng FFmpeg service.
- Voice reference được lưu tách khỏi text.

### Credit
- Reserve khi xếp queue; capture khi output đã được lưu bền vững.
- Release/refund khi failed/cancelled.
- Ledger bất biến; balance có thể đối soát từ transaction.

## 8. Gói sản phẩm đề xuất

- Free: 40 credit, 2 video thử, watermark, 720p.
- Pro: 1.200 credit/tháng, 1080p, 5 Brand Kits, queue ưu tiên.
- Business: 4.500 credit/tháng, 5 thành viên, lịch sử dài, hỗ trợ ưu tiên.

Con số credit là business configuration nội bộ, không đồng nhất với credit Google Flow.

## 9. Non-functional requirements

- API P95 thông thường < 500ms, không tính generation.
- Submit generation trả internal ID trong < 2s khi queue/DB khỏe.
- Idempotency cho route tạo job.
- Audit log hành động billing/admin/credential.
- Private S3, signed URL ngắn hạn.
- Rate limit theo user/workspace/IP.
- Structured logs có redact.
- Khả năng thay provider qua adapter.

## 10. Acceptance criteria MVP

- Người dùng hoàn thành wizard và nhận video MP4 lưu trong Library.
- Rời trang trong lúc processing không làm mất job.
- Refresh trang vẫn thấy trạng thái đúng.
- Hai request cùng idempotency key không tạo hai provider jobs.
- Job failed hoàn credit đã reserve.
- User A không đọc được project/asset của User B.
- USEAPI_TOKEN không xuất hiện trong browser bundle/log công khai.
- Provider output được tải về S3 trước khi URL hết hạn.

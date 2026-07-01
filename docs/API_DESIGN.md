# API design

Tất cả route dưới đây là API nội bộ của AdForge, không phải endpoint provider.

## Conventions

- Auth bằng session cookie.
- JSON response.
- Error shape: `{ error, message?, details? }`.
- Create generation yêu cầu `idempotencyKey`.
- Client poll `/api/generations/{id}`; client không poll useapi.net.

## Projects

### `GET /api/projects`
Danh sách project thuộc workspace hiện tại.

### `POST /api/projects`

```json
{
  "name": "Serum GlowUp UGC",
  "industry": "beauty",
  "productName": "Serum Vitamin C GlowUp",
  "productNotes": "Mỏng nhẹ, thấm nhanh",
  "aspectRatio": "9:16",
  "targetDuration": 8
}
```

### `GET/PATCH /api/projects/{id}`
Đọc hoặc lưu character/scene/script của wizard.

## Upload

### `POST /api/uploads/presign`

```json
{
  "fileName": "serum.png",
  "contentType": "image/png",
  "size": 2458123,
  "projectId": "..."
}
```

Response gồm `assetId`, `uploadUrl`, `expiresIn`.

## Script

### `POST /api/scripts/generate`
Input product/audience/benefits/tone/duration; output hook/body/CTA/voiceover/caption/hashtags. Skeleton hiện dùng template deterministic; production cắm LLM qua adapter riêng.

## Composite

### `POST /api/generations/composite`

```json
{
  "projectId": "...",
  "productAssetProviderId": "provider-media-id",
  "characterRef": "character-ref",
  "scenePrompt": "Photorealistic UGC scene...",
  "aspectRatio": "9:16",
  "model": "nano-banana-pro",
  "idempotencyKey": "uuid-or-stable-key"
}
```

Response `202`: `{ generationId, status }`.

## Video

### `POST /api/generations/video`

```json
{
  "projectId": "...",
  "startImageProviderId": "composite-media-id",
  "prompt": "The model naturally raises the serum...",
  "aspectRatio": "portrait",
  "duration": 8,
  "model": "veo-3.1-fast",
  "characterRef": "optional",
  "voiceRef": "optional",
  "idempotencyKey": "uuid-or-stable-key"
}
```

## Job status

### `GET /api/generations/{id}`
Trả internal/provider status và output signed URLs nếu thành công.

## Webhook

### `POST /api/webhooks/useapi/{secret}`
Chỉ provider dùng. Secret ở path, callback được dedupe và job được xác minh lại qua provider API.

## Billing

### `POST /api/billing/checkout`
Body `{ "plan": "PRO" | "BUSINESS" }`, response checkout URL.

## Provider adapter mapping

- Upload: `/assets/{email}` hoặc `/assets` theo cấu hình/tài liệu xác minh.
- Composite: `/images`.
- Video: `/videos`.
- Status: `/jobs/{jobId}`.
- Future: `/voices`, `/characters`, `/videos/extend`, `/videos/concatenate`.

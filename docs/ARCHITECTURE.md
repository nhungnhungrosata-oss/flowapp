# Backend service architecture

## Component diagram

```text
Browser
  │ HTTPS / session
  ▼
Next.js Web + Route Handlers
  ├── Auth boundary
  ├── Zod validation
  ├── Ownership / rate limit
  ├── Prisma service
  ├── S3 presign
  └── Queue producer
         │
         ▼
      Redis / BullMQ
         │
         ▼
Generation Worker
  ├── useapi.net adapter
  ├── provider job sync
  ├── output downloader
  ├── S3 persistence
  └── credit capture/refund
         │
         ├── useapi.net Google Flow API
         ├── PostgreSQL
         └── S3-compatible storage
```

## Generation state machine

```text
DRAFT → QUEUED → SUBMITTED → PROCESSING → SUCCEEDED
                                  └──────→ FAILED
DRAFT/QUEUED/PROCESSING → CANCELLED (P1)
PROCESSING → EXPIRED when provider job retention is exceeded
```

Provider status is stored separately from internal status.

## Composite sequence

1. API validates project ownership and idempotency key.
2. Reserve composite credits.
3. Create Generation with `QUEUED`.
4. BullMQ worker submits `POST /images` with product reference and character reference.
5. Save external job ID; status `PROCESSING`.
6. Provider calls webhook; server does not trust callback alone.
7. Server re-fetches `GET /jobs/{jobId}`.
8. Worker downloads `fifeUrl`, stores private S3 object and creates Asset/Output.
9. Mark `SUCCEEDED`, capture reserved credit.
10. On any terminal failure, release reserved credit.

## Video sequence

Tương tự composite nhưng dùng `POST /videos`, `startImage`, optional character/voice reference và async callback. Output MP4 được tải ngay về S3.

## 15–30 second orchestration

Provider model thường sinh clip ngắn theo duration được hỗ trợ. Phase P1:

- Script planner chia 15–30s thành 2–4 shots.
- Tạo shot đầu bằng image-to-video.
- Shot tiếp theo dùng end frame/extend khi phù hợp.
- Ghép bằng provider concatenate hoặc media worker/FFmpeg.
- Voiceover và subtitle render ở post-processing service.

## Security controls

- Secrets server-only; không dùng biến `NEXT_PUBLIC_` cho provider token.
- Presigned upload; allowlist content type/size; production magic-byte scan.
- Ownership query luôn bao gồm workspaceId.
- Webhook URL secret khó đoán và provider job re-verification.
- Không nhận replyUrl từ browser, tránh SSRF.
- Retry giới hạn, exponential backoff, không retry create request mù.
- Idempotency key unique.
- Private S3 + short-lived signed download URL.
- Structured error normalization; không trả raw provider response.

## Deployment

- Web: Vercel hoặc container Node hỗ trợ route handlers.
- Worker: Railway/Fly.io/ECS/Cloud Run, luôn-on.
- DB: managed PostgreSQL.
- Redis: Upstash/Redis Cloud (BullMQ cần connection phù hợp).
- Storage: AWS S3/R2/MinIO.
- Observability: Sentry + OpenTelemetry + log drain.

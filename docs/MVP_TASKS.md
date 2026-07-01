# MVP implementation task list

## Milestone 0 — Foundation

- [x] Repository/config/TypeScript strict.
- [x] Marketing pages and application shell.
- [x] Prisma schema.
- [x] Provider adapter skeleton.
- [x] BullMQ worker skeleton.
- [x] Security baseline and environment template.
- [ ] CI workflow: typecheck, test, build, Prisma validate.
- [ ] Production Auth.js integration.

## Milestone 1 — Project + Upload

- [ ] CRUD project connected to UI.
- [ ] S3 presign upload from wizard.
- [ ] Server magic-byte validation callback/ingestion.
- [ ] Upload provider asset and persist `providerAssetId`.
- [ ] Project autosave and resume.
- [ ] Tests: invalid MIME, oversize, IDOR, expired signed URL.

## Milestone 2 — Character + Scene + Script

- [ ] Seed scene templates by industry.
- [ ] Sync/list provider characters.
- [ ] Character preview and selection persistence.
- [ ] LLM script adapter, moderation and prompt template versioning.
- [ ] Brand Kit context injection.

## Milestone 3 — Composite generation

- [x] Internal route and validation skeleton.
- [x] Credit reserve/idempotency.
- [x] Worker submit/status/persist flow.
- [ ] Wire wizard to real API.
- [ ] Output selection and regeneration.
- [ ] Integration tests with mocked provider.
- [ ] Rate limit and circuit breaker.

## Milestone 4 — Video generation

- [x] Internal route and worker skeleton.
- [ ] Real processing screen and internal polling.
- [ ] Video player, signed download, retry-safe UX.
- [ ] Thumbnail persistence.
- [ ] Model-specific duration/ratio capability matrix.
- [ ] Timeout/expired job reconciliation cron.

## Milestone 5 — Voice, Subtitle, Export

- [ ] Voice list and custom voice flow.
- [ ] Audio generation/or Omni audio integration decision.
- [ ] Word timing and SRT generation.
- [ ] FFmpeg render worker for subtitle/logo/outro.
- [ ] Export presets TikTok/Reels/Shorts.
- [ ] Caption copy button and download bundle.

## Milestone 6 — Billing + Admin

- [ ] Stripe checkout/webhook/customer portal.
- [ ] Monthly credit grant and ledger reconciliation.
- [ ] Credit pack purchase.
- [ ] Admin provider health sync.
- [ ] Failed job/manual refund workflow.
- [ ] Captcha/quota alerting.

## Release gates

- [ ] No secrets in client bundle or repository.
- [ ] AuthN/AuthZ/IDOR tests pass.
- [ ] Duplicate submit test passes.
- [ ] Provider timeout/429/5xx behavior tested.
- [ ] Failed generation refunds credit exactly once.
- [ ] Output persisted before provider URL expiry.
- [ ] Load test queue and webhook dedupe.
- [ ] Terms/privacy/content policy and abuse reporting.

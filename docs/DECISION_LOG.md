# Decision log

## D-001 — Modular monolith + worker

Decision: Next.js modular monolith cho web/API, worker Node riêng cho background jobs.  
Date: 2026-07-01  
Context: MVP cần phát triển nhanh nhưng generation kéo dài.  
Options considered: single Next server; microservices; modular monolith + worker.  
Chosen option: modular monolith + worker.  
Reason: giảm độ phức tạp vận hành nhưng không khóa job dài vào request lifecycle.  
Consequences: dùng chung Prisma/domain code; worker phải deploy riêng.

## D-002 — Webhook plus polling fallback

Decision: webhook là đường chính, BullMQ poll là fallback.  
Date: 2026-07-01  
Context: callback có thể trễ/mất và cơ chế signature provider chưa được xác minh.  
Chosen option: nhận callback, dedupe, rồi re-fetch job; đồng thời schedule polling.  
Consequences: thêm request provider nhưng tăng độ tin cậy.

## D-003 — Credit reserve/capture

Decision: reserve khi queue, capture sau khi output đã lưu S3, release khi terminal failure.  
Date: 2026-07-01  
Reason: không charge user cho output chưa bền vững.  
Consequences: cần reconciliation cho reserved credit bị treo.

## D-004 — Provider adapter

Decision: mọi gọi useapi.net đi qua `src/lib/useapi`.  
Date: 2026-07-01  
Reason: bảo mật token, chuẩn hóa lỗi và cho phép thay provider.  
Consequences: không gọi provider trực tiếp từ React hoặc route rải rác.

## D-005 — MVP duration

Decision: ship 5–10s trước; 15–30s là orchestration multi-shot P1.  
Date: 2026-07-01  
Reason: duration provider phụ thuộc model/mode, trong khi yêu cầu 30s cần extend/concatenate và post-processing.  
Consequences: UI có thể preview lựa chọn dài nhưng production gate chỉ mở sau khi pipeline multi-shot hoàn tất.

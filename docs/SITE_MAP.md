# Site map

```text
/
├── /pricing
├── /login
└── App (authenticated)
    ├── /dashboard
    ├── /projects
    │   ├── /projects/new                  Wizard 7 bước
    │   └── /projects/[id]                 Chi tiết + pipeline + result
    ├── /library                           Ảnh, video, audio, subtitle
    ├── /brand-kit                         Logo, màu, font, tone, CTA
    ├── /billing                           Plan, credit, invoices
    ├── /settings                          Profile, notifications, security
    └── /admin                             Queue, provider accounts, quota, users
```

## Wizard `/projects/new`

```text
1 Product Upload
2 Character Selection
3 Scene Selection
4 Generate Product Composite Image
5 Generate Video
6 Voice & Subtitle
7 Export
```

## API namespace

```text
/api/projects
/api/projects/[id]
/api/uploads/presign
/api/scripts/generate
/api/generations/composite
/api/generations/video
/api/generations/[id]
/api/webhooks/useapi/[secret]
/api/billing/checkout
```

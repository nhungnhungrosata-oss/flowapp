# Folder structure

```text
adforge-ai/
├── docs/                       Product, architecture, API, tasks
├── prisma/
│   ├── schema.prisma           Database schema
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (app)/              Authenticated SaaS pages
│   │   ├── api/                Internal route handlers + webhook
│   │   ├── login/
│   │   ├── pricing/
│   │   └── page.tsx            Marketing home
│   ├── components/
│   │   ├── app/                Sidebar/topbar/dashboard components
│   │   ├── marketing/
│   │   ├── ui/
│   │   └── wizard/
│   ├── lib/
│   │   ├── useapi/             Single provider client boundary
│   │   ├── validation/         Zod schemas
│   │   ├── auth.ts
│   │   ├── credits.ts
│   │   ├── db.ts
│   │   ├── queue.ts
│   │   ├── security.ts
│   │   └── storage.ts
│   └── worker/
│       └── index.ts            Submit, sync, persist, refund
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

/*
 * Runtime bridge used so this starter can be type-checked in offline environments
 * where Prisma engines cannot be downloaded. In a normal install, run
 * `npm run db:generate`; the runtime package then exposes the generated client.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const runtime = require("@prisma/client") as { PrismaClient: new (options?: unknown) => any };
export const PrismaClient = runtime.PrismaClient;
export const Plan = { FREE: "FREE", PRO: "PRO", BUSINESS: "BUSINESS" } as const;
export const Role = { OWNER: "OWNER", ADMIN: "ADMIN", MEMBER: "MEMBER", VIEWER: "VIEWER" } as const;

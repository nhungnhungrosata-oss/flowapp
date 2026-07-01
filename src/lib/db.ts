import { PrismaClient } from "@/lib/prisma-runtime";

declare global { var prisma: any | undefined; }
export const db: any = global.prisma ?? new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] });
if (process.env.NODE_ENV !== "production") global.prisma = db;

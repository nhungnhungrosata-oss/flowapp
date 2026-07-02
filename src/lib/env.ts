import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().default(""),
  DEV_USER_ID: z.string().default("dev-user"),
  DEV_WORKSPACE_ID: z.string().default("dev-workspace"),
  USEAPI_TOKEN: z.string().default(""),
  USEAPI_ACCOUNT_EMAIL: z.string().default(""),
  USEAPI_TIMEOUT_MS: z.coerce.number().int().positive().default(45000),
  USEAPI_WEBHOOK_SECRET: z.string().default(""),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  S3_REGION: z.string().default("auto"),
  S3_ENDPOINT: z.string().default(""),
  S3_BUCKET: z.string().default(""),
  S3_ACCESS_KEY_ID: z.string().default(""),
  S3_SECRET_ACCESS_KEY: z.string().default(""),
  S3_FORCE_PATH_STYLE: z.string().default("false").transform((value) => value === "true"),
  STRIPE_SECRET_KEY: z.string().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().default(""),
  STRIPE_PRICE_PRO: z.string().default(""),
  STRIPE_PRICE_BUSINESS: z.string().default("")
});

export type Env = z.infer<typeof schema>;
export type EnvKey = keyof Env;

let cached: Env | undefined;

export function env(): Env {
  if (!cached) cached = schema.parse(process.env);
  return cached;
}

export function requireEnvValue(key: EnvKey, label = String(key)): string {
  const value = env()[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} chưa được cấu hình trên Vercel.`);
  }
  return value.trim();
}

import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  DEV_USER_ID: z.string().default("dev-user"),
  DEV_WORKSPACE_ID: z.string().default("dev-workspace"),
  USEAPI_BASE_URL: z.url().default("https://api.useapi.net/v1/google-flow"),
  USEAPI_TOKEN: z.string().optional(),
  USEAPI_ACCOUNT_EMAIL: z.string().optional(),
  USEAPI_TIMEOUT_MS: z.coerce.number().int().positive().default(45000),
  USEAPI_WEBHOOK_SECRET: z.string().min(16),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  S3_REGION: z.string().default("auto"),
  S3_ENDPOINT: z.string().optional(),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.string().default("false").transform((v) => v === "true"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_BUSINESS: z.string().optional()
});

export type Env = z.infer<typeof schema>;
let cached: Env | undefined;

export function env(): Env {
  if (!cached) cached = schema.parse(process.env);
  return cached;
}

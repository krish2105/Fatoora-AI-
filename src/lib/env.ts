import { z } from "zod";

const serverSchema = z.object({
  POSTGRES_PRISMA_URL: z.string().url().default("postgresql://postgres:postgres@localhost:5432/fatoora?schema=public"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // Auth - Required in production
  CLERK_SECRET_KEY: z.string().optional().default("sk_test_dummy"),
  
  // AI
  AI_PROVIDER: z.enum(["mock", "openai"]).default("mock"),
  OPENAI_API_KEY: z.string().optional(),
  
  // Storage
  STORAGE_PROVIDER: z.enum(["mock", "uploadthing", "s3"]).default("mock"),
  UPLOADTHING_SECRET: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  
  // Email
  EMAIL_PROVIDER: z.enum(["mock", "resend"]).default("mock"),
  RESEND_API_KEY: z.string().optional(),
  
  // Billing
  BILLING_PROVIDER: z.enum(["mock", "stripe"]).default("mock"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Admin & Monitoring
  SYSTEM_ADMIN_EMAILS: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  // Required in production
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional().default("pk_test_dummy"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

let serverEnv: z.infer<typeof serverSchema> = {} as any;
let clientEnv: z.infer<typeof clientSchema> = {} as any;

if (typeof window === "undefined") {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid server environment variables:", parsed.error.format());
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid server environment variables. Cannot boot in production.");
    }
    serverEnv = process.env as any;
  } else {
    serverEnv = parsed.data;
  }
}

const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

if (!parsedClient.success) {
  console.error("❌ Invalid client environment variables:", parsedClient.error.format());
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid client environment variables. Cannot boot in production.");
  }
  clientEnv = {
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  } as any;
} else {
  clientEnv = parsedClient.data;
}

export const env = {
  ...serverEnv,
  ...clientEnv,
};

export function requireServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("requireServerEnv was called on the client");
  }
}

export function isProduction() {
  return env.NODE_ENV === "production";
}

export function isDevelopment() {
  return env.NODE_ENV === "development";
}

export function getAppUrl() {
  return env.NEXT_PUBLIC_APP_URL;
}

export function isClerkConfigured() {
  return !!env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!env.CLERK_SECRET_KEY;
}

export function isDevelopmentMockAuthEnabled() {
  return isDevelopment() && !isClerkConfigured();
}

export function getProviderStatus() {
  return {
    auth: isClerkConfigured() ? "real" : "mock",
    database: "real",
    email: env.EMAIL_PROVIDER,
    storage: env.STORAGE_PROVIDER,
    ai: env.AI_PROVIDER,
    billing: env.BILLING_PROVIDER
  };
}

// Strict production guard
if (isProduction()) {
  if (!isClerkConfigured()) {
    console.error("🛑 CRITICAL: Production environment requires Clerk keys (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY & CLERK_SECRET_KEY).");
  }
}

import { env } from "@/lib/env";

export function isClerkConfigured(): boolean {
  return !!(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && env.CLERK_SECRET_KEY);
}

export function isDevelopmentMockAuthEnabled(): boolean {
  return !isClerkConfigured() && env.NODE_ENV !== "production";
}

// In production, Clerk MUST be configured.
if (env.NODE_ENV === "production" && !isClerkConfigured()) {
  console.warn("⚠️ WARNING: Clerk keys are missing in production! Authentication will fail.");
}

import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-response";

// A very basic in-memory rate limiter for the MVP
// In production, this should be replaced with Redis (Upstash) or Cloudflare WAF
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Use this at the top of highly sensitive API routes (e.g. Auth, AI)
 */
export function requireRateLimit(req: Request) {
  // In Next.js App Router, extracting IP can be tricky. We use x-forwarded-for if available.
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  
  if (!checkRateLimit(ip)) {
    return errorResponse("Too Many Requests", 429);
  }
  
  return null;
}

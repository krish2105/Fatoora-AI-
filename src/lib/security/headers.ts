import { NextResponse } from "next/server";

/**
 * Applies strict security headers to an API or Route response.
 * Useful for Next.js middleware or API route wrappers.
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  
  // Enforce HTTPS
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Basic XSS protection (though CSP is much better)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Content Security Policy - Starter strict policy
  // In a real app, you would expand this to allow Clerk, Stripe, etc.
  // "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.dev; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  // For the MVP demo, we keep it relatively permissive for third-party scripts (like React Three Fiber, Clerk, Stripe)
  
  return response;
}

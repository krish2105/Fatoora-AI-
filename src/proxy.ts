import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/app(.*)',
  '/api/(.*)' // Most APIs require auth, except specific webhooks
])

// Define which routes are explicitly public
const isPublicRoute = createRouteMatcher([
  '/api/webhooks(.*)', // Webhooks handle their own security
  '/api/health',
  '/',
  '/privacy',
  '/terms',
  '/compliance',
  '/login(.*)',
  '/signup(.*)'
])

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  if (isProtectedRoute(req)) {
    // In production, this will strictly redirect to sign in if keys are present
    // In local dev without keys, it will gracefully bypass or fail depending on env
    if (process.env.NODE_ENV === 'production' && (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY)) {
      console.error("CRITICAL ERROR: Production Clerk keys missing.")
      // We do not allow bypassing auth in production
    }
    
    // Bypass protect() if we are using a dummy key in development
    const isMockAuth = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('dummy');
    if (process.env.NODE_ENV !== 'production' && isMockAuth) {
      // Allow through without crashing Clerk
    } else {
      // Using protect() ensures the user is redirected to the sign-in page if not authenticated
      await auth.protect()
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

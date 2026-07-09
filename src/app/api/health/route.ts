import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { prisma } from '@/lib/auth'

export async function GET() {
  const timestamp = new Date().toISOString()
  let dbStatus = "unknown"

  try {
    // Ping DB
    await prisma.$queryRaw`SELECT 1`
    dbStatus = "healthy"
  } catch (err) {
    dbStatus = "unhealthy"
  }

  return NextResponse.json({
    status: "ok",
    timestamp,
    app: "Fatoora AI",
    environment: env.NODE_ENV,
    database: dbStatus,
    providers: {
      auth: env.CLERK_SECRET_KEY ? "real" : "mock",
      email: env.EMAIL_PROVIDER,
      storage: env.STORAGE_PROVIDER,
      ai: env.AI_PROVIDER,
      billing: env.BILLING_PROVIDER
    }
  }, {
    status: dbStatus === "healthy" ? 200 : 503
  })
}

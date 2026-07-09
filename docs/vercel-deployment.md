# Fatoora AI: Vercel Deployment Guide

Deploying Fatoora AI to Vercel is highly recommended due to native Next.js support.

## 1. Setup Vercel Project
1. Push your code to GitHub.
2. Go to Vercel and Import the repository.
3. Framework Preset: **Next.js**.

## 2. Environment Variables
You MUST set the following Environment Variables in Vercel before the first deployment:

**Required:**
- `DATABASE_URL`: Hosted PostgreSQL connection string.
- `NEXT_PUBLIC_APP_URL`: The domain Vercel gives you (e.g., `https://fatoora-ai.vercel.app`).
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: From your Clerk Dashboard.
- `CLERK_SECRET_KEY`: From your Clerk Dashboard.

*Note: If Clerk keys are missing in production, the application will refuse to start to protect data.*

**Optional (For full features):**
- `OPENAI_API_KEY` + `AI_PROVIDER=openai`
- `RESEND_API_KEY` + `EMAIL_PROVIDER=resend`
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` + `BILLING_PROVIDER=stripe`
- `S3_BUCKET` + Keys + `STORAGE_PROVIDER=s3`

## 3. Build Command
The default Vercel build command (`next build`) is fine because our `package.json` `postinstall` script runs `prisma generate`.

If you want Vercel to automatically run DB migrations:
**Build Command:** `npx prisma migrate deploy && next build`

## 4. Deployment Verification
1. Open the Vercel URL.
2. Ensure you are redirected to Clerk login.
3. Create a new account.
4. Go to `/app/admin/system` (if you assign yourself SYSTEM_ADMIN) to view the health check.

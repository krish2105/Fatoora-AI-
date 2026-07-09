# Fatoora AI: Database Deployment Guide

This guide explains how to deploy the PostgreSQL database for Fatoora AI. 
Because Fatoora AI is built on Prisma, you can use any hosted PostgreSQL provider.

## Recommended Providers
1. **Neon** (Serverless, scales to zero, generous free tier)
2. **Supabase** (PostgreSQL with extra features, robust)
3. **Railway / Render** (Good for traditional hosted instances)
4. **AWS RDS** (For enterprise scale)

## 1. Getting the Connection String
Once you create a database on your provider, copy the connection string.
It usually looks like this:
`postgresql://user:password@host:5432/dbname?sslmode=require`

## 2. Vercel Configuration
Add the connection string to your Vercel project's Environment Variables as `DATABASE_URL`.

## 3. Running Migrations in Production
**NEVER run `prisma migrate dev` in production.**
Instead, you must deploy your migrations.

Our `package.json` includes custom scripts to help:
```bash
# Push the schema changes directly (good for early prototyping)
npm run db:push

# Deploy migrations (Best practice for production)
npm run db:deploy
```

In Vercel, the build step is automatically configured to run `npx prisma generate`. But you must handle migrations. You can either:
1. Run `npx prisma migrate deploy` locally while connected to your production DB.
2. Add `npx prisma migrate deploy` to your Vercel build command:
   `npx prisma migrate deploy && next build`

## 4. Seeding Demo Data
If this is a fresh database and you want to seed it for a recruiter demo:
1. Ensure your `.env` points to the production database.
2. Run `npm run db:seed`.
3. This is idempotent and safe to run once.

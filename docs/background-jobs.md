# Background Jobs Readiness

While the MVP processes actions synchronously (e.g., generating PDFs or doing Mock AI extraction), a real-world SaaS will eventually need Background Jobs to prevent Vercel Serverless Function timeouts (10-15s max on Hobby/Pro).

## Recommended Architecture
For Next.js / Vercel, we recommend **Inngest** or **Trigger.dev** because they do not require you to host a separate Redis or Worker instance (like BullMQ does).

## Planned Job Queues
When implementing background jobs, you should move the following to queues:
1. **AI Expense Extraction**: `extractExpenseDocument()` can take 5-10 seconds via OpenAI. This should be an async job that updates the UI via WebSockets or polling when complete.
2. **Email Sending**: `sendInvoiceIssuedEmail()` shouldn't block the invoice creation API response.
3. **Monthly Summaries**: A scheduled cron job (via Vercel Cron) hitting `/api/cron/monthly-summary` to generate reports on the 1st of every month.

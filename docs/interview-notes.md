# Interview & Recruiter Notes

Use this document to guide conversations with technical recruiters or engineering managers when presenting Fatoora AI as a portfolio project.

## 1. The 30-Second Pitch
"Fatoora AI is a B2B multi-tenant SaaS built for the UAE market. It helps SMEs manage their invoicing, track expenses via AI OCR, and prepare for the upcoming 2026 UAE Ministry of Finance e-invoicing mandates. It's built on a modern Next.js 16 App Router stack with strict tenant isolation, role-based access control, and a scalable provider architecture."

## 2. Key Technical Challenges Solved
- **Strict Tenant Isolation**: In a B2B SaaS, data leaks between companies are catastrophic. I implemented a robust `requireOrganization()` guard that forces every database query to be scoped to the authenticated tenant context, bypassing the risk of client-side ID spoofing.
- **Provider Architecture**: To make the app demo-able without exposing sensitive API keys, I built a Provider interface layer (`src/lib/providers/`). In development, the app degrades gracefully to Mock providers. In production, Zod validation (`src/lib/env.ts`) guarantees the app will not boot unless real services (like Resend, S3, Stripe) are properly configured.
- **Complex Financial Math**: Handling money in JavaScript is dangerous due to floating-point errors. I used `decimal.js` throughout the entire stack (and Prisma schema) to ensure VAT calculations are mathematically perfect to the exact fil.

## 3. Production Risks & Tradeoffs
- **Mock vs Real AI**: To save costs on portfolio demonstrations, the OCR extraction currently uses a Mock provider. The architecture is ready for an OpenAI Vision or Azure Document Intelligence drop-in, but handling the unpredictable nature of real-world crumpled receipts requires extensive guardrails.
- **Scaling the DB**: The current setup uses Prisma. As the SaaS scales and row counts hit millions, I would need to migrate complex aggregations (like the Dashboard Cash-Flow predictions) to raw SQL views or a dedicated analytics warehouse to prevent slow queries blocking the main thread.

## 4. Why this proves Seniority
A junior developer builds a "To-Do app". A senior developer builds a system that anticipates failure. This project showcases:
- **Zod Environment Validation**: Failing fast during deployment rather than crashing at runtime.
- **Audit Logs**: Recognizing that financial systems require tracing for "who issued this invoice and when".
- **Soft Deletes**: Recognizing that financial records cannot be legally deleted from a database, only marked as void or deleted.

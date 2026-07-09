# Fatoora AI Demo Script

This script is designed for a recruiter or technical interviewer review, lasting approximately 5-7 minutes.

## 1. The Elevator Pitch (1 Minute)
"Hi, I'm excited to show you Fatoora AI. Fatoora AI is a UAE-focused finance, VAT, and e-invoicing readiness SaaS designed for SMEs and accountants. The core problem it solves is preparing UAE businesses for the upcoming e-invoicing mandates while giving them immediate value with accurate VAT estimates and cash-flow insights. It is a multi-tenant SaaS application built with Next.js App Router, Prisma, PostgreSQL, and Clerk."

## 2. The Product Walkthrough (2 Minutes)
- **Start at Landing Page (`/`)**: Point out the lazy-loaded React Three Fiber 3D hero animation and the dark-navy premium fintech aesthetics. Emphasize that the site is fully responsive.
- **Log In to Dashboard (`/app/dashboard`)**: Mention that the dashboard fetches real data via server-side Prisma aggregations. Highlight the net VAT estimate card.
- **Show Invoice Builder (`/app/invoices/new`)**: 
  - *Key point*: Explain the use of `react-hook-form`, `zod`, and `decimal.js`. Point out that the calculation logic uses strict Decimal math to avoid floating-point errors (a common fintech issue). 
  - Showcase the dynamic line items and the UAE-specific VAT treatments (`STANDARD_5`, `ZERO_RATED`, etc.).
- **Show E-Invoicing Readiness (`/app/e-invoicing`)**: 
  - Highlight the readiness checklist.
  - State the compliance disclaimer clearly: *"This provides a structured JSON export, but it is not an official FTA submission. For that, an Accredited Service Provider integration is needed."*

## 3. The Technical Deep Dive (3 Minutes)
- **Architecture**:
  - Point to `src/lib/auth.ts`. Explain the custom `requireOrganization` wrapper.
  - *Crucial*: "To ensure tenant isolation, I never trust the `organizationId` from the client. Every database query enforces the `organizationId` fetched securely via the authenticated session membership."
- **RBAC**:
  - Show `src/lib/permissions.ts`. Explain the strict role matrix (`OWNER`, `FINANCE_MANAGER`, `ACCOUNTANT`, etc.) and how it guards Server Actions like `createInvoice`.
- **Calculations**:
  - Show `src/lib/calculations.ts` and `tests/calculations.test.ts`. Explain the use of `Decimal.js` and Vitest unit testing for absolute accuracy.
- **Server Actions**:
  - Show `src/app/actions/invoices.ts` and explain how validation runs on the server with Zod, calculates the final totals securely on the server, and creates the Audit Log in one Prisma transaction.

## 4. Summary & Limitations (1 Minute)
- "The codebase is hardened for production, passing linting, strict TypeScript checks, and Vitest test suites. It features a safe mock-auth fallback for easy local developer onboarding when Clerk keys aren't present."
- "Limitations for the MVP: Real PDF generation generation requires a background worker queue at scale. AI receipt extraction requires a real OpenAI key."

# 🚀 Fatoora AI

**Fatoora AI** is a production-grade, multi-tenant B2B SaaS designed to help SMEs in the UAE navigate the upcoming 2026 e-invoicing mandates. It handles invoicing, expense OCR extraction, VAT calculations, and generates structured export data ready for Accredited Service Providers (ASPs).

Built as a demonstration of modern, secure, and scalable web architecture.

## 🌟 Core Features

- **Strict Tenant Isolation**: Robust B2B data separation using Clerk and Prisma.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Owners, Admins, Finance Managers, Accountants, and Viewers.
- **VAT & Cash-Flow Center**: Real-time VAT estimates (5%, Zero-Rated, Exempt) calculated flawlessly using `decimal.js`.
- **E-Invoicing Readiness**: Generates FTA-compliant structured JSON payloads.
- **AI Expense OCR**: Upload receipts and extract totals, VAT, and vendor info instantly.
- **Provider Architecture**: Clean abstraction layer for Email (Resend), Storage (S3), AI (OpenAI), and Billing (Stripe) allowing seamless fallback to Mocks in local development.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://postgresql.org/)
- **ORM**: [Prisma v5](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Testing**: [Vitest](https://vitest.dev/)

## 📚 Documentation

Dive deeper into the engineering decisions behind Fatoora AI:

- [Architecture Overview](./docs/architecture.md)
- [Security & Tenant Isolation](./docs/security.md)
- [Limitations & Disclaimers](./docs/limitations.md)
- [Real-Launch Checklist](./docs/launch-checklist.md)
- [Manual QA Guide](./docs/manual-qa.md)
- [Interview & Recruiter Notes](./docs/interview-notes.md)

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- Docker (for local PostgreSQL)

### 2. Setup

```bash
# Install dependencies
npm install

# Start local PostgreSQL via Docker
- [Architecture & Providers](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [Manual QA Guide](./docs/manual-qa.md)

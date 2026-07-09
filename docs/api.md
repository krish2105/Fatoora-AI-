# API Reference & Hardening Guide

All API routes in Fatoora AI are strictly hardened.

## The Standard Pattern
Any mutation or sensitive data retrieval in `src/app/api/` must follow this pattern:

1. **Authentication**: Call `requireOrganization()`. This ensures the user is logged in *and* actively belongs to a valid organization.
2. **Validation**: Use `Zod` schemas to strictly validate `req.json()`.
3. **Tenant Isolation**: Always pass `org.organization.id` to the Prisma query `where` clause. Never trust an `organizationId` sent in the request body.
4. **Standard Responses**: Use `successResponse` or `errorResponse` from `src/lib/api-response.ts`.

Example:
```typescript
const org = await requireOrganization();
const body = await req.json();
const parsed = schema.safeParse(body);
if (!parsed.success) return validationErrorResponse(parsed.error);

const invoice = await prisma.invoice.findFirst({
  where: { id: parsed.data.id, organizationId: org.organization.id } // Strict isolation
});
```

## Available Endpoints (Placeholders/Implemented)
- `/api/health`: Public system status.
- `/api/webhooks/stripe`: HMAC secured webhook receiver.
- `/api/billing/checkout`: Protected checkout session generator.
- `/api/billing/portal`: Protected customer portal generator.

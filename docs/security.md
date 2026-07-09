# Security Model

Fatoora AI is designed to handle sensitive financial data. The following security principles are strictly enforced.

## 1. Zero-Trust Tenant Isolation
- Client-side Organization IDs are **never** trusted.
- All mutations and queries invoke `requireOrganization()`, which resolves the tenant ID securely from the Clerk JWT on the server side.
- Prisma queries always append `organizationId: org.id` to the `where` clause.

## 2. Role-Based Access Control (RBAC)
Every user within an organization holds a specific role:
- **OWNER**: Full access, including billing and organization deletion.
- **ADMIN**: Can manage users and finance data.
- **FINANCE_MANAGER**: Can create/issue invoices and approve expenses.
- **ACCOUNTANT**: Can view and export data, but cannot mutate core entities or issue invoices.
- **VIEWER**: Strictly read-only.

These are enforced via standard helpers in `src/lib/permissions.ts`.

## 3. Financial Immutability
- Invoices cannot be hard-deleted, only marked as `isDeleted = true` (Soft Delete) or transitioned to a `VOID` state.
- Audit logs (`AuditLog`) are generated for every major destructive or state-changing action.

## 4. Input Validation & API Protection
- All user inputs are strictly validated via Zod schemas before hitting the database.
- External API endpoints use standard responses from `api-response.ts`.
- Sensitive operations (like AI extraction or file uploads) are rate-limited.

## 5. File Upload Security
- Uploads are strictly restricted by MIME type (`image/jpeg`, `image/png`, `application/pdf`).
- Max file size is capped at 10MB.
- Files uploaded to S3 are stored securely and accessed via Signed URLs generated dynamically for authorized users.

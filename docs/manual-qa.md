# Fatoora AI: Manual QA Checklist

Before deploying a major release, complete this manual QA pass.

## 1. Public Pages
- [ ] Homepage loads quickly, 3D hero renders without layout shift.
- [ ] `/privacy`, `/terms`, `/compliance` exist and clearly state "Not Tax Advice".

## 2. Authentication (Production)
- [ ] Sign up with a new Clerk account.
- [ ] Ensure redirect leads to onboarding or dashboard.
- [ ] Verify mock auth fallback is explicitly disabled in production.

## 3. Core SaaS Features
- [ ] Create a Customer.
- [ ] Create a Vendor.
- [ ] Create a Product/Service.
- [ ] Create a new Invoice, add items, verify VAT calculation (5% standard).
- [ ] Issue the Invoice.
- [ ] Record a partial payment.
- [ ] Generate the PDF and verify layout.
- [ ] Download the Structured JSON export.
- [ ] Add an Expense, upload a receipt file.
- [ ] Trigger AI Extraction (if OPENAI key is present) and verify confidence score behavior.
- [ ] Approve the expense.

## 4. Analytics & Compliance Centers
- [ ] View the VAT Center. Ensure the estimate matches the generated invoices.
- [ ] Download the VAT CSV export.
- [ ] View the Cash-flow Center.
- [ ] View the E-Invoicing Readiness score.

## 5. Security & Isolation
- [ ] Create a second Organization in Clerk.
- [ ] Ensure invoices and customers from Org 1 DO NOT appear in Org 2.
- [ ] Try to access an invoice ID belonging to Org 1 while logged into Org 2 (Should 404/403).

## 6. Admin
- [ ] Visit `/app/admin/system`.


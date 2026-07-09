# Real-Launch Gap Checklist

If you were to take this repository and launch it as a real, revenue-generating SaaS tomorrow, the following steps *must* be completed:

## 1. 3rd Party Accounts & Credentials
- [ ] **Clerk**: Create a production instance, configure custom domains, set up SAML/SSO if required for Enterprise tier.
- [ ] **Database**: Provision a production PostgreSQL instance (e.g., Neon, Supabase, or AWS RDS).
- [ ] **Email**: Verify your sending domain (`fatoora.ai`) in Resend to ensure high deliverability.
- [ ] **Storage**: Provision an AWS S3 bucket, lock down public access, and configure IAM roles for presigned URLs.
- [ ] **Billing**: Activate Stripe, set up products/prices that match the `Plan` seed data, and configure webhooks to hit `/api/webhooks/stripe`.

## 2. Compliance & Legal
- [ ] **Terms of Service & Privacy Policy**: Drafted and linked in the footer.
- [ ] **Data Processing Agreement (DPA)**: Required for B2B SaaS handling financial records.
- [ ] **FTA Consultation**: Have a UAE tax consultant review the VAT logic (e.g., handling of Reverse Charge mechanisms for specific free zones).
- [ ] **ASP Partnership**: Partner with a real UAE Accredited Service Provider to wire up the "Send to FTA" button.

## 3. Operational & Security
- [ ] **Monitoring**: Integrate Sentry DSN for error tracking.
- [ ] **Backups**: Configure automated daily snapshots for the PostgreSQL database.
- [ ] **Penetration Testing**: Run a security audit on the file upload and tenant-isolation layers.
- [ ] **CI/CD**: Configure Vercel to run `npm run test` and `npx prisma validate` before allowing production merges.

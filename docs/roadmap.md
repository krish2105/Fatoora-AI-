# Roadmap & Future Work

Fatoora AI is a production-ready MVP. Here is the roadmap for taking it to v2.0 and full UAE ASP Integration.

## Near Term (1-3 Months)
- [ ] **Arabic / RTL Support**: Expand `src/lib/i18n` and toggle `arabic_mode` feature flag.
- [ ] **WhatsApp Reminders**: Move the `src/features/whatsapp` MVP to the Meta Graph API for automated sending.
- [ ] **Public Invoice Portal**: Hook up the Stripe payment links to `/invoice/[publicToken]`.

## Medium Term (3-6 Months)
- [ ] **Bank Feed Import**: Add plaid/lean API integration for automated reconciliation.
- [ ] **Accountant Portal**: Build a dedicated view for the `ACCOUNTANT` role to manage multiple client organizations from a single dashboard.

## Long Term (6-12 Months)
- [ ] **Accredited Service Provider (ASP) Integration**: Build the XML conversion pipeline to generate true UBL 2.1 e-invoices and transmit them to the UAE FTA clearance nodes. Currently, we only generate structured JSON prep data.

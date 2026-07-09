# Billing Provider Setup (Stripe)

Fatoora AI handles subscriptions via Stripe (`src/lib/providers/billing`).

## Local Development
The `MockBillingProvider` simulates checkout URLs and immediately returns success states, bypassing the need for Stripe CLI in local setups.

## Production Setup
1. Create a [Stripe](https://stripe.com) account.
2. Create your Subscription Products (e.g., Starter, Business, Accountant).
3. Get your Secret Key.
4. Set up a Webhook endpoint (`https://yourdomain.com/api/webhooks/stripe`) listening for `checkout.session.completed` and `customer.subscription.updated`.
5. Add to `.env`:
```env
BILLING_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Webhook Security
Webhooks are secured via `src/lib/security/webhook.ts` using `crypto.timingSafeEqual` to verify the HMAC signature from Stripe.

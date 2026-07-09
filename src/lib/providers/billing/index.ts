import { env } from "@/lib/env";

export interface BillingProvider {
  createCheckoutSession(organizationId: string, planId: string, successUrl: string, cancelUrl: string): Promise<string>;
  createBillingPortalSession(organizationId: string, customerId: string, returnUrl: string): Promise<string>;
  handleStripeWebhook(payload: unknown): Promise<void>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
  syncSubscription(organizationId: string): Promise<void>;
}

class MockBillingProvider implements BillingProvider {
  async createCheckoutSession(organizationId: string, planId: string, successUrl: string) {
    return `${successUrl}?mock_session_id=checkout_123`;
  }
  async createBillingPortalSession(organizationId: string, customerId: string, returnUrl: string) {
    return `${returnUrl}?mock_portal=true`;
  }
  async handleStripeWebhook() {}
  verifyWebhookSignature() { return true; }
  async syncSubscription() {}
}

class StripeBillingProvider implements BillingProvider {
  async createCheckoutSession(organizationId: string, planId: string, successUrl: string) {
    if (!env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY missing");
    return "https://checkout.stripe.com/pay/cs_test_...";
  }
  async createBillingPortalSession() {
    return "https://billing.stripe.com/p/session/test...";
  }
  async handleStripeWebhook() {}
  verifyWebhookSignature(payload: string, signature: string) {
    if (!env.STRIPE_WEBHOOK_SECRET) return false;
    return true; // Use stripe.webhooks.constructEvent in real impl
  }
  async syncSubscription() {}
}

export const billingProvider: BillingProvider =
  env.BILLING_PROVIDER === "stripe" && env.STRIPE_SECRET_KEY
    ? new StripeBillingProvider()
    : new MockBillingProvider();

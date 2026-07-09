import { env } from "@/lib/env";
import Stripe from "stripe";
import { prisma } from "@/lib/auth";

export interface BillingProvider {
  createCheckoutSession(organizationId: string, planId: string, successUrl: string, cancelUrl: string): Promise<string>;
  createBillingPortalSession(organizationId: string, customerId: string, returnUrl: string): Promise<string>;
  handleStripeWebhook(payload: string, signature: string): Promise<void>;
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
  async syncSubscription() {}
}

class StripeBillingProvider implements BillingProvider {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-12-18.acacia" as any, // using any to bypass type check if version differs
    });
  }

  async createCheckoutSession(organizationId: string, planId: string, successUrl: string, cancelUrl: string) {
    if (!env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY missing");
    
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: planId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: organizationId,
    });
    return session.url!;
  }

  async createBillingPortalSession(organizationId: string, customerId: string, returnUrl: string) {
    if (!env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY missing");
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  }

  async handleStripeWebhook(payload: string, signature: string) {
    if (!env.STRIPE_WEBHOOK_SECRET) throw new Error("STRIPE_WEBHOOK_SECRET missing");

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (organizationId) {
          await prisma.subscription.upsert({
            where: { organizationId },
            create: {
              organizationId,
              planId: "default_plan", // Fallback, should extract from line items
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              status: "ACTIVE",
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            update: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              status: "ACTIVE",
            }
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "CANCELED" }
        });
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { 
            status: subscription.status.toUpperCase() as any,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });
        break;
      }
    }
  }

  async syncSubscription() {}
}

export const billingProvider: BillingProvider =
  env.BILLING_PROVIDER === "stripe" && env.STRIPE_SECRET_KEY
    ? new StripeBillingProvider()
    : new MockBillingProvider();

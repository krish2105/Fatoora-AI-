import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { billingProvider } from "@/lib/providers/billing";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return errorResponse("Missing signature", 400);
    }

    const payload = await req.text();

    // Process webhook
    await billingProvider.handleStripeWebhook(payload, signature);

    return successResponse({ received: true });
  } catch (err: unknown) {
    console.error("Stripe webhook error:", err);
    return errorResponse("Webhook error", 500);
  }
}

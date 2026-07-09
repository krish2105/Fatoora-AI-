import { NextRequest } from "next/server";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";
import { billingProvider } from "@/lib/providers/billing";
import { getCurrentOrganization } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  planId: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const org = await getCurrentOrganization();
    if (!org) return unauthorizedResponse();

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return errorResponse("Invalid input", 400);

    const { planId, successUrl, cancelUrl } = parsed.data;

    const url = await billingProvider.createCheckoutSession(org.organization.id, planId, successUrl, cancelUrl);

    return successResponse({ url });
  } catch (err: unknown) {
    console.error("Checkout session error:", err);
    return errorResponse("Checkout error", 500);
  }
}

import { NextRequest } from "next/server";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";
import { billingProvider } from "@/lib/providers/billing";
import { getCurrentOrganization } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  returnUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const org = await getCurrentOrganization();
    if (!org) return unauthorizedResponse();

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return errorResponse("Invalid input", 400);

    const { returnUrl } = parsed.data;

    // customerId should be retrieved from the Organization's subscription record in the database
    // For MVP, we pass a mock ID
    const customerId = "cus_mock123";

    const url = await billingProvider.createBillingPortalSession(org.organization.id, customerId, returnUrl);

    return successResponse({ url });
  } catch (err: unknown) {
    console.error("Portal session error:", err);
    return errorResponse("Portal error", 500);
  }
}

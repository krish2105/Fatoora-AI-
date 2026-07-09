/**
 * Fatoora AI Analytics Abstraction
 * Currently mocked for development, but ready for PostHog or segment.
 */

type AnalyticsEvent = 
  | "signup_started"
  | "organization_created"
  | "invoice_created"
  | "invoice_issued"
  | "pdf_downloaded"
  | "structured_export_generated"
  | "expense_uploaded"
  | "ai_extraction_reviewed"
  | "vat_exported"
  | "checkout_started";

export const analytics = {
  /**
   * Tracks an event. In production, connect this to PostHog or Segment.
   */
  track: (event: AnalyticsEvent, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics Mock] Event: ${event}`, properties || "");
      return;
    }

    // TODO: Implement PostHog or Segment here
    // Example: posthog.capture(event, properties)
  },

  /**
   * Identifies a user for session tracking.
   */
  identify: (userId: string, traits?: Record<string, any>) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics Mock] Identify: ${userId}`);
      return;
    }

    // Example: posthog.identify(userId, traits)
  }
};

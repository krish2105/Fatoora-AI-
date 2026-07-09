/**
 * Feature Flags Abstraction
 * Simple environment-variable based flags for the MVP.
 * Can be migrated to a database (FeatureFlag table) or LaunchDarkly later.
 */

export type FeatureFlag = 
  | "real_ai_extraction"
  | "real_billing"
  | "arabic_mode"
  | "whatsapp_reminders"
  | "bank_import"
  | "asp_integration"
  | "public_invoice_portal";

const flags: Record<FeatureFlag, boolean> = {
  // Core features tied to real providers
  real_ai_extraction: !!process.env.OPENAI_API_KEY,
  real_billing: !!process.env.STRIPE_SECRET_KEY,
  
  // Future MVP placeholders
  arabic_mode: false, // Set to true to enable RTL toggle
  whatsapp_reminders: false,
  bank_import: false,
  asp_integration: false, // "Fatoora AI is ASP-integration-ready, but this demo does not connect"
  public_invoice_portal: true, // Mock enabled
};

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return flags[flag];
}

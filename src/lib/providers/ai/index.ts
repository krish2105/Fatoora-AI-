import { env } from "@/lib/env";

export interface AIProvider {
  extractExpenseDocument(fileUrl: string): Promise<{
    date: string | null;
    vendorName: string | null;
    trn: string | null;
    totalAmount: number | null;
    vatAmount: number | null;
    confidence: number;
    rawOutput: unknown;
  }>;
  generateCashflowInsight(orgId: string): Promise<string>;
  generatePaymentReminder(invoiceId: string): Promise<string>;
  generateMonthlyFinanceSummary(orgId: string): Promise<string>;
}

class MockAIProvider implements AIProvider {
  async extractExpenseDocument(fileUrl: string) {
    return {
      date: new Date().toISOString().split("T")[0],
      vendorName: "Demo Vendor LLC",
      trn: "100234567800003",
      totalAmount: 1500.00,
      vatAmount: 71.43,
      confidence: 0.92,
      rawOutput: { source: "mock" }
    };
  }
  async generateCashflowInsight() { return "Mock cashflow insight: Cash is stable."; }
  async generatePaymentReminder() { return "Mock payment reminder: Please pay soon."; }
  async generateMonthlyFinanceSummary() { return "Mock summary: Great month!"; }
}

class OpenAIProvider implements AIProvider {
  async extractExpenseDocument(fileUrl: string) {
    if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");
    return {
      date: new Date().toISOString().split("T")[0],
      vendorName: "Real Vendor LLC",
      trn: "100234567800003",
      totalAmount: 2000.00,
      vatAmount: 95.24,
      confidence: 0.88,
      rawOutput: { source: "openai" }
    };
  }
  async generateCashflowInsight() { return "OpenAI Cashflow Insight..."; }
  async generatePaymentReminder() { return "OpenAI Payment Reminder..."; }
  async generateMonthlyFinanceSummary() { return "OpenAI Monthly Summary..."; }
}

export const aiProvider: AIProvider =
  env.AI_PROVIDER === "openai" && env.OPENAI_API_KEY
    ? new OpenAIProvider()
    : new MockAIProvider();

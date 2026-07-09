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

import OpenAI from "openai";

class OpenAIProvider implements AIProvider {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  async extractExpenseDocument(fileUrl: string) {
    if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a UAE VAT compliance assistant. Extract invoice data from the provided image/document. Return JSON matching the schema."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract the following from this receipt: date (YYYY-MM-DD), vendorName, trn (15 digits if present), totalAmount (number), vatAmount (number). Return a JSON object with these keys." },
            { type: "image_url", image_url: { url: fileUrl } }
          ]
        }
      ],
      response_format: { type: "json_object" },
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) throw new Error("Failed to extract data");

    const parsed = JSON.parse(resultText);

    return {
      date: parsed.date || null,
      vendorName: parsed.vendorName || null,
      trn: parsed.trn || null,
      totalAmount: typeof parsed.totalAmount === 'number' ? parsed.totalAmount : null,
      vatAmount: typeof parsed.vatAmount === 'number' ? parsed.vatAmount : null,
      confidence: 0.95,
      rawOutput: parsed
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

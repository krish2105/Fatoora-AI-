/**
 * WhatsApp Reminder MVP Helper
 * Generates polite text templates and deep links for chasing overdue invoices.
 * Future: Connect to WhatsApp Business API via Twilio or Meta Graph.
 */

export interface ReminderPayload {
  customerName: string;
  invoiceNumber: string;
  amountDue: number;
  currency: string;
  dueDate: string;
  publicLink?: string;
}

export function generateReminderText(payload: ReminderPayload): string {
  const base = `Hello ${payload.customerName},\n\nThis is a polite reminder that invoice ${payload.invoiceNumber} for ${payload.currency} ${payload.amountDue.toFixed(2)} was due on ${payload.dueDate}.\n\n`;
  
  const link = payload.publicLink ? `You can view and pay your invoice securely here: ${payload.publicLink}\n\n` : "";
  
  const footer = `Please let us know if you have any questions.\n\nThank you!`;

  return base + link + footer;
}

export function getWhatsAppDeepLink(phone: string, text: string): string {
  // Clean phone number (remove spaces, +, etc)
  const cleanPhone = phone.replace(/\D/g, "");
  
  // URL encode the text
  const encodedText = encodeURIComponent(text);
  
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

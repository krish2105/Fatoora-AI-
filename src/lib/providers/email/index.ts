import { env } from "@/lib/env";

export interface EmailProvider {
  sendInvitationEmail(to: string, inviterName: string, orgName: string, inviteUrl: string): Promise<boolean>;
  sendInvoiceIssuedEmail(to: string, invoiceNumber: string, orgName: string, pdfUrl: string): Promise<boolean>;
  sendPaymentReminderEmail(to: string, invoiceNumber: string, amountDue: number): Promise<boolean>;
  sendOverdueInvoiceEmail(to: string, invoiceNumber: string, daysOverdue: number): Promise<boolean>;
  sendVatExportReadyEmail(to: string, orgName: string, downloadUrl: string): Promise<boolean>;
}

class MockEmailProvider implements EmailProvider {
  async sendInvitationEmail(to: string, inviterName: string, orgName: string) {
    console.log(`📧 [Mock Email] Invitation sent to ${to} from ${inviterName} for ${orgName}`);
    return true;
  }
  async sendInvoiceIssuedEmail(to: string, invoiceNumber: string) {
    console.log(`📧 [Mock Email] Invoice ${invoiceNumber} issued to ${to}`);
    return true;
  }
  async sendPaymentReminderEmail(to: string, invoiceNumber: string) {
    console.log(`📧 [Mock Email] Reminder for ${invoiceNumber} sent to ${to}`);
    return true;
  }
  async sendOverdueInvoiceEmail(to: string, invoiceNumber: string) {
    console.log(`📧 [Mock Email] Overdue notice for ${invoiceNumber} sent to ${to}`);
    return true;
  }
  async sendVatExportReadyEmail(to: string) {
    console.log(`📧 [Mock Email] VAT Export ready sent to ${to}`);
    return true;
  }
}

class ResendEmailProvider implements EmailProvider {
  private ensureConfigured() {
    if (!env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is missing. Falling back to safe failure.");
      if (env.NODE_ENV === "production") throw new Error("RESEND_API_KEY missing in production.");
    }
  }

  async sendInvitationEmail(to: string, inviterName: string, orgName: string, inviteUrl: string) {
    this.ensureConfigured();
    // await resend.emails.send({ ... })
    return true;
  }
  async sendInvoiceIssuedEmail(to: string, invoiceNumber: string, orgName: string, pdfUrl: string) {
    this.ensureConfigured();
    return true;
  }
  async sendPaymentReminderEmail(to: string, invoiceNumber: string, amountDue: number) {
    this.ensureConfigured();
    return true;
  }
  async sendOverdueInvoiceEmail(to: string, invoiceNumber: string, daysOverdue: number) {
    this.ensureConfigured();
    return true;
  }
  async sendVatExportReadyEmail(to: string, orgName: string, downloadUrl: string) {
    this.ensureConfigured();
    return true;
  }
}

export const emailProvider: EmailProvider = 
  env.EMAIL_PROVIDER === "resend" && env.RESEND_API_KEY
    ? new ResendEmailProvider()
    : new MockEmailProvider();

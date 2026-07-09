import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <Card>
        <CardContent className="prose prose-slate pt-6">
          <p className="text-sm text-slate-500 italic mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          <h2>1. Acceptance of Terms</h2>
          <p>By using Fatoora AI, you agree to these placeholder terms. This is a demo/MVP application.</p>
          <h2>2. No Tax Advice</h2>
          <p><strong>Disclaimer:</strong> Fatoora AI provides VAT estimates and structured exports. We are not tax advisors. The reports generated are not official tax filings. You must review all data with a qualified accountant.</p>
          <h2>3. E-Invoicing Readiness</h2>
          <p>Fatoora AI is ASP-integration-ready, but this demo does not currently connect to an Accredited Service Provider for direct FTA submission.</p>
        </CardContent>
      </Card>
    </div>
  );
}

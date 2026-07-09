import { Card, CardContent } from "@/components/ui/card";

export default function CompliancePage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Compliance & Legal Boundaries</h1>
      <Card>
        <CardContent className="prose prose-slate pt-6">
          <p>Fatoora AI is built to help UAE businesses prepare for modern financial workflows, including VAT reporting and E-invoicing readiness.</p>
          
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
            <h3 className="text-amber-800 m-0 text-lg font-bold">Important Disclaimers</h3>
            <ul className="text-amber-900 mt-2">
              <li><strong>VAT estimate only.</strong> Not official tax filing. Review with your accountant.</li>
              <li><strong>Structured export only.</strong> Not an official FTA submission.</li>
              <li>Fatoora AI is <strong>ASP-integration-ready</strong>, but this demo does not connect to an Accredited Service Provider.</li>
            </ul>
          </div>

          <h2>Security Architecture</h2>
          <p>Our platform uses tenant isolation (Organization IDs) to strictly separate data. RBAC (Role-Based Access Control) ensures that Viewers cannot issue invoices, and only authorized members can access financial data.</p>
        </CardContent>
      </Card>
    </div>
  );
}

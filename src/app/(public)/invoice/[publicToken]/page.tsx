import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CreditCard } from "lucide-react";
import { isFeatureEnabled } from "@/lib/feature-flags";

interface PublicInvoicePageProps {
  params: {
    publicToken: string;
  };
}

export default function PublicInvoicePage({ params }: PublicInvoicePageProps) {
  const isPublicPortalEnabled = isFeatureEnabled("public_invoice_portal");

  if (!isPublicPortalEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center text-slate-500">
            This invoice portal is currently disabled.
          </CardContent>
        </Card>
      </div>
    );
  }

  // MVP Placeholder: In a real app, you would fetch the invoice by a unique secure `publicToken`
  // We use mock data here to demonstrate the UI layout
  const mockInvoice = {
    invoiceNumber: "INV-0001",
    totalAmount: 1050.00,
    dueDate: "12/31/2026",
    status: "ISSUED",
    companyName: "Acme Corp LLC"
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{mockInvoice.companyName}</h1>
            <p className="text-slate-500">Invoice {mockInvoice.invoiceNumber}</p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {mockInvoice.status}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Amount Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900 mb-2">
              AED {mockInvoice.totalAmount.toFixed(2)}
            </div>
            <p className="text-sm text-slate-500 mb-6">Due by {mockInvoice.dueDate}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 gap-2">
                <CreditCard className="w-4 h-4" />
                Pay Now
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-400">
          Powered by <span className="font-semibold text-slate-500">Fatoora AI</span>
        </div>
      </div>
    </div>
  );
}

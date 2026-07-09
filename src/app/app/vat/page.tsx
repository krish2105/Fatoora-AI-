import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function VatCenterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">VAT Center</h1>
        <Button className="gap-2 bg-slate-800 hover:bg-slate-700 text-white">
          <Download className="w-4 h-4" /> Export VAT Report
        </Button>
      </div>
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle>VAT Liability Estimate</CardTitle>
          <CardDescription>Automated calculation of Output VAT minus Input VAT.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-slate-500">
          VAT Ledger MVP is coming soon.
        </CardContent>
      </Card>
    </div>
  );
}

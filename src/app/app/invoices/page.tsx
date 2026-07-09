import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <Link href="/app/invoices/new">
          <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4" /> Create Invoice
          </Button>
        </Link>
      </div>
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>Manage and track your issued invoices.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
          <p>No invoices found in this view yet.</p>
          <Link href="/app/invoices/new">
            <Button variant="outline">Generate your first invoice</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

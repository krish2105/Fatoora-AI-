import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4" /> Add Customer
        </Button>
      </div>
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>Manage your customer TRN numbers and billing details.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-slate-500">
          Customer Management MVP is coming soon.
        </CardContent>
      </Card>
    </div>
  );
}

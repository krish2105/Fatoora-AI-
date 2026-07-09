import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
          <Upload className="w-4 h-4" /> Upload Receipt (AI)
        </Button>
      </div>
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle>Expense Tracker</CardTitle>
          <CardDescription>Track purchases and automatically extract Input VAT via AI.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-slate-500">
          Expense Tracking MVP is coming soon.
        </CardContent>
      </Card>
    </div>
  );
}

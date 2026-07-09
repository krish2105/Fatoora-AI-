import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CashflowPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cash Flow</h1>
      </div>
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle>Cash Flow Insights</CardTitle>
          <CardDescription>Predict incoming revenue vs outgoing expenses.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-slate-500">
          Cash Flow Projections MVP is coming soon.
        </CardContent>
      </Card>
    </div>
  );
}

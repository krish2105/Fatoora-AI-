import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Generate P&L, aging summaries, and custom financial exports.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-slate-500">
          Reporting Engine MVP is coming soon.
        </CardContent>
      </Card>
    </div>
  );
}

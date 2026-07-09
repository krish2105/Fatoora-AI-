import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsCompanyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
      </div>
      <Card className="border-slate-800 bg-slate-900/50 max-w-2xl">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Manage your legal entity name, TRN, and billing address.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-slate-500">
          Company Settings Form MVP is coming soon.
        </CardContent>
      </Card>
    </div>
  );
}

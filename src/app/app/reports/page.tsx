import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, FileText, PieChart, TrendingUp } from "lucide-react";
import { requireOrganization, prisma } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const { organization } = await requireOrganization()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">Generate comprehensive business intelligence reports.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card hover:border-emerald-500/50 transition-colors cursor-pointer group">
          <CardHeader>
            <div className="p-3 bg-emerald-500/10 rounded-lg w-fit mb-2 group-hover:bg-emerald-500/20 transition-colors">
              <FileText className="h-6 w-6 text-emerald-500" />
            </div>
            <CardTitle>Profit & Loss</CardTitle>
            <CardDescription>Income, expenses, and net profit over a selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/api/exports/reports/profit-loss" download className={cn(buttonVariants({ variant: 'outline' }), "w-full justify-between group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500")}>
              Export to CSV
              <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </CardContent>
        </Card>

        <Card className="glass-card hover:border-blue-500/50 transition-colors group">
          <CardHeader>
            <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-2 group-hover:bg-blue-500/20 transition-colors">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <CardTitle>Aged Receivables</CardTitle>
            <CardDescription>Overdue invoices bucketed by 30, 60, and 90+ days.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/api/exports/reports/aged-receivables" download className={cn(buttonVariants({ variant: 'outline' }), "w-full justify-between group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500")}>
              Export to CSV
              <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </CardContent>
        </Card>

        <Card className="glass-card hover:border-amber-500/50 transition-colors group">
          <CardHeader>
            <div className="p-3 bg-amber-500/10 rounded-lg w-fit mb-2 group-hover:bg-amber-500/20 transition-colors">
              <PieChart className="h-6 w-6 text-amber-500" />
            </div>
            <CardTitle>Expense by Category</CardTitle>
            <CardDescription>Breakdown of your spending to identify cost centers.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/api/exports/reports/expense-category" download className={cn(buttonVariants({ variant: 'outline' }), "w-full justify-between group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500")}>
              Export to CSV
              <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

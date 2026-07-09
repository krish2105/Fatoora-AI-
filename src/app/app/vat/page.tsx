import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Calculator, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { requireOrganization, prisma } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export default async function VatCenterPage() {
  const { organization } = await requireOrganization()

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: organization.id, status: { not: 'VOID' } },
  })

  const expenses = await prisma.expense.findMany({
    where: { organizationId: organization.id, status: 'APPROVED', vatRecoverable: true },
  })

  const outputVat = invoices.reduce((sum, inv) => sum + inv.vatAmount.toNumber(), 0)
  const inputVat = expenses.reduce((sum, exp) => sum + exp.vatAmount.toNumber(), 0)
  const netVat = outputVat - inputVat

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VAT Center</h1>
          <p className="text-muted-foreground mt-1">FTA-compliant tax engine for UAE.</p>
        </div>
        <a href="/api/exports/vat" download className={cn(buttonVariants(), "gap-2 bg-emerald-600 hover:bg-emerald-700 text-white")}>
          <Download className="h-4 w-4" />
          Export UAE FTA Audit File (FAF)
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Output VAT (Collected)</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">AED {outputVat.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {invoices.length} issued invoices</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Input VAT (Recoverable)</CardTitle>
            <div className="p-2 bg-rose-500/10 rounded-full">
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">AED {inputVat.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {expenses.length} approved expenses</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-blue-500/30 bg-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-500">Net VAT Payable</CardTitle>
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Calculator className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">AED {netVat.toFixed(2)}</div>
            <p className="text-xs text-blue-500 mt-1">{netVat >= 0 ? 'Payable to FTA' : 'Refundable by FTA'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Quarterly Filing Periods</CardTitle>
          <CardDescription>Your upcoming and past VAT return filing deadlines.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
              <div>
                <h4 className="font-semibold text-emerald-500">Q3 2024 (Jul - Sep)</h4>
                <p className="text-sm text-muted-foreground">Due: Oct 28, 2024</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold">Est. AED {netVat.toFixed(2)}</p>
                  <p className="text-xs text-emerald-500">Current Period</p>
                </div>
                <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white">
                  Review <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
              <div>
                <h4 className="font-semibold text-muted-foreground">Q2 2024 (Apr - Jun)</h4>
                <p className="text-sm text-muted-foreground">Filed on: Jul 25, 2024</p>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="text-right">
                  <p className="font-bold">AED 4,250.00</p>
                  <p className="text-xs">Paid</p>
                </div>
                <Button size="sm" variant="ghost" disabled>
                  Filed
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

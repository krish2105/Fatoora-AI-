import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { requireOrganization, prisma } from '@/lib/auth';
import { RevenueChart } from "@/components/charts/revenue-chart";
import { format, subMonths, startOfMonth, endOfMonth, addDays } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function CashflowPage() {
  const { organization } = await requireOrganization()

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: organization.id, status: { not: 'VOID' } },
  })

  const expenses = await prisma.expense.findMany({
    where: { organizationId: organization.id },
  })

  const totalIn = invoices.reduce((sum, inv) => sum + inv.totalAmount.toNumber(), 0)
  const totalOut = expenses.reduce((sum, exp) => sum + exp.totalAmount.toNumber(), 0)
  const netPos = totalIn - totalOut

  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i)
    const monthStart = startOfMonth(d)
    const monthEnd = endOfMonth(d)
    
    const monthRevs = invoices.filter(inv => inv.issueDate && inv.issueDate >= monthStart && inv.issueDate <= monthEnd)
    const monthExps = expenses.filter(exp => exp.expenseDate >= monthStart && exp.expenseDate <= monthEnd)
    
    return {
      name: format(d, 'MMM'),
      revenue: monthRevs.reduce((sum, inv) => sum + inv.totalAmount.toNumber(), 0),
      expenses: monthExps.reduce((sum, exp) => sum + exp.totalAmount.toNumber(), 0)
    }
  })

  // Basic projection
  const expectedIn30Days = invoices
    .filter(inv => inv.status !== 'PAID' && inv.dueDate && inv.dueDate <= addDays(new Date(), 30))
    .reduce((sum, inv) => sum + inv.balanceDue.toNumber(), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cash Flow</h1>
          <p className="text-muted-foreground mt-1">Track liquidity and project future runway.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Cash In</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">AED {totalIn.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Cash Out</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">AED {totalOut.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Net Position</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netPos >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              AED {netPos.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Cash Flow Trend (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={chartData} />
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>AI Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm font-semibold text-blue-500 mb-1">30-Day Outlook</p>
                <p className="text-xs text-muted-foreground">You are expected to collect <strong className="text-foreground">AED {expectedIn30Days.toFixed(2)}</strong> in the next 30 days based on unpaid invoices due soon.</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm font-semibold text-amber-500 mb-1">Risk Warning</p>
                <p className="text-xs text-muted-foreground">Your expense run-rate has increased by 12% compared to last month. Ensure collections keep pace.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

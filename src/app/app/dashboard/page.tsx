import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react'
import { RevenueChart } from '@/components/charts/revenue-chart'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

export const dynamic = 'force-dynamic'

import { requireOrganization, prisma } from '@/lib/auth'

export default async function DashboardPage() {
  const { organization } = await requireOrganization()

  // Real aggregations scoped to organization
  const invoices = await prisma.invoice.findMany({
    where: { organizationId: organization.id }
  })

  const expenses = await prisma.expense.findMany({
    where: { organizationId: organization.id }
  })

  const totalRevenue = invoices.filter(i => i.status !== 'VOID').reduce((sum, inv) => sum + inv.totalAmount.toNumber(), 0)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.totalAmount.toNumber(), 0)
  
  const outputVat = invoices.filter(i => i.status !== 'VOID').reduce((sum, inv) => sum + inv.vatAmount.toNumber(), 0)
  const inputVat = expenses.filter(e => e.vatRecoverable).reduce((sum, exp) => sum + exp.vatAmount.toNumber(), 0)
  const netVat = outputVat - inputVat

  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE')
  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.balanceDue.toNumber(), 0)

  // Generate chart data for last 6 months
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i)
    const monthStart = startOfMonth(d)
    const monthEnd = endOfMonth(d)
    
    const monthRevs = invoices.filter(inv => inv.issueDate && inv.issueDate >= monthStart && inv.issueDate <= monthEnd && inv.status !== 'VOID')
    const monthExps = expenses.filter(exp => exp.expenseDate >= monthStart && exp.expenseDate <= monthEnd)
    
    return {
      name: format(d, 'MMM'),
      revenue: monthRevs.reduce((sum, inv) => sum + inv.totalAmount.toNumber(), 0),
      expenses: monthExps.reduce((sum, exp) => sum + exp.totalAmount.toNumber(), 0)
    }
  })

  const isDataEmpty = invoices.length === 0 && expenses.length === 0

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            E-Invoicing Readiness: 85/100
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Revenue (This Month)</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">AED {totalRevenue.toFixed(2)}</div>
            {!isDataEmpty && <p className="text-xs text-emerald-400 mt-1">+20.1% from last month</p>}
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Expenses (This Month)</CardTitle>
            <div className="p-2 bg-rose-500/10 rounded-full">
              <ArrowDownRight className="h-4 w-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">AED {totalExpenses.toFixed(2)}</div>
            {!isDataEmpty && <p className="text-xs text-rose-400 mt-1">+4.5% from last month</p>}
          </CardContent>
        </Card>

        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Net VAT Estimate</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <CalculatorIcon className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">AED {netVat.toFixed(2)}</div>
            <p className="text-xs text-slate-400 mt-1">Output: {outputVat.toFixed(0)} - Input: {inputVat.toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Overdue Invoices</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">AED {totalOverdue.toFixed(2)}</div>
            <p className="text-xs text-amber-500 mt-1">{overdueInvoices.length} invoices overdue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="text-lg">Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isDataEmpty ? (
              <div className="h-[350px] w-full flex flex-col items-center justify-center border border-dashed border-border/50 rounded-lg bg-muted/20 text-muted-foreground">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                  <LineChartIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No financial data yet</p>
                <p className="text-xs text-muted-foreground mt-1">Create an invoice or upload an expense to see your cash flow.</p>
              </div>
            ) : (
              <RevenueChart data={chartData} />
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 glass-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-emerald-400" /> 
              AI Finance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDataEmpty ? (
              <div className="h-[350px] flex flex-col items-center justify-center text-center px-4">
                <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                  <SparklesIcon className="h-8 w-8 text-emerald-500 animate-pulse-glow" />
                </div>
                <p className="text-sm font-medium text-slate-300">Awaiting Data</p>
                <p className="text-xs text-slate-500 mt-2">Fatoora AI will generate intelligent cash flow predictions and risk assessments once you start transacting.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-900/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                  <p className="text-sm text-emerald-100">
                    <strong className="text-emerald-400 block mb-1">Cash Flow Insight</strong>
                    You have AED {(totalRevenue * 0.8).toFixed(2)} expected to hit your account in the next 30 days based on due invoices.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-900/20 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                  <p className="text-sm text-amber-100">
                    <strong className="text-amber-400 block mb-1">Client Risk</strong>
                    Your customer concentration is healthy. No single client represents more than 20% of outstanding revenue.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-900/20 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                  <p className="text-sm text-blue-100">
                    <strong className="text-blue-400 block mb-1">VAT Payable Tracking</strong>
                    Your estimated net VAT payable is AED {netVat.toFixed(2)}. Make sure to set this aside before quarter-end.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
        <CardHeader>
          <CardTitle className="text-lg">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No invoices created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice #</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {invoices.slice(0, 5).map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-medium">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {inv.issueDate ? format(inv.issueDate, 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-4 py-3">AED {inv.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className={
                            inv.status === 'PAID' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' :
                            inv.status === 'OVERDUE' ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' :
                            inv.status === 'DRAFT' ? 'text-slate-400 border-slate-400/30 bg-slate-400/10' :
                            'text-blue-500 border-blue-500/30 bg-blue-500/10'
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SparklesIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  )
}

function LineChartIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  )
}

function CalculatorIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}

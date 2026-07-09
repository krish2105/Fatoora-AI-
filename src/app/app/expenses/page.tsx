import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Receipt, Upload, Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { requireOrganization, prisma } from '@/lib/auth';
import { format } from "date-fns";
import { UploadReceiptModal } from "@/components/expenses/upload-receipt-modal";
import Link from "next/link";

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  const { organization } = await requireOrganization()

  const expenses = await prisma.expense.findMany({
    where: { organizationId: organization.id },
    include: { vendor: true },
    orderBy: { expenseDate: 'desc' }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground mt-1">Track your spending and recover input VAT.</p>
        </div>
        <div className="flex gap-3">
          <a href="/api/exports/expenses" download className={cn(buttonVariants({ variant: 'outline' }), "gap-2")}>
            <Download className="h-4 w-4" />
            Export CSV
          </a>
          <UploadReceiptModal 
            trigger={
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Receipt (AI)
              </Button>
            } 
          />
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search expenses..."
                className="pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No expenses yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">Record your first expense to track your cash flow.</p>
              <div className="flex justify-center gap-3">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Add Manually</Button>
                <Button variant="outline">Upload Receipt</Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Vendor</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Total Amount</th>
                    <th className="px-6 py-4 font-medium">VAT Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(e.expenseDate, 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{e.vendor?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{e.category}</td>
                      <td className="px-6 py-4 font-medium">AED {e.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-muted-foreground">AED {e.vatAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className={
                            e.status === 'APPROVED' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' :
                            e.status === 'REJECTED' ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' :
                            'text-amber-500 border-amber-500/30 bg-amber-500/10'
                          }
                        >
                          {e.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10">
                          View
                        </Button>
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

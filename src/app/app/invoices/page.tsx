import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, FileText, Search, Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { requireOrganization, prisma } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const { organization } = await requireOrganization()

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: organization.id },
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage your invoices and track payments.</p>
        </div>
        <div className="flex gap-3">
          <a href="/api/exports/invoices" download className={cn(buttonVariants({ variant: 'outline' }), "gap-2")}>
            <Download className="h-4 w-4" />
            Export CSV
          </a>
          <Link href="/app/invoices/new">
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Invoices</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No invoices yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">Create your first invoice to get started.</p>
              <Link href="/app/invoices/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Invoice #</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Issue Date</th>
                    <th className="px-6 py-4 font-medium">Due Date</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4">{inv.customer?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {inv.issueDate ? format(inv.issueDate, 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {inv.dueDate ? format(inv.dueDate, 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-medium">AED {inv.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 text-right">
                        <Link href={`/app/invoices/${inv.id}`}>
                          <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10">
                            View
                          </Button>
                        </Link>
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

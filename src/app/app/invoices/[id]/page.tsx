import { requireOrganization, prisma } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Download, FileText, ArrowLeft, Printer, Send } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function InvoiceDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const { organization } = await requireOrganization()
  
  const invoice = await prisma.invoice.findFirst({
    where: { 
      id,
      organizationId: organization.id
    },
    include: {
      customer: true,
      lineItems: true
    }
  })

  if (!invoice) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app/invoices">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            Invoice {invoice.invoiceNumber}
            <Badge 
              variant="outline" 
              className={
                invoice.status === 'PAID' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' :
                invoice.status === 'OVERDUE' ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' :
                invoice.status === 'DRAFT' ? 'text-slate-400 border-slate-400/30 bg-slate-400/10' :
                'text-blue-500 border-blue-500/30 bg-blue-500/10'
              }
            >
              {invoice.status}
            </Badge>
          </h1>
        </div>
        <div className="flex gap-2">
          <a href={`/api/invoices/${invoice.id}/export`} download>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              JSON Export
            </Button>
          </a>
          <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              PDF
            </Button>
          </a>
          <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Send className="h-4 w-4" />
            Send to Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="glass-card h-full">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">Fatoora AI</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {organization.name}<br />
                    TRN: {organization.profile?.trn || 'N/A'}<br />
                    Dubai, UAE
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">Tax Invoice</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Invoice #:</strong> {invoice.invoiceNumber}<br />
                    <strong>Issue Date:</strong> {invoice.issueDate ? format(invoice.issueDate, 'dd MMM yyyy') : 'N/A'}<br />
                    <strong>Due Date:</strong> {invoice.dueDate ? format(invoice.dueDate, 'dd MMM yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Billed To</h4>
                {invoice.customer ? (
                  <div className="text-sm">
                    <p className="font-medium text-base text-foreground">{invoice.customer.name}</p>
                    <p className="text-muted-foreground">{invoice.customer.email}</p>
                    {invoice.customer.trn && <p className="text-muted-foreground">TRN: {invoice.customer.trn}</p>}
                    <p className="text-muted-foreground mt-1 whitespace-pre-line">{invoice.customer.address}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No customer information</p>
                )}
              </div>

              <div className="rounded-lg border border-border/50 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium text-right">Qty</th>
                      <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                      <th className="px-4 py-3 font-medium text-right">VAT</th>
                      <th className="px-4 py-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {invoice.lineItems.length > 0 ? (
                      invoice.lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium text-foreground">{item.description}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity.toString()}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">AED {item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{item.vatRate.toString()}%</td>
                          <td className="px-4 py-3 text-right font-medium">AED {item.total.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No items on this invoice</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>AED {invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total VAT:</span>
                    <span>AED {invoice.vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-foreground pt-3 border-t border-border/50">
                    <span>Total Amount:</span>
                    <span>AED {invoice.totalAmount.toFixed(2)}</span>
                  </div>
                  {invoice.status !== 'PAID' && invoice.balanceDue && (
                    <div className="flex justify-between font-bold text-amber-500 pt-1">
                      <span>Balance Due:</span>
                      <span>AED {invoice.balanceDue.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.status === 'PAID' ? (
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">
                  <p className="text-emerald-500 font-medium">Fully Paid</p>
                  <p className="text-sm text-emerald-600/70 mt-1">Payment recorded.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-amber-500 font-medium mb-1">Awaiting Payment</p>
                    <p className="text-2xl font-bold text-foreground">AED {invoice.balanceDue?.toFixed(2)}</p>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Record Payment</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border/50 bg-background/50 shadow">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-foreground text-sm">Invoice Created</div>
                      <time className="font-caveat font-medium text-emerald-500/70 text-xs">{format(invoice.createdAt, 'MMM dd')}</time>
                    </div>
                    <div className="text-muted-foreground text-xs">System generated draft.</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

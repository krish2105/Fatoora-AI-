import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Users, Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireOrganization, prisma } from '@/lib/auth';
import { format } from "date-fns";
import { CustomerForm } from "@/components/forms/customer-form";

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const { organization } = await requireOrganization()

  const customers = await prisma.customer.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your clients and their tax information.</p>
        </div>
        <div className="flex gap-3">
          <a href="/api/exports/customers" download className={cn(buttonVariants({ variant: 'outline' }), "gap-2")}>
            <Download className="h-4 w-4" />
            Export CSV
          </a>
          <CustomerForm 
            trigger={
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            } 
          />
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Customer Directory</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No customers yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">Add your first customer to start invoicing.</p>
              <CustomerForm trigger={<Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Add Customer</Button>} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Phone</th>
                    <th className="px-6 py-4 font-medium">TRN</th>
                    <th className="px-6 py-4 font-medium">Added On</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{c.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{c.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{c.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{c.trn || 'N/A'}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(c.createdAt, 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10">
                          Edit
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

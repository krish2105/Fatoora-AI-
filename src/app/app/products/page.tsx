import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Package, Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { requireOrganization, prisma } from '@/lib/auth';
import { format } from "date-fns";
import { ProductForm } from "@/components/forms/product-form";

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const { organization } = await requireOrganization()

  const products = await prisma.productService.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Services</h1>
          <p className="text-muted-foreground mt-1">Manage your catalog and default VAT treatments.</p>
        </div>
        <div className="flex gap-3">
          <a href="/api/exports/products" download className={cn(buttonVariants({ variant: 'outline' }), "gap-2")}>
            <Download className="h-4 w-4" />
            Export CSV
          </a>
          <ProductForm 
            trigger={
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            } 
          />
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Catalog</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No products yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">Add your first product or service to speed up invoicing.</p>
              <ProductForm trigger={<Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Add Item</Button>} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">VAT Treatment</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{p.name}</td>
                      <td className="px-6 py-4 text-muted-foreground max-w-md truncate">{p.description || 'N/A'}</td>
                      <td className="px-6 py-4 font-medium">AED {Number(p.defaultUnitPrice).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className={
                            p.vatTreatment === 'STANDARD_5' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' :
                            'text-slate-500 border-slate-500/30 bg-slate-500/10'
                          }
                        >
                          {p.vatTreatment.replace('_', ' ')}
                        </Badge>
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

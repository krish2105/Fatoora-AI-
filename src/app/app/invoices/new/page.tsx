export const dynamic = 'force-dynamic'

import { requireOrganization, prisma } from '@/lib/auth'
import InvoiceBuilderClient from './page.client'

export default async function NewInvoicePage() {
  const { organization } = await requireOrganization()

  const customers = await prisma.customer.findMany({
    where: { organizationId: organization.id },
    select: { id: true, name: true, trn: true }
  })

  const productsData = await prisma.productService.findMany({
    where: { organizationId: organization.id },
    select: { id: true, name: true, defaultUnitPrice: true, vatTreatment: true }
  })
  
  const products = productsData.map(p => ({
    ...p,
    defaultUnitPrice: Number(p.defaultUnitPrice)
  }))

  return <InvoiceBuilderClient customers={customers} products={products} />
}

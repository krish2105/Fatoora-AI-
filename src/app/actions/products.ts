'use server'

import { z } from 'zod'
import { prisma, requireOrganization } from '@/lib/auth'
import { ActionType, ProductType, VatTreatment } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(ProductType),
  unit: z.string().optional(),
  defaultUnitPrice: z.number().min(0),
  vatTreatment: z.nativeEnum(VatTreatment),
})

export async function createProduct(data: z.infer<typeof productSchema>) {
  const { organization, user } = await requireOrganization()
  
  const parsed = productSchema.parse(data)

  const product = await prisma.productService.create({
    data: {
      ...parsed,
      organizationId: organization.id
    }
  })

  await prisma.auditLog.create({
    data: {
      organizationId: organization.id,
      actorUserId: user.id,
      action: ActionType.PRODUCT_CREATED,
      entityType: 'PRODUCT',
      entityId: product.id,
    }
  })

  revalidatePath('/app/products')
  revalidatePath('/app/invoices/new')
  
  return { success: true, productId: product.id }
}

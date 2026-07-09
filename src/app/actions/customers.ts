'use server'

import { z } from 'zod'
import { prisma, requireOrganization } from '@/lib/auth'
import { ActionType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  emirate: z.string().optional(),
  trn: z.string().length(15, "TRN must be exactly 15 digits").regex(/^\d+$/, "TRN must contain only numbers").optional().or(z.literal("")),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
})

export async function createCustomer(data: z.infer<typeof customerSchema>) {
  const { organization, user } = await requireOrganization()
  
  const parsed = customerSchema.parse(data)

  const customer = await prisma.customer.create({
    data: {
      ...parsed,
      organizationId: organization.id
    }
  })

  await prisma.auditLog.create({
    data: {
      organizationId: organization.id,
      actorUserId: user.id,
      action: ActionType.CUSTOMER_CREATED,
      entityType: 'CUSTOMER',
      entityId: customer.id,
    }
  })

  revalidatePath('/app/customers')
  revalidatePath('/app/invoices/new')
  
  return { success: true, customerId: customer.id }
}

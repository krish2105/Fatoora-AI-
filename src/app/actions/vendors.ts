'use server'

import { z } from 'zod'
import { prisma, requireOrganization } from '@/lib/auth'
import { ActionType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const vendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  trn: z.string().length(15, "TRN must be exactly 15 digits").regex(/^\d+$/, "TRN must contain only numbers").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
})

export async function createVendor(data: z.infer<typeof vendorSchema>) {
  const { organization, user } = await requireOrganization()
  
  const parsed = vendorSchema.parse(data)

  const vendor = await prisma.vendor.create({
    data: {
      ...parsed,
      organizationId: organization.id
    }
  })

  await prisma.auditLog.create({
    data: {
      organizationId: organization.id,
      actorUserId: user.id,
      action: ActionType.VENDOR_CREATED,
      entityType: 'VENDOR',
      entityId: vendor.id,
    }
  })

  revalidatePath('/app/vendors')
  revalidatePath('/app/expenses')
  
  return { success: true, vendorId: vendor.id }
}

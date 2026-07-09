'use server'

import { requireOrganization, prisma } from '@/lib/auth'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const companySettingsSchema = z.object({
  name: z.string().min(1, 'Company Name is required'),
  taxRegistrationNumber: z.string().optional(),
  billingAddress: z.string().optional(),
})

export async function updateCompanySettings(data: z.infer<typeof companySettingsSchema>) {
  const { organization } = await requireOrganization()

  const parsed = companySettingsSchema.parse(data)

  await prisma.$transaction([
    prisma.organization.update({
      where: { id: organization.id },
      data: { name: parsed.name }
    }),
    prisma.companyProfile.upsert({
      where: { organizationId: organization.id },
      create: {
        organizationId: organization.id,
        legalName: parsed.name,
        trn: parsed.taxRegistrationNumber || null,
        address: parsed.billingAddress || null,
      },
      update: {
        legalName: parsed.name,
        trn: parsed.taxRegistrationNumber || null,
        address: parsed.billingAddress || null,
      }
    })
  ])

  revalidatePath('/app/settings/company')
}

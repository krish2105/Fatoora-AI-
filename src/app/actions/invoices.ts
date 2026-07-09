'use server'

import { z } from 'zod'
import { prisma, requireOrganization } from '@/lib/auth'
import { canCreateInvoice, canIssueInvoice } from '@/lib/permissions'
import { calculateInvoiceTotals, calculateLineItem } from '@/lib/calculations'
import { InvoiceStatus, VatTreatment, ActionType } from '@prisma/client'

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).default(0),
  vatTreatment: z.nativeEnum(VatTreatment),
})

const createInvoiceSchema = z.object({
  customerId: z.string().min(1),
  issueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  dueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  items: z.array(lineItemSchema).min(1),
  notes: z.string().optional(),
  action: z.enum(['DRAFT', 'ISSUE'])
})

export async function createInvoice(data: z.infer<typeof createInvoiceSchema>) {
  const { organization, role, user } = await requireOrganization()
  
  if (data.action === 'ISSUE' && !canIssueInvoice(role)) {
    throw new Error('You do not have permission to issue invoices')
  }
  if (!canCreateInvoice(role)) {
    throw new Error('You do not have permission to create invoices')
  }

  const parsed = createInvoiceSchema.parse(data)

  // Validate Customer belongs to organization
  const customer = await prisma.customer.findFirst({
    where: { id: parsed.customerId, organizationId: organization.id }
  })
  if (!customer) throw new Error('Customer not found')

  // Server-side calculation
  const totals = calculateInvoiceTotals(parsed.items)

  // Format dates properly
  const issueDate = new Date(parsed.issueDate)
  const dueDate = new Date(parsed.dueDate)

  // Create Invoice
  const invoice = await prisma.invoice.create({
    data: {
      organizationId: organization.id,
      customerId: parsed.customerId,
      issueDate,
      dueDate,
      invoiceNumber: `INV-${Date.now()}`,
      status: parsed.action === 'ISSUE' ? InvoiceStatus.ISSUED : InvoiceStatus.DRAFT,
      subtotal: totals.subtotal,
      vatAmount: totals.totalVat,
      totalAmount: totals.total,
      balanceDue: totals.total,
      notes: parsed.notes,
      lineItems: {
        create: parsed.items.map(item => {
          const lineTotals = calculateLineItem(item)
          return {
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            vatTreatment: item.vatTreatment,
            subtotal: lineTotals.subtotal,
            vatAmount: lineTotals.vatAmount,
            total: lineTotals.total
          }
        })
      }
    }
  })

  // Audit Log
  await prisma.auditLog.create({
    data: {
      organizationId: organization.id,
      actorUserId: user.id,
      action: parsed.action === 'ISSUE' ? ActionType.INVOICE_ISSUED : ActionType.INVOICE_CREATED,
      entityType: 'INVOICE',
      entityId: invoice.id,
      metadata: {
        total: totals.total.toNumber(),
        customerId: parsed.customerId
      }
    }
  })

  return { success: true, invoiceId: invoice.id }
}

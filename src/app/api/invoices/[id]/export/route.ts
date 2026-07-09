import { NextRequest } from 'next/server'
import { requireOrganization, prisma } from '@/lib/auth'
import { canViewFinanceData } from '@/lib/permissions'
import { successResponse, forbiddenResponse, notFoundResponse, errorResponse } from '@/lib/api-response'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { organization, role, user } = await requireOrganization()

    if (!canViewFinanceData(role)) {
      return forbiddenResponse('Unauthorized to view finance data')
    }

    const { id } = await params

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: id,
        organizationId: organization.id
      },
      include: {
        customer: true,
        lineItems: true
      }
    })

    if (!invoice) {
      return notFoundResponse('Invoice not found')
    }

    const orgWithProfile = await prisma.organization.findUnique({
      where: { id: organization.id },
      include: { profile: true }
    })
    
    // Prepare UAE Structured Invoice Export Format
    const exportData = {
      _disclaimer: "Structured export only. Not an official FTA submission.",
      documentType: "Tax Invoice",
      invoiceNumber: invoice.id,
      issueDate: invoice.issueDate?.toISOString() || "",
      dueDate: invoice.dueDate?.toISOString() || "",
      seller: {
        legalName: orgWithProfile?.profile?.legalName || organization.name,
        trn: orgWithProfile?.profile?.trn || "MISSING_TRN",
        address: orgWithProfile?.profile?.address || "MISSING_ADDRESS"
      },
      buyer: {
        legalName: invoice.customer.name,
        trn: invoice.customer.trn,
        address: invoice.customer.address
      },
      totals: {
        subtotal: invoice.subtotal.toNumber(),
        totalVat: invoice.vatAmount.toNumber(),
        totalAmount: invoice.totalAmount.toNumber(),
        currency: "AED"
      },
      lineItems: invoice.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity.toNumber(),
        unitPrice: item.unitPrice.toNumber(),
        discount: item.discount.toNumber(),
        vatTreatment: item.vatTreatment,
        vatAmount: item.vatAmount.toNumber(),
        lineTotal: item.total.toNumber()
      }))
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        organizationId: organization.id,
        actorUserId: user.id,
        action: "STRUCTURED_EXPORT_GENERATED",
        entityType: "INVOICE",
        entityId: invoice.id,
        metadata: { timestamp: new Date().toISOString() }
      }
    })

    return successResponse(exportData)
  } catch (err: any) {
    return errorResponse(err.message, 500)
  }
}

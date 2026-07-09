import { NextResponse } from 'next/server'
import { requireOrganization, prisma } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { organization } = await requireOrganization()
    
    const invoice = await prisma.invoice.findFirst({
      where: { 
        id,
        organizationId: organization.id
      },
      include: {
        customer: true,
        lineItems: true,
        organization: {
          include: { profile: true }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Format as UAE structured e-invoice data (simplified example)
    const structuredData = {
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      supplier: {
        name: invoice.organization.name,
        trn: invoice.organization.profile?.trn || '',
      },
      customer: {
        name: invoice.customer?.name,
        trn: invoice.customer?.trn,
        email: invoice.customer?.email,
      },
      totals: {
        subtotal: invoice.subtotal,
        vatAmount: invoice.vatAmount,
        totalAmount: invoice.totalAmount,
        balanceDue: invoice.balanceDue,
      },
      lineItems: invoice.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatTreatment: item.vatTreatment,
        vatRate: item.vatRate,
        vatAmount: item.vatAmount,
        totalAmount: item.total
      })),
      notes: invoice.notes,
      createdAt: invoice.createdAt
    }

    return new NextResponse(JSON.stringify(structuredData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.json"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

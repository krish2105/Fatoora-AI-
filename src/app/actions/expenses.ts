'use server'

import { prisma, requireOrganization } from '@/lib/auth'
import { ActionType } from '@prisma/client'
import { aiProvider } from '@/lib/providers/ai'
import { revalidatePath } from 'next/cache'

export async function extractExpense(fileUrl: string) {
  const { organization, user } = await requireOrganization()

  // 1. Save an extraction job pending by creating a draft expense first
  const expense = await prisma.expense.create({
    data: {
      organizationId: organization.id,
      uploadedById: user.id,
      status: 'DRAFT',
      expenseDate: new Date(),
      amountBeforeVat: 0,
      vatAmount: 0,
      totalAmount: 0,
      category: 'UNCATEGORIZED',
      attachments: {
        create: {
          fileName: 'Uploaded Receipt',
          mimeType: 'application/octet-stream', // Could parse from URL
          fileSize: 0,
          storageKey: fileUrl,
          url: fileUrl
        }
      }
    }
  })

  const job = await prisma.aiExtractionJob.create({
    data: {
      expenseId: expense.id,
      status: 'PROCESSING'
    }
  })

  try {
    // 2. Call AI Provider
    const extraction = await aiProvider.extractExpenseDocument(fileUrl)

    // 3. Update job as complete
    await prisma.aiExtractionJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        rawOutput: extraction as any,
        confidence: extraction.confidence
      }
    })

    // 4. (Optional) Auto-create Expense if confidence is high, or leave for user review
    if (extraction.confidence > 0.8) {
      // Find or create vendor
      let vendorId = null;
      if (extraction.vendorName) {
        let vendor = await prisma.vendor.findFirst({
          where: { organizationId: organization.id, name: extraction.vendorName }
        })
        if (!vendor) {
          vendor = await prisma.vendor.create({
            data: {
              organizationId: organization.id,
              name: extraction.vendorName,
              trn: extraction.trn
            }
          })
        }
        vendorId = vendor.id;
      }

      await prisma.expense.update({
        where: { id: expense.id },
        data: {
          vendorId: vendorId,
          amountBeforeVat: extraction.totalAmount || 0,
          totalAmount: (extraction.totalAmount || 0) + (extraction.vatAmount || 0),
          expenseDate: extraction.date ? new Date(extraction.date) : new Date(),
          category: 'UNCATEGORIZED',
          notes: 'Auto-extracted via AI',
          vatAmount: extraction.vatAmount || 0,
          status: 'PENDING_REVIEW'
        }
      })

      await prisma.auditLog.create({
        data: {
          organizationId: organization.id,
          actorUserId: user.id,
          action: ActionType.EXPENSE_UPLOADED,
          entityType: 'EXPENSE',
          entityId: expense.id,
        }
      })
    }

    revalidatePath('/app/expenses')
    return { success: true }
  } catch (err) {
    await prisma.aiExtractionJob.update({
      where: { id: job.id },
      data: { status: 'FAILED' }
    })
    console.error("Extraction failed", err)
    return { success: false, error: "Extraction failed" }
  }
}

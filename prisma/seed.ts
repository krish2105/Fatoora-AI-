import { PrismaClient, Role, VatTreatment, InvoiceStatus, ExpenseStatus, ActionType, AiJobStatus } from '@prisma/client'
import { Decimal } from 'decimal.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Clear existing
  await prisma.comment.deleteMany()
  await prisma.expenseAttachment.deleteMany()
  await prisma.aiExtractionJob.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.invoicePayment.deleteMany()
  await prisma.invoiceLineItem.deleteMany()
  await prisma.creditNote.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.productService.deleteMany()
  await prisma.companyProfile.deleteMany()
  await prisma.organizationMember.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.auditLog.deleteMany()

  // Plans
  const plans = [
    { name: 'Free', price: new Decimal(0), invoiceLimit: 5, aiExtractionLimit: 0, features: { description: "Basic features for freelancers" } },
    { name: 'Starter', price: new Decimal(99), invoiceLimit: 50, aiExtractionLimit: 50, features: { description: "Perfect for growing businesses" } },
    { name: 'Business', price: new Decimal(199), invoiceLimit: -1, aiExtractionLimit: -1, features: { description: "Unlimited invoicing & AI" } },
    { name: 'Accountant', price: new Decimal(299), invoiceLimit: -1, aiExtractionLimit: -1, features: { description: "Multi-client management" } },
    { name: 'Enterprise', price: new Decimal(999), invoiceLimit: -1, aiExtractionLimit: -1, features: { description: "Custom SLA & dedicated support" } },
  ]
  for (const p of plans) {
    await prisma.plan.create({ data: p })
  }

  const businessPlan = await prisma.plan.findUnique({ where: { name: 'Business' } })

  // Users
  const owner = await prisma.user.create({
    data: {
      clerkId: 'user_owner',
      email: 'owner@fatoora.test',
      firstName: 'Demo',
      lastName: 'Owner',
    }
  })
  
  const accountant = await prisma.user.create({
    data: {
      clerkId: 'user_accountant',
      email: 'accountant@fatoora.test',
      firstName: 'Demo',
      lastName: 'Accountant',
    }
  })

  const viewer = await prisma.user.create({
    data: {
      clerkId: 'user_viewer',
      email: 'viewer@fatoora.test',
      firstName: 'Demo',
      lastName: 'Viewer',
    }
  })

  // Org
  const org = await prisma.organization.create({
    data: {
      name: 'Gulf Trading LLC',
      slug: 'gulf-trading-llc',
      members: {
        create: [
          { userId: owner.id, role: Role.OWNER },
          { userId: accountant.id, role: Role.ACCOUNTANT },
          { userId: viewer.id, role: Role.VIEWER }
        ]
      },
      profile: {
        create: {
          legalName: 'Gulf Trading LLC',
          tradeName: 'Gulf Trading',
          trn: '100000000000003',
          emirate: 'Dubai',
          freezoneOrMainland: 'Mainland',
          businessType: 'General Trading',
          address: 'Sheikh Zayed Road, Dubai',
          email: 'finance@gulftrading.test',
          phone: '+971500000000',
          vatRegistered: true,
          invoicePrefix: 'INV-'
        }
      },
      subscription: {
        create: {
          planId: businessPlan!.id,
          status: 'ACTIVE',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    }
  })

  // 8 Customers
  const customers = []
  for (let i = 1; i <= 8; i++) {
    customers.push(await prisma.customer.create({
      data: {
        name: `Customer ${i} LLC`,
        contactName: `Contact ${i}`,
        email: `contact${i}@customer${i}.test`,
        trn: `20000000000000${i}`,
        organizationId: org.id
      }
    }))
  }

  // 8 Vendors
  const vendors = []
  for (let i = 1; i <= 8; i++) {
    vendors.push(await prisma.vendor.create({
      data: {
        name: `Vendor ${i} LLC`,
        trn: `30000000000000${i}`,
        category: 'Supplies',
        organizationId: org.id
      }
    }))
  }

  // 12 Products/Services
  const products = []
  for (let i = 1; i <= 12; i++) {
    let vatTreatment: VatTreatment = VatTreatment.STANDARD_5
    if (i % 4 === 0) vatTreatment = VatTreatment.ZERO_RATED
    else if (i % 5 === 0) vatTreatment = VatTreatment.EXEMPT
    
    products.push(await prisma.productService.create({
      data: {
        name: `Service ${i}`,
        sku: `SRV-${i}`,
        defaultUnitPrice: new Decimal(100 * i),
        vatTreatment,
        organizationId: org.id
      }
    }))
  }

  // 30 Invoices
  for (let i = 1; i <= 30; i++) {
    const cust = customers[i % 8]
    const prod = products[i % 12]
    
    const qty = new Decimal(2)
    const unitPrice = prod.defaultUnitPrice
    const subtotal = qty.mul(unitPrice)
    const vatRate = prod.vatTreatment === VatTreatment.STANDARD_5 ? new Decimal(5) : new Decimal(0)
    const vat = subtotal.mul(vatRate).div(100)
    const total = subtotal.add(vat)

    let status: InvoiceStatus = InvoiceStatus.DRAFT
    let paidAmt = new Decimal(0)
    const pastDays = Math.floor(Math.random() * 60)
    
    if (i % 4 === 0) {
      status = InvoiceStatus.PAID
      paidAmt = total
    } else if (i % 6 === 0) {
      status = InvoiceStatus.OVERDUE
    } else if (i % 7 === 0) {
      status = InvoiceStatus.PARTIALLY_PAID
      paidAmt = total.div(2)
    } else if (i % 2 === 0) {
      status = InvoiceStatus.ISSUED
    }

    const issueDate = new Date(Date.now() - pastDays * 24 * 60 * 60 * 1000)
    const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000)

    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${String(i).padStart(6, '0')}`,
        organizationId: org.id,
        customerId: cust.id,
        issueDate,
        dueDate,
        status,
        subtotal,
        vatAmount: vat,
        totalAmount: total,
        paidAmount: paidAmt,
        balanceDue: total.sub(paidAmt),
        lineItems: {
          create: [
            {
              description: prod.name,
              quantity: qty,
              unitPrice,
              vatTreatment: prod.vatTreatment,
              vatRate,
              subtotal,
              vatAmount: vat,
              total
            }
          ]
        }
      }
    })
  }

  // 30 Expenses
  for (let i = 1; i <= 30; i++) {
    const vend = vendors[i % 8]
    const beforeVat = new Decimal(50 * i)
    const vat = beforeVat.mul(0.05)
    
    let status: ExpenseStatus = ExpenseStatus.APPROVED
    if (i % 5 === 0) status = ExpenseStatus.PENDING_REVIEW
    if (i % 7 === 0) status = ExpenseStatus.REJECTED

    const expense = await prisma.expense.create({
      data: {
        organizationId: org.id,
        vendorId: vend.id,
        expenseDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        invoiceNumber: `EXP-${i}`,
        amountBeforeVat: beforeVat,
        vatAmount: vat,
        totalAmount: beforeVat.add(vat),
        vatRecoverable: true,
        status
      }
    })

    // Add AI Extraction Job for some expenses
    if (i % 3 === 0) {
      await prisma.aiExtractionJob.create({
        data: {
          expenseId: expense.id,
          status: AiJobStatus.COMPLETED,
          confidence: 0.95,
          rawOutput: { note: "Mock AI extraction result" }
        }
      })
    }
  }

  // 20 Audit Logs
  for (let i = 1; i <= 20; i++) {
    await prisma.auditLog.create({
      data: {
        action: ActionType.INVOICE_CREATED,
        entityType: 'Invoice',
        entityId: `inv_mock_${i}`,
        organizationId: org.id,
        actorUserId: owner.id,
        metadata: { info: "Generated by seed script" }
      }
    })
  }

  console.log('✅ Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

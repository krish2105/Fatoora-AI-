import { NextResponse } from 'next/server';
import { requireOrganization, prisma } from '@/lib/auth';
import { format } from 'date-fns';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string[] }> }
) {
  try {
    const { organization } = await requireOrganization();
    const resolvedParams = await params;
    const typePath = resolvedParams.type.join('/');

    let data = '';
    let filename = 'export.csv';
    let contentType = 'text/csv';

    switch (typePath) {
      case 'invoices': {
        const invoices = await prisma.invoice.findMany({
          where: { organizationId: organization.id },
          include: { customer: true }
        });
        data = 'Invoice Number,Customer,Issue Date,Due Date,Status,Subtotal,VAT Amount,Total Amount,Balance Due\n';
        data += invoices.map(inv => 
          `${inv.invoiceNumber},"${inv.customer?.name || ''}",${inv.issueDate ? format(inv.issueDate, 'yyyy-MM-dd') : ''},${inv.dueDate ? format(inv.dueDate, 'yyyy-MM-dd') : ''},${inv.status},${inv.subtotal},${inv.vatAmount},${inv.totalAmount},${inv.balanceDue}`
        ).join('\n');
        filename = 'invoices.csv';
        break;
      }
      case 'customers': {
        const customers = await prisma.customer.findMany({
          where: { organizationId: organization.id }
        });
        data = 'Name,Email,Phone,TRN,Address,Created At\n';
        data += customers.map(c => 
          `"${c.name}","${c.email || ''}","${c.phone || ''}","${c.trn || ''}","${c.address || ''}",${format(c.createdAt, 'yyyy-MM-dd')}`
        ).join('\n');
        filename = 'customers.csv';
        break;
      }
      case 'vendors': {
        const vendors = await prisma.vendor.findMany({
          where: { organizationId: organization.id }
        });
        data = 'Name,Email,Phone,TRN,Address,Created At\n';
        data += vendors.map(v => 
          `"${v.name}","${v.email || ''}","${v.phone || ''}","${v.trn || ''}","${v.address || ''}",${format(v.createdAt, 'yyyy-MM-dd')}`
        ).join('\n');
        filename = 'vendors.csv';
        break;
      }
      case 'products': {
        const products = await prisma.productService.findMany({
          where: { organizationId: organization.id }
        });
        data = 'Name,Description,Default Unit Price,VAT Treatment\n';
        data += products.map(p => 
          `"${p.name}","${p.description || ''}",${p.defaultUnitPrice},${p.vatTreatment}`
        ).join('\n');
        filename = 'products.csv';
        break;
      }
      case 'expenses': {
        const expenses = await prisma.expense.findMany({
          where: { organizationId: organization.id },
          include: { vendor: true }
        });
        data = 'Date,Vendor,Category,Notes,Total Amount,VAT Amount,Status\n';
        data += expenses.map(e => 
          `${format(e.expenseDate, 'yyyy-MM-dd')},"${e.vendor?.name || ''}","${e.category}","${e.notes || ''}",${e.totalAmount},${e.vatAmount},${e.status}`
        ).join('\n');
        filename = 'expenses.csv';
        break;
      }
      case 'reports/profit-loss': {
        data = 'Category,Amount\nRevenue,150000.00\nCost of Goods Sold,40000.00\nGross Profit,110000.00\nOperating Expenses,35000.00\nNet Profit,75000.00\n';
        filename = 'profit-loss-report.csv';
        break;
      }
      case 'reports/aged-receivables': {
        data = 'Customer,0-30 Days,31-60 Days,61-90 Days,90+ Days,Total\nAcme Corp,5000.00,0.00,0.00,0.00,5000.00\nGlobex,0.00,2500.00,0.00,0.00,2500.00\n';
        filename = 'aged-receivables-report.csv';
        break;
      }
      case 'reports/expense-category': {
        data = 'Category,Amount,Percentage\nSoftware Subscriptions,1500.00,15%\nOffice Supplies,500.00,5%\nTravel,3000.00,30%\nMarketing,5000.00,50%\n';
        filename = 'expense-by-category.csv';
        break;
      }
      case 'vat': {
        const invoices = await prisma.invoice.findMany({
          where: { organizationId: organization.id, status: { not: 'VOID' } },
          include: { customer: true, lineItems: true }
        });
        const expenses = await prisma.expense.findMany({
          where: { organizationId: organization.id, status: 'APPROVED', vatRecoverable: true },
          include: { vendor: true }
        });
        
        const { generateFafCsv } = await import('@/lib/e-invoicing/fta-audit-file');
        data = generateFafCsv(invoices, expenses, organization);
        contentType = 'text/csv';
        filename = 'fta-audit-file.csv';
        break;
      }
      case 'invoices/' + typePath.split('/')[1] + '/ubl': {
        const invoiceId = typePath.split('/')[1];
        const invoice = await prisma.invoice.findUnique({
          where: { id: invoiceId, organizationId: organization.id },
          include: { customer: true, lineItems: true }
        });
        if (!invoice) return new NextResponse('Invoice not found', { status: 404 });

        const { generateUblXml } = await import('@/lib/e-invoicing/ubl-builder');
        data = generateUblXml(invoice, organization, invoice.customer);
        contentType = 'application/xml';
        filename = `invoice-${invoice.invoiceNumber}.xml`;
        break;
      }
      default:
        return new NextResponse('Export type not found', { status: 404 });
    }

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

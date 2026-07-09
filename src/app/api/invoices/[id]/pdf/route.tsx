import { NextResponse } from 'next/server'
import { requireOrganization, prisma } from '@/lib/auth'
import { Document, Page, Text, View, StyleSheet, renderToStream } from '@react-pdf/renderer'
import { format } from 'date-fns'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  text: { fontSize: 10, color: '#444' },
  bold: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  table: { marginTop: 20 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, marginBottom: 8 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, marginBottom: 8 },
  col1: { width: '40%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'right' },
  totals: { marginTop: 20, width: '40%', alignSelf: 'flex-end' },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalsTotal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#000' }
})

const InvoicePDF = ({ invoice }: { invoice: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{invoice.organization.name}</Text>
          <Text style={styles.subtitle}>TRN: {invoice.organization.profile?.trn || 'N/A'}</Text>
          <Text style={styles.subtitle}>Dubai, UAE</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.title}>TAX INVOICE</Text>
          <Text style={styles.subtitle}>Invoice #: {invoice.invoiceNumber}</Text>
          <Text style={styles.subtitle}>Issue Date: {invoice.issueDate ? format(invoice.issueDate, 'dd MMM yyyy') : 'N/A'}</Text>
          <Text style={styles.subtitle}>Due Date: {invoice.dueDate ? format(invoice.dueDate, 'dd MMM yyyy') : 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billed To</Text>
        <Text style={styles.text}>{invoice.customer?.name}</Text>
        {invoice.customer?.trn && <Text style={styles.text}>TRN: {invoice.customer.trn}</Text>}
        <Text style={styles.text}>{invoice.customer?.address}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.bold, styles.col1]}>Description</Text>
          <Text style={[styles.bold, styles.col2]}>Qty</Text>
          <Text style={[styles.bold, styles.col3]}>Price</Text>
          <Text style={[styles.bold, styles.col4]}>VAT</Text>
          <Text style={[styles.bold, styles.col5]}>Total</Text>
        </View>
        {invoice.lineItems.map((item: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.text, styles.col1]}>{item.description}</Text>
            <Text style={[styles.text, styles.col2]}>{item.quantity}</Text>
            <Text style={[styles.text, styles.col3]}>{item.unitPrice.toFixed(2)}</Text>
            <Text style={[styles.text, styles.col4]}>{item.vatRate}%</Text>
            <Text style={[styles.text, styles.col5]}>{item.totalAmount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View style={styles.totalsRow}>
          <Text style={styles.text}>Subtotal:</Text>
          <Text style={styles.text}>AED {invoice.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.text}>Total VAT:</Text>
          <Text style={styles.text}>AED {invoice.vatAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalsTotal}>
          <Text style={styles.bold}>Total Due:</Text>
          <Text style={styles.bold}>AED {invoice.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
)

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

    const stream = await renderToStream(<InvoicePDF invoice={invoice} />)

    return new Response(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

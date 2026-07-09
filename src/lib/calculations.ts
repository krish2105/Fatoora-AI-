import Decimal from 'decimal.js'
import { VatTreatment } from '@prisma/client'

// Enforce precise 2 decimal places for currency
export const toCurrency = (val: Decimal.Value): Decimal => new Decimal(val).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)

export interface LineItemInput {
  quantity: number | string | Decimal
  unitPrice: number | string | Decimal
  discount: number | string | Decimal
  vatTreatment: VatTreatment
}

export interface LineItemResult {
  subtotal: Decimal
  vatAmount: Decimal
  total: Decimal
}

export interface InvoiceTotals {
  subtotal: Decimal
  totalVat: Decimal
  total: Decimal
}

const VAT_RATES: Record<VatTreatment, Decimal> = {
  STANDARD_5: new Decimal(0.05),
  ZERO_RATED: new Decimal(0),
  EXEMPT: new Decimal(0),
  OUT_OF_SCOPE: new Decimal(0),
  REVERSE_CHARGE_READY: new Decimal(0),
}

export function calculateLineItem(item: LineItemInput): LineItemResult {
  const qty = new Decimal(item.quantity)
  const price = new Decimal(item.unitPrice)
  const discount = new Decimal(item.discount)

  if (qty.isNegative()) throw new Error('Quantity cannot be negative')
  if (price.isNegative()) throw new Error('Unit price cannot be negative')
  if (discount.isNegative()) throw new Error('Discount cannot be negative')

  const baseAmount = qty.mul(price)
  if (discount.greaterThan(baseAmount)) throw new Error('Discount cannot exceed base amount')

  const subtotal = toCurrency(baseAmount.sub(discount))
  const vatRate = VAT_RATES[item.vatTreatment]
  
  const vatAmount = toCurrency(subtotal.mul(vatRate))
  const total = subtotal.add(vatAmount)

  return { subtotal, vatAmount, total }
}

export function calculateInvoiceTotals(items: LineItemInput[]): InvoiceTotals {
  let subtotal = new Decimal(0)
  let totalVat = new Decimal(0)

  for (const item of items) {
    const result = calculateLineItem(item)
    subtotal = subtotal.add(result.subtotal)
    totalVat = totalVat.add(result.vatAmount)
  }

  const total = subtotal.add(totalVat)

  return {
    subtotal: toCurrency(subtotal),
    totalVat: toCurrency(totalVat),
    total: toCurrency(total)
  }
}

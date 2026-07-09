import { describe, it, expect } from 'vitest'
import { calculateLineItem, calculateInvoiceTotals } from '../src/lib/calculations'
import { VatTreatment } from '@prisma/client'

describe('calculations', () => {
  it('calculates a basic standard line item correctly', () => {
    const result = calculateLineItem({
      quantity: 2,
      unitPrice: 100,
      discount: 0,
      vatTreatment: VatTreatment.STANDARD_5
    })
    
    expect(result.subtotal.toNumber()).toBe(200)
    expect(result.vatAmount.toNumber()).toBe(10)
    expect(result.total.toNumber()).toBe(210)
  })

  it('handles zero-rated items', () => {
    const result = calculateLineItem({
      quantity: 1,
      unitPrice: 500,
      discount: 0,
      vatTreatment: VatTreatment.ZERO_RATED
    })
    
    expect(result.subtotal.toNumber()).toBe(500)
    expect(result.vatAmount.toNumber()).toBe(0)
    expect(result.total.toNumber()).toBe(500)
  })

  it('handles discounts before VAT', () => {
    const result = calculateLineItem({
      quantity: 5,
      unitPrice: 100,
      discount: 50,
      vatTreatment: VatTreatment.STANDARD_5
    })
    
    // 500 - 50 = 450
    // 450 * 0.05 = 22.5
    expect(result.subtotal.toNumber()).toBe(450)
    expect(result.vatAmount.toNumber()).toBe(22.5)
    expect(result.total.toNumber()).toBe(472.5)
  })

  it('throws on negative quantities', () => {
    expect(() => calculateLineItem({
      quantity: -1,
      unitPrice: 100,
      discount: 0,
      vatTreatment: VatTreatment.STANDARD_5
    })).toThrowError('Quantity cannot be negative')
  })

  it('calculates invoice totals for multiple items', () => {
    const totals = calculateInvoiceTotals([
      { quantity: 1, unitPrice: 100, discount: 0, vatTreatment: VatTreatment.STANDARD_5 }, // 100 + 5
      { quantity: 1, unitPrice: 200, discount: 0, vatTreatment: VatTreatment.ZERO_RATED }  // 200 + 0
    ])

    expect(totals.subtotal.toNumber()).toBe(300)
    expect(totals.totalVat.toNumber()).toBe(5)
    expect(totals.total.toNumber()).toBe(305)
  })
})

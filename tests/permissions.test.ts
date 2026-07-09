import { describe, it, expect } from 'vitest'
import { 
  canManageBilling, 
  canCreateInvoice, 
  canExportVat, 
  canReviewExpenses,
  canDeleteOrganization
} from '../src/lib/permissions'
import { Role } from '@prisma/client'

describe('permissions', () => {
  describe('canManageBilling', () => {
    it('allows OWNER and SYSTEM_ADMIN', () => {
      expect(canManageBilling(Role.OWNER)).toBe(true)
      expect(canManageBilling(Role.SYSTEM_ADMIN)).toBe(true)
    })
    it('denies ACCOUNTANT and VIEWER', () => {
      expect(canManageBilling(Role.ACCOUNTANT)).toBe(false)
      expect(canManageBilling(Role.VIEWER)).toBe(false)
      expect(canManageBilling(Role.FINANCE_MANAGER)).toBe(false)
    })
  })

  describe('canExportVat', () => {
    it('allows ACCOUNTANT and FINANCE_MANAGER', () => {
      expect(canExportVat(Role.ACCOUNTANT)).toBe(true)
      expect(canExportVat(Role.FINANCE_MANAGER)).toBe(true)
    })
    it('denies VIEWER', () => {
      expect(canExportVat(Role.VIEWER)).toBe(false)
    })
  })

  describe('canDeleteOrganization', () => {
    it('strictly denies ADMIN and ACCOUNTANT', () => {
      expect(canDeleteOrganization(Role.ADMIN)).toBe(false)
      expect(canDeleteOrganization(Role.ACCOUNTANT)).toBe(false)
    })
    it('allows OWNER', () => {
      expect(canDeleteOrganization(Role.OWNER)).toBe(true)
    })
  })
})

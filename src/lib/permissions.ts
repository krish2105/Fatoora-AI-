import { Role } from '@prisma/client'

// strict role permissions:
// OWNER: everything
// ADMIN: finance data, team, company settings
// FINANCE_MANAGER: customers, vendors, products, invoices, expenses, reports
// ACCOUNTANT: review/export/comment only, no billing/delete organization
// VIEWER: read-only
// SYSTEM_ADMIN: internal admin only

export const canManageBilling = (role: Role) => ['OWNER', 'SYSTEM_ADMIN'].includes(role)
export const canManageTeam = (role: Role) => ['OWNER', 'ADMIN', 'SYSTEM_ADMIN'].includes(role)
export const canDeleteOrganization = (role: Role) => ['OWNER', 'SYSTEM_ADMIN'].includes(role)
export const canUpdateCompanySettings = (role: Role) => ['OWNER', 'ADMIN', 'SYSTEM_ADMIN'].includes(role)

export const canCreateInvoice = (role: Role) => ['OWNER', 'ADMIN', 'FINANCE_MANAGER', 'SYSTEM_ADMIN'].includes(role)
export const canIssueInvoice = (role: Role) => ['OWNER', 'ADMIN', 'FINANCE_MANAGER', 'SYSTEM_ADMIN'].includes(role)
export const canVoidInvoice = (role: Role) => ['OWNER', 'ADMIN', 'FINANCE_MANAGER', 'SYSTEM_ADMIN'].includes(role)
export const canRecordPayment = (role: Role) => ['OWNER', 'ADMIN', 'FINANCE_MANAGER', 'SYSTEM_ADMIN'].includes(role)

export const canManageExpenses = (role: Role) => ['OWNER', 'ADMIN', 'FINANCE_MANAGER', 'SYSTEM_ADMIN'].includes(role)
export const canReviewExpenses = (role: Role) => ['OWNER', 'ADMIN', 'FINANCE_MANAGER', 'ACCOUNTANT', 'SYSTEM_ADMIN'].includes(role)

export const canExportVat = (role: Role) => ['OWNER', 'ADMIN', 'FINANCE_MANAGER', 'ACCOUNTANT', 'SYSTEM_ADMIN'].includes(role)
export const canComment = (role: Role) => ['OWNER', 'ADMIN', 'FINANCE_MANAGER', 'ACCOUNTANT', 'SYSTEM_ADMIN'].includes(role)

export const canAccessAdmin = (role: Role) => ['SYSTEM_ADMIN'].includes(role)

export const canViewFinanceData = (role: Role) => true // All authenticated members can view

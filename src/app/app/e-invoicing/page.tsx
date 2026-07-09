export const dynamic = 'force-dynamic'

import { requireOrganization, prisma } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

export default async function EInvoicingReadinessPage() {
  const { organization } = await requireOrganization()

  const orgWithProfile = await prisma.organization.findUnique({
    where: { id: organization.id },
    include: { profile: true }
  })

  // Checklist criteria
  const checks = {
    legalName: !!orgWithProfile?.profile?.legalName,
    address: !!orgWithProfile?.profile?.address,
    trn: !!orgWithProfile?.profile?.trn,
    // Just mock some advanced checks based on DB states
    customersWithTRN: await prisma.customer.count({ where: { organizationId: organization.id, trn: { not: null } } }) > 0,
    hasIssuedInvoice: await prisma.invoice.count({ where: { organizationId: organization.id, status: 'ISSUED' } }) > 0,
  }

  const checkKeys = Object.keys(checks) as Array<keyof typeof checks>
  const passed = checkKeys.filter(k => checks[k]).length
  const total = checkKeys.length
  const score = Math.round((passed / total) * 100)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">E-Invoicing Readiness Center</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress towards UAE FTA e-invoicing compliance. 
          <strong> Note: This is an assessment tool, not an official FTA submission portal.</strong>
        </p>
      </div>

      <Card className="bg-slate-50 dark:bg-slate-900 border-primary/20">
        <CardHeader>
          <CardTitle>Readiness Score</CardTitle>
          <CardDescription>Your current compliance level for Phase 1 structured exports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-black text-primary">{score}%</span>
            <span className="text-sm font-medium px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
              {score === 100 ? 'Ready' : 'Action Required'}
            </span>
          </div>
          <Progress value={score} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {checks.legalName ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
              <span>Company Legal Name Registered</span>
            </div>
            <div className="flex items-center gap-3">
              {checks.address ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
              <span>Complete Billing Address</span>
            </div>
            <div className="flex items-center gap-3">
              {checks.trn ? <CheckCircle2 className="text-emerald-500" /> : <AlertTriangle className="text-amber-500" />}
              <span>Tax Registration Number (TRN) Added</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Operational Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {checks.customersWithTRN ? <CheckCircle2 className="text-emerald-500" /> : <AlertTriangle className="text-amber-500" />}
              <span>B2B Customers have TRNs on file</span>
            </div>
            <div className="flex items-center gap-3">
              {checks.hasIssuedInvoice ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
              <span>Successfully issued structured invoice</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" />
              <span>Structured JSON Export Available</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="font-semibold">Accredited Service Provider (ASP) Integration</h3>
          <p className="text-sm text-muted-foreground">
            Fatoora AI provides structured JSON exports to help you prepare. To officially submit invoices to the FTA, you will need to connect with an Accredited Service Provider. Integration options will appear here in the future.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

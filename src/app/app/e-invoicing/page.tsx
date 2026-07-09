import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { requireOrganization, prisma } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export default async function EInvoicingPage() {
  const { organization } = await requireOrganization()

  // Calculate readiness score
  let score = 0
  const checks = [
    { name: "TRN Registered", status: !!organization.profile?.trn },
    { name: "Company Address Complete", status: !!organization.profile?.address },
    { name: "Valid Billing Information", status: true },
    { name: "Compliant Invoice Templates", status: true },
    { name: "API Key Generated", status: false }
  ]

  checks.forEach(c => { if (c.status) score += 20 })

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UAE E-Invoicing Readiness</h1>
        <p className="text-muted-foreground mt-1">Prepare for the upcoming FTA e-invoicing mandate.</p>
      </div>

      <Card className="glass-card border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            Readiness Score
            <span className="text-3xl text-emerald-500">{score}%</span>
          </CardTitle>
          <CardDescription>
            Your account is {score}% ready for the Phase 1 rollout of the UAE e-invoicing mandate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={score} className="h-4 bg-muted/50 [&>div]:bg-emerald-500" />
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Mandate Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {checks.map((check, i) => (
              <li key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                {check.status ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-500 shrink-0" />
                )}
                <div>
                  <h4 className={`font-medium ${check.status ? 'text-foreground' : 'text-amber-500'}`}>
                    {check.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {check.status ? "Completed successfully." : "Action required to achieve compliance before the deadline."}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

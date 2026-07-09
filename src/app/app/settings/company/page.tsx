import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { requireOrganization, prisma } from "@/lib/auth";
import { CompanySettingsForm } from "@/components/forms/company-settings-form";

export const dynamic = 'force-dynamic'

export default async function SettingsCompanyPage() {
  const { organization } = await requireOrganization();
  const profile = await prisma.companyProfile.findUnique({
    where: { organizationId: organization.id }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
      </div>
      <Card className="glass-card max-w-2xl">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Manage your legal entity name, TRN, and billing address.</CardDescription>
        </CardHeader>
        <CardContent>
          <CompanySettingsForm organization={organization} profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}

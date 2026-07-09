import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireOrganization, prisma } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const { organization } = await requireOrganization()

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your company profile and preferences.</p>
      </div>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>This information will appear on your invoices and reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" defaultValue={organization.name} className="bg-background/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trn">Tax Registration Number (TRN)</Label>
                <Input id="trn" defaultValue={organization.profile?.trn || ''} placeholder="e.g. 100000000000003" className="bg-background/50 border-border" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Registered Address</Label>
                <Input id="address" defaultValue={organization.profile?.address || ''} placeholder="Building, Street, Emirate" className="bg-background/50 border-border" />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

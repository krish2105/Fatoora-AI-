import { requireOrganization } from "@/lib/auth";
import { getProviderStatus, isProduction, isDevelopmentMockAuthEnabled } from "@/lib/env";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

export default async function SystemAdminPage() {
  const org = await requireOrganization();
  
  if (org.role !== "SYSTEM_ADMIN" && org.user.clerkId !== 'system_admin') {
    // Basic guard: If not system admin, redirect to normal dashboard
    redirect('/app/dashboard');
  }

  const status = getProviderStatus();

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">Monitor production provider status and system health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-2">
              {isProduction() ? "Production" : "Development"}
            </div>
            {isDevelopmentMockAuthEnabled() && (
              <Badge variant="destructive">⚠️ Mock Auth Enabled</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900 capitalize">{status.auth}</span>
              {status.auth === "mock" ? <Badge variant="secondary">Mock</Badge> : <Badge variant="default" className="bg-emerald-600">Active</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900 capitalize">{status.database}</span>
              <Badge variant="default" className="bg-emerald-600">Connected</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Storage Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900 capitalize">{status.storage}</span>
              {status.storage === "mock" ? <Badge variant="secondary">Mock</Badge> : <Badge variant="default" className="bg-emerald-600">Active</Badge>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Email Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900 capitalize">{status.email}</span>
              {status.email === "mock" ? <Badge variant="secondary">Mock</Badge> : <Badge variant="default" className="bg-emerald-600">Active</Badge>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">AI / OCR Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900 capitalize">{status.ai}</span>
              {status.ai === "mock" ? <Badge variant="secondary">Mock</Badge> : <Badge variant="default" className="bg-emerald-600">Active</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Billing Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900 capitalize">{status.billing}</span>
              {status.billing === "mock" ? <Badge variant="secondary">Mock</Badge> : <Badge variant="default" className="bg-emerald-600">Active</Badge>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

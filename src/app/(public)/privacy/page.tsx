import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <Card>
        <CardContent className="prose prose-slate pt-6">
          <p className="text-sm text-slate-500 italic mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          <h2>1. Information We Collect</h2>
          <p>This is a placeholder privacy policy. In a real deployment, you would detail the collection of user, financial, and organizational data here.</p>
          <h2>2. How We Use Your Data</h2>
          <p>Data is used exclusively to provide the Fatoora AI invoicing and expense tracking service.</p>
          <h2>3. Data Security</h2>
          <p>We implement industry-standard security measures. However, as an MVP placeholder, Fatoora AI makes no legal guarantees.</p>
        </CardContent>
      </Card>
    </div>
  );
}

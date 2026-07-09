import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products & Services</h1>
        <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Manage standard pricing and VAT rates for your offerings.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-slate-500">
          Product Management MVP is coming soon.
        </CardContent>
      </Card>
    </div>
  );
}

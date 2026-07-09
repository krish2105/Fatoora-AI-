"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProduct } from "@/app/actions/products"

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["PRODUCT", "SERVICE"]),
  unit: z.string().optional(),
  defaultUnitPrice: z.number().min(0),
  vatTreatment: z.enum(["STANDARD_5", "ZERO_RATED", "EXEMPT", "OUT_OF_SCOPE", "REVERSE_CHARGE_READY"]),
})

type ProductFormValues = z.infer<typeof productSchema>

export function ProductForm({ trigger }: { trigger: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", sku: "", description: "", type: "SERVICE", unit: "hours", defaultUnitPrice: 0, vatTreatment: "STANDARD_5" }
  })

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await createProduct(data)
      if (res.success) {
        setOpen(false)
        reset()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Product or Service</SheetTitle>
          <SheetDescription>Create catalog items for quick invoicing.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input id="name" {...register("name")} placeholder="Consulting Hours" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU / Code</Label>
              <Input id="sku" {...register("sku")} placeholder="SRV-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select id="type" {...register("type")} className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                <option value="SERVICE">Service</option>
                <option value="PRODUCT">Product</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultUnitPrice">Default Price (AED)</Label>
              <Input id="defaultUnitPrice" type="number" step="0.01" {...register("defaultUnitPrice", { valueAsNumber: true })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit (e.g. hours, pcs)</Label>
              <Input id="unit" {...register("unit")} placeholder="hours" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vatTreatment">VAT Treatment</Label>
            <select id="vatTreatment" {...register("vatTreatment")} className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
              <option value="STANDARD_5">Standard 5%</option>
              <option value="ZERO_RATED">Zero Rated</option>
              <option value="EXEMPT">Exempt</option>
              <option value="OUT_OF_SCOPE">Out of Scope</option>
              <option value="REVERSE_CHARGE_READY">Reverse Charge</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} placeholder="Item description for invoice..." />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? "Saving..." : "Save Item"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

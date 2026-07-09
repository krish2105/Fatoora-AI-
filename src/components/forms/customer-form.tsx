"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCustomer } from "@/app/actions/customers"

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactName: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  emirate: z.string().optional(),
  trn: z.string().length(15, "TRN must be exactly 15 digits").regex(/^\d+$/, "TRN must contain only numbers").optional().or(z.literal("")),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

export function CustomerForm({ trigger }: { trigger: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", trn: "", phone: "", address: "", emirate: "", contactName: "", paymentTerms: "", notes: "" }
  })

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await createCustomer(data)
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
          <SheetTitle>Add Customer</SheetTitle>
          <SheetDescription>Create a new customer profile for invoicing.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name *</Label>
            <Input id="name" {...register("name")} placeholder="Acme Corp" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Person</Label>
              <Input id="contactName" {...register("contactName")} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trn">TRN (Tax Registration Number)</Label>
              <Input id="trn" {...register("trn")} placeholder="100000000000003" />
              {errors.trn && <p className="text-xs text-red-500">{errors.trn.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="billing@acme.com" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} placeholder="+971 50 123 4567" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} placeholder="123 Business Bay" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emirate">Emirate</Label>
              <Input id="emirate" {...register("emirate")} placeholder="Dubai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input id="paymentTerms" {...register("paymentTerms")} placeholder="Net 30" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...register("notes")} placeholder="Internal notes..." />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

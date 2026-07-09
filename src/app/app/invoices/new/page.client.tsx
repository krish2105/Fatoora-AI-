'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Save, Send } from 'lucide-react'
import Decimal from 'decimal.js'

import { createInvoice } from '@/app/actions/invoices'
import { useRouter } from 'next/navigation'

// Simple Decimal.js wrapper for form calculations
const d = (val: any) => new Decimal(val || 0)

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description required'),
  quantity: z.number().min(0.01),
  unitPrice: z.number().min(0),
  discount: z.number().min(0),
  vatTreatment: z.enum(['STANDARD_5', 'ZERO_RATED', 'EXEMPT', 'OUT_OF_SCOPE', 'REVERSE_CHARGE_READY']),
})

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  issueDate: z.string().min(1, 'Issue date required'),
  dueDate: z.string().min(1, 'Due date required'),
  items: z.array(lineItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
})

type InvoiceFormValues = z.infer<typeof invoiceSchema>

export default function InvoiceBuilderClient({ customers }: { customers: { id: string, name: string, trn: string | null }[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      items: [
        { description: '', quantity: 1, unitPrice: 0, discount: 0, vatTreatment: 'STANDARD_5' }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  const watchItems = watch('items')

  // Calculate Totals dynamically
  let subtotal = new Decimal(0)
  let totalVat = new Decimal(0)

  watchItems?.forEach(item => {
    const qty = d(item.quantity)
    const price = d(item.unitPrice)
    const disc = d(item.discount)
    
    const lineSubtotal = qty.mul(price).sub(disc)
    if (lineSubtotal.isPositive()) {
      subtotal = subtotal.add(lineSubtotal)
      if (item.vatTreatment === 'STANDARD_5') {
        totalVat = totalVat.add(lineSubtotal.mul(0.05))
      }
    }
  })

  const total = subtotal.add(totalVat)

  const onSubmit = async (data: InvoiceFormValues, action: 'DRAFT' | 'ISSUE') => {
    setIsSubmitting(true)
    try {
      await createInvoice({ ...data, action })
      alert('Invoice created successfully!')
      router.push('/app/dashboard') // Redirect back to dashboard for now
    } catch (err: any) {
      console.error(err)
      alert('Error: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Create Invoice</h1>
          <p className="text-slate-400 mt-1">Generate a compliant UAE tax invoice in seconds.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleSubmit((d) => onSubmit(d, 'DRAFT'))} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold border-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all" onClick={handleSubmit((d) => onSubmit(d, 'ISSUE'))} disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" /> Issue Invoice
          </Button>
        </div>
      </div>

      <form className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Form Inputs */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass-panel border-slate-800/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-500 font-bold">1</span>
                </div>
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="customerId" className="text-slate-300">Bill To</Label>
                <Select onValueChange={(v) => control._formValues.customerId = v} {...register('customerId')}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 h-11 focus:ring-emerald-500">
                    <SelectValue placeholder="Select a Customer" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id} className="focus:bg-emerald-500/10 focus:text-emerald-400">
                        {c.name} {c.trn ? <span className="text-slate-500 ml-2 text-xs">TRN: {c.trn}</span> : null}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customerId && <p className="text-rose-500 text-sm">{errors.customerId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate" className="text-slate-300">Issue Date</Label>
                <Input type="date" className="bg-slate-900/50 border-slate-700 h-11 focus:ring-emerald-500" {...register('issueDate')} />
                {errors.issueDate && <p className="text-rose-500 text-sm">{errors.issueDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-slate-300">Due Date</Label>
                <Input type="date" className="bg-slate-900/50 border-slate-700 h-11 focus:ring-emerald-500" {...register('dueDate')} />
                {errors.dueDate && <p className="text-rose-500 text-sm">{errors.dueDate.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-slate-800/60 overflow-hidden">
            <CardHeader className="bg-slate-900/30 border-b border-slate-800/50">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-500 font-bold">2</span>
                  </div>
                  Line Items
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800/50">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-6 transition-all hover:bg-slate-900/30 animate-fade-in relative group">
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-x-4 gap-y-6 items-start">
                      <div className="col-span-12 md:col-span-12 space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">Description</Label>
                        <Input 
                          className="bg-transparent border-0 border-b border-slate-700 rounded-none focus-visible:ring-0 focus-visible:border-emerald-500 px-0 h-10 text-base" 
                          {...register(`items.${index}.description`)} 
                          placeholder="Professional services..." 
                        />
                        {errors.items?.[index]?.description && <p className="text-rose-500 text-xs">{errors.items[index]?.description?.message}</p>}
                      </div>
                      
                      <div className="col-span-6 md:col-span-3 space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">Qty</Label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          className="bg-slate-900/50 border-slate-700" 
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })} 
                        />
                      </div>
                      
                      <div className="col-span-6 md:col-span-4 space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">Price (AED)</Label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          className="bg-slate-900/50 border-slate-700" 
                          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} 
                        />
                      </div>
                      
                      <div className="col-span-12 md:col-span-5 space-y-2">
                        <Label className="text-slate-400 text-xs uppercase tracking-wider">VAT Treatment</Label>
                        <Select onValueChange={(v) => control._formValues.items[index].vatTreatment = v} defaultValue="STANDARD_5">
                          <SelectTrigger className="bg-slate-900/50 border-slate-700">
                            <SelectValue placeholder="Standard 5%" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="STANDARD_5">Standard 5%</SelectItem>
                            <SelectItem value="ZERO_RATED">Zero Rated 0%</SelectItem>
                            <SelectItem value="EXEMPT">Exempt 0%</SelectItem>
                            <SelectItem value="OUT_OF_SCOPE">Out of Scope</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-slate-800/50 bg-slate-900/20">
                <Button type="button" variant="outline" className="w-full border-dashed border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, discount: 0, vatTreatment: 'STANDARD_5' })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Line Item
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-slate-800/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-500 font-bold">3</span>
                </div>
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                {...register('notes')}
                className="flex min-h-[100px] w-full rounded-md border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                placeholder="Payment instructions, terms, or a thank you note..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Summary */}
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <Card className="glass-panel border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
              <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10">
                <CardTitle className="text-lg text-emerald-400 flex items-center justify-between">
                  Invoice Summary
                  <span className="text-xs font-normal text-slate-400 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">Auto-calculated</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-medium text-slate-200">AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">VAT (5%)</span>
                    <span className="font-medium text-slate-200">AED {totalVat.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total Due</span>
                    <p className="text-3xl font-bold text-white tracking-tight">
                      AED {total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-12 text-md" onClick={handleSubmit((d) => onSubmit(d, 'ISSUE'))} disabled={isSubmitting}>
                    {isSubmitting ? "Generating..." : "Issue Final Invoice"}
                  </Button>
                  <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleSubmit((d) => onSubmit(d, 'DRAFT'))} disabled={isSubmitting}>
                    Save as Draft
                  </Button>
                </div>
                
                <div className="text-center pt-2">
                  <p className="text-[10px] text-slate-500">
                    Compliant with UAE Federal Tax Authority guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

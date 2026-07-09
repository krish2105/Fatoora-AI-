'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateCompanySettings } from '@/app/actions/settings'
import { cn } from '@/lib/utils'

const companySettingsSchema = z.object({
  name: z.string().min(1, 'Company Name is required'),
  taxRegistrationNumber: z.string().optional(),
  billingAddress: z.string().optional(),
})

type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>

export function CompanySettingsForm({ organization, profile }: { organization: any, profile: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: organization.name || '',
      taxRegistrationNumber: profile?.trn || '',
      billingAddress: profile?.address || '',
    }
  })

  const onSubmit = async (data: CompanySettingsFormValues) => {
    setIsSubmitting(true)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      await updateCompanySettings(data)
      setSuccessMsg('Settings updated successfully.')
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {successMsg && <div className="p-3 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 rounded-md">{successMsg}</div>}
      {errorMsg && <div className="p-3 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/30 rounded-md">{errorMsg}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">Company Name <span className="text-destructive">*</span></Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxRegistrationNumber">Tax Registration Number (TRN)</Label>
        <Input id="taxRegistrationNumber" {...register("taxRegistrationNumber")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingAddress">Billing Address</Label>
        <textarea 
          id="billingAddress" 
          rows={4} 
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...register("billingAddress")} 
        />
      </div>

      <div className="pt-4 border-t border-border/50 flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}

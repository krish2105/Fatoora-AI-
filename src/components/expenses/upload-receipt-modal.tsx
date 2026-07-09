"use client"

import { useState } from "react"
import { UploadDropzone } from "@/lib/uploadthing"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { extractExpense } from "@/app/actions/expenses"

export function UploadReceiptModal({ trigger }: { trigger: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Receipt</DialogTitle>
          <DialogDescription>
            Upload a receipt or invoice. Fatoora AI will automatically extract the details.
          </DialogDescription>
        </DialogHeader>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
            <p className="text-sm text-muted-foreground">AI is extracting details...</p>
          </div>
        ) : (
          <UploadDropzone
            endpoint="receiptUploader"
            onClientUploadComplete={async (res: any) => {
              setIsProcessing(true)
              if (res && res[0]) {
                await extractExpense(res[0].url)
              }
              setIsProcessing(false)
              setOpen(false)
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface InvoiceTypeProps {
  type: string
  setType: (type: string) => void
}

const invoiceTypes = [
  { value: 'Invoice', label: 'Invoice' },
  { value: 'Receipt', label: 'Receipt' },
  { value: 'Estimate', label: 'Estimate' },
  { value: 'Bill', label: 'Bill' },
  { value: 'Quotation', label: 'Quotation' },
]

export default function InvoiceType({ type, setType }: InvoiceTypeProps) {
  const [open, setOpen] = useState(false)

  const handleChange = (value: string) => {
    setType(value)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="invoice-type" className="text-sm text-gray-500">
        Select type
      </Label>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-bold text-4xl h-auto py-2"
          >
            {type || 'Invoice'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Invoice Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invoice-type" className="text-right">
                Type
              </Label>
              <Select onValueChange={handleChange} defaultValue={type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {invoiceTypes.map((invoiceType) => (
                    <SelectItem key={invoiceType.value} value={invoiceType.value}>
                      {invoiceType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
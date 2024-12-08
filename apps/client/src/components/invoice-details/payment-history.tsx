'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PaymentRecord } from '@/lib/types/invoice-types'


interface PaymentHistoryProps {
  paymentRecords: PaymentRecord[]
}

export default function PaymentHistory({ paymentRecords = [] }: PaymentHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Button
        variant="outline"
        onClick={toggleOpen}
        className="w-full justify-between py-6 text-left font-normal"
      >
        <span>Payment History</span>
        <div className="flex items-center">
          <Badge variant="secondary" className="mr-2">
            {paymentRecords.length}
          </Badge>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </Button>
      {isOpen && (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Paid</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentRecords.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{format(new Date(record.datePaid), 'MMMM do yyyy')}</TableCell>
                  <TableCell>{formatCurrency(record.amountPaid)}</TableCell>
                  <TableCell>{record.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
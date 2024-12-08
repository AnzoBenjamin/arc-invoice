import { useState } from 'react'
import PaymentModal from '@/components/payments/payment-modal'
import { Button } from "@/components/ui/button"
import { InvoiceData } from '@/lib/types/invoice-types'

interface AddPaymentProps {
  invoice: InvoiceData;
  businessName: string;
}

const AddPayment: React.FC<AddPaymentProps> = ({ invoice, businessName }) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Payment</Button>
      <PaymentModal invoice={invoice} businessName={businessName} open={open} setOpen={setOpen} />
    </div>
  )
}

export default AddPayment
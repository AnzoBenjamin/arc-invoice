import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAppDispatch } from '@/hooks/use-redux-types'
import { cn } from "@/lib/utils"
import { updateInvoice } from '@/lib/actions/invoice-actions'
import { InvoiceItem } from "@/lib/types/invoice-types"
const formSchema = z.object({
  amountPaid: z.coerce.number().min(0, "Amount must be positive"),
  datePaid: z.date(),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  note: z.string().optional(),
  paidBy: z.string()
})

interface PaymentModalProps {
  invoice: InvoiceItem;
  businessName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PaymentModal({ invoice, businessName, open, setOpen }: PaymentModalProps) {
  const dispatch = useAppDispatch()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountPaid: (invoice.total || 0) - (invoice.totalAmountReceived || 0),
      datePaid: new Date(),
      paymentMethod: "",
      note: "",
      paidBy: businessName
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    const updatedInvoice = {
      ...invoice,
      status: (invoice.totalAmountReceived || 0 + values.amountPaid) >= (invoice.total || 0) ? 'Paid' : 'Partial',
      paymentRecords: [
        ...(invoice.paymentRecords || []),
        {
          note: values.note || "",
          amountPaid: values.amountPaid!,
          datePaid: values.datePaid!,
          paymentMethod: values.paymentMethod || "",
          paidBy: values.paidBy || "",
        }
      ],
      totalAmountReceived: (invoice.totalAmountReceived || 0) + values.amountPaid
    }
    try{
      if(invoice._id){
        dispatch(updateInvoice(invoice._id, updatedInvoice))
      } 
    } catch(err){
      console.error(err)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Record Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="datePaid"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date paid</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Record</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
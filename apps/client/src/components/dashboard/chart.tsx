import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, TooltipProps, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { ValueType } from "recharts/types/component/DefaultTooltipContent"
import { NameType } from "recharts/types/component/DefaultTooltipContent"
import { PaymentRecord } from "@/lib/types/invoice-types"

interface ChartProps {
  paymentHistory: PaymentRecord[]
}

export default function Chart({ paymentHistory }: ChartProps) {
  const data = paymentHistory.map((payment) => ({
    date: new Date(payment.datePaid).toLocaleDateString(),
    amount: payment.amountPaid
  }))

  return (
    <Card className="w-[90%] mx-auto my-2.5 bg-white text-center p-2.5">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Payment Received",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `UGX${value}`}
              />
              <ChartTooltip
                content={({ active, payload }: TooltipProps<ValueType, NameType>) => {
                  if (active && payload && payload.length) {
                    return (
                      <div>
                        <p className="text-sm">{payload[0].payload.date}</p>
                        <p className="font-bold text-lg">UGX{payload[0].value}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
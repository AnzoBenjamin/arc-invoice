import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Invoice {
  id: string;  // or number, depending on your ID type
  amount: number;
  // Add any other properties your invoice might have
}

interface DonutProps {
  unpaid: Invoice[];
  paid: Invoice[];
  partial: Invoice[];
}

export default function Donut({ unpaid, paid, partial }: DonutProps) {
  const data = [
    { name: 'Unpaid Invoices', value: unpaid.length },
    { name: 'Paid Invoices', value: paid.length },
    { name: 'Partially Paid', value: partial.length },
  ]

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            unpaid: {
              label: "Unpaid Invoices",
              color: COLORS[0],
            },
            paid: {
              label: "Paid Invoices",
              color: COLORS[1],
            },
            partial: {
              label: "Partially Paid",
              color: COLORS[2],
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        {payload[0].name} - {payload[0].value}
                      </ChartTooltipContent>
                    )
                  }
                  return null
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
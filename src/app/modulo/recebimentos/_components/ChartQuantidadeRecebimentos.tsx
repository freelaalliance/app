'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatarDataBrasil } from '@/lib/utils'

const chartConfig = {
  quantidade: {
    label: 'Entregas',
    color: 'hsl(360, 92%, 35%)',
  },
} satisfies ChartConfig

interface ChartRecebimentoProps {
  dados: {
    dataRecebimento: Date
    quantidade: number
  }[]
  inicial: Date
  final: Date
}

export function ChartRecebimentos({
  dados,
  inicial,
  final,
}: ChartRecebimentoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantidades de entregas</CardTitle>
        <CardDescription>{`${formatarDataBrasil(inicial, false, 'P')} - ${formatarDataBrasil(final, false, 'P')}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={dados}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dataRecebimento"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return formatarDataBrasil(value, false, 'dd/MM/yyyy')
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="quantidade" fill="var(--color-quantidade)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

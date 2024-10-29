'use client'

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

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

interface ChartAvaliacaoRecebimentoProps {
  dados: {
    dataRecebimento: Date
    maximaAvaliacaoEntrega: number
    minimaAvaliacaoEntrega: number
    mediaAvaliacaoEntrega: number
  }[]
  inicial: Date
  final: Date
}

const chartConfig = {
  maximaAvaliacaoEntrega: {
    label: 'Nota máxima',
    color: '#32CD32',
  },
  minimaAvaliacaoEntrega: {
    label: 'Nota mínimo',
    color: 'hsl(360, 92%, 35%)',
  },
  mediaAvaliacaoEntrega: {
    label: 'Nota média',
    color: '#121215',
  },
} satisfies ChartConfig

export function ChartAvaliacaoRecebimento({
  dados,
  inicial,
  final,
}: ChartAvaliacaoRecebimentoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações de entregas</CardTitle>
        <CardDescription>{`${formatarDataBrasil(inicial, false, 'P')} - ${formatarDataBrasil(final, false, 'P')}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={dados}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dataRecebimento"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return formatarDataBrasil(value, false, 'dd/MM/yyyy')
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="maximaAvaliacaoEntrega"
              type="monotone"
              stroke="var(--color-maximaAvaliacaoEntrega)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="minimaAvaliacaoEntrega"
              type="monotone"
              stroke="var(--color-minimaAvaliacaoEntrega)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mediaAvaliacaoEntrega"
              type="monotone"
              stroke="var(--color-mediaAvaliacaoEntrega)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

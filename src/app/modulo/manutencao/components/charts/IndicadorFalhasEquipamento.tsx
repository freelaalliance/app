import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { indicadoresFalhasEquipamentoType } from '../../schemas/ManutencaoSchema'
import { calculaDisponibilidadeEquipamento } from '../../utils/indicadores'

interface IndicadorFalhasChartProps {
  data: indicadoresFalhasEquipamentoType
}

export function IndicadorFalhasEquipamento({
  data: chartData,
}: IndicadorFalhasChartProps) {
  const chartConfig = {
    mtbf: {
      label: 'MTBF',
      color: 'hsl(210, 2%, 21%)',
    },
    mttr: {
      label: 'MTTR',
      color: 'hsl(360, 92%, 35%)',
    },
  } satisfies ChartConfig

  const disponibilidade =
    chartData.mtbf && chartData.mttr
      ? calculaDisponibilidadeEquipamento({
          mttr: chartData.mttr,
          mtbf: chartData.mtbf,
        })
      : 100

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full max-w-[400px]"
    >
      <RadialBarChart
        data={[chartData]}
        endAngle={180}
        innerRadius={85}
        outerRadius={120}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 25}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {`${
                        Number.isNaN(disponibilidade)
                          ? 0
                          : Number(disponibilidade.toFixed(2))
                      } %
                      `}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 45}
                      className="fill-muted-foreground"
                    >
                      Disponibilidade
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="mttr"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-mttr)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="mtbf"
          fill="var(--color-mtbf)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  )
}

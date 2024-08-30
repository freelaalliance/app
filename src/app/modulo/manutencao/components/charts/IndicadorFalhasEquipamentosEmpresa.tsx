"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { indicadoresFalhasEquipamentosEmpresaType } from "../../schemas/ManutencaoSchema"

const chartConfig = {
  mtbf: {
    label: "MTBF",
    color: "hsl(210, 2%, 21%)",
  },
  mttr: {
    label: "MTTR",
    color: "hsl(360, 92%, 35%)",
  },
} satisfies ChartConfig

interface IndicadorFalhaEquipamentosEmpresaProps{
  dados: Array<indicadoresFalhasEquipamentosEmpresaType>,
}

export function IndicadorFalhasEquipamentoEmpresa({dados: chartData}: IndicadorFalhaEquipamentosEmpresaProps) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="equipamento"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 4) + '...'}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="mttr"
          stackId="a"
          fill="var(--color-mttr)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="mtbf"
          stackId="a"
          fill="var(--color-mtbf)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

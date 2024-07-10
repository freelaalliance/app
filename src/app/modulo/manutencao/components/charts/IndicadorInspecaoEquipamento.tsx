'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Label, Pie, PieChart } from "recharts"

interface DadosIndicadorInspecaoProps {
  inspecoes: {
    aberta: number,
    aprovada: number,
    reprovada: number,
    total: number
  }
}

export default function IndicadoresInspecaoEquipamento({inspecoes}: DadosIndicadorInspecaoProps) {

  const chartData = [
    { type: "Em aberto", inspecoes: inspecoes.aberta, fill: "var(--color-aberto)" },
    { type: "Aprovadas", inspecoes: inspecoes.aprovada, fill: "var(--color-aprovada)" },
    { type: "Reprovadas", inspecoes: inspecoes.reprovada, fill: "var(--color-reprovada)" },
  ]

  const chartConfig = {
    inspecoes: {
      label: "Inspeções",
    },
    aberto: {
      label: "Abertas",
      color: "hsl(38, 100%, 41%)",
    },
    aprovada: {
      label: "Aprovadas",
      color: "hsl(123, 100%, 21%)",
    },
    reprovada: {
      label: "Reprovadas",
      color: "hsl(0, 84%, 37%)",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="inspecoes"
          nameKey="type"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="select-none fill-foreground text-4xl font-bold"
                    >
                      {inspecoes.total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="select-none fill-muted-foreground text-center"
                    >
                      Inspeções
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
'use client'

import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { DadosManutencaoEquipamentoType } from "../../schemas/ManutencaoSchema"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import { CardFooter } from "@/components/ui/card"

interface IndicadorMediaEquipamentoParadoProps {
  listaManutencoes: Array<DadosManutencaoEquipamentoType>
}

export default function IndicadoresMediaEquipamentoParado({ listaManutencoes }: IndicadorMediaEquipamentoParadoProps) {
  const manutencoesFinalizadas = listaManutencoes.filter(manutencoes => manutencoes.equipamentoParado !== null)

  const duracoesTotalParadas = manutencoesFinalizadas.reduce((duracaoTotal, manutencoes) => {
    return duracaoTotal + Number(manutencoes.equipamentoParado)
  }, 0)

  const mediaTempoParado: Number = (duracoesTotalParadas / manutencoesFinalizadas.length)

  const chartData = [
    { type: 'parada', media: mediaTempoParado.toFixed(2), fill: 'var(--color-media)' }
  ]

  const chartConfig = {
    parado: {
      label: "Parado",
    },
    media: {
      label: "Média",
      color: "hsl(360, 92%, 35%)",
    },
  } satisfies ChartConfig

  const manutencoesRealizadasMesAtual = listaManutencoes?.filter((manutencoes) => {
    if (manutencoes.finalizadoEm && manutencoes.criadoEm) {
      const dataManutencao = new Date(manutencoes.criadoEm)
      return dataManutencao.getFullYear() === new Date().getFullYear() && dataManutencao.getMonth() === new Date().getMonth()
    }
  })

  const mediaTempoParadoMesAtual = manutencoesRealizadasMesAtual.reduce((duracaoTotal, manutencoes) => {
    return duracaoTotal + Number(manutencoes.equipamentoParado)
  }, 0)

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={250}
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[86, 74]}
          />
          <RadialBar dataKey="media" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                        className="fill-foreground text-4xl font-bold"
                      >
                        {chartData[0].media.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Minutos
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-center">
          {`O tempo médio de equipamento parado este mês é ${(mediaTempoParadoMesAtual / manutencoesRealizadasMesAtual.length).toFixed(2)} minutos`}
        </div>
      </CardFooter>
    </>
  )
}
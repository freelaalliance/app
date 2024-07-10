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

interface IndicadorMediaDuracaoManutencaoProps {
  listaManutencoes: Array<DadosManutencaoEquipamentoType>
}

export default function IndicadoresMediaDuracaoManutencoesEquipamento({ listaManutencoes }: IndicadorMediaDuracaoManutencaoProps) {
  const manutencoesFinalizadas = listaManutencoes.filter(manutencoes => manutencoes.duracao !== null)

  const duracoesTotalManutencoes = manutencoesFinalizadas.reduce((duracaoTotal, manutencoes) => {
    return duracaoTotal + Number(manutencoes.duracao)
  }, 0)

  const mediaDuracao = (duracoesTotalManutencoes / manutencoesFinalizadas.length)

  const chartData = [
    { type: 'manutencao', media: mediaDuracao.toFixed(2), fill: 'var(--color-media)' }
  ]

  const chartConfig = {
    manutencao: {
      label: "Manutenções",
    },
    media: {
      label: "Média",
      color: "hsl(360, 92%, 35%)",
    },
  } satisfies ChartConfig

  const manutencoesRealizadasMesAtual = listaManutencoes?.filter((manutencoes) => {
    if (manutencoes.finalizadoEm && manutencoes.iniciadoEm) {
      const dataManutencao = new Date(manutencoes.iniciadoEm)
      return dataManutencao.getFullYear() === new Date().getFullYear() && dataManutencao.getMonth() === new Date().getMonth()
    }
  })

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
        <div className="flex items-center gap-2 font-medium leading-none">
          {`Neste mês foram realizadas ${manutencoesRealizadasMesAtual?.length} manutenções`}
        </div>
        <div className="leading-none text-muted-foreground">
          {`Neste equipamento possui ${listaManutencoes?.length} registradas`}
        </div>
      </CardFooter>
    </>

  )
}
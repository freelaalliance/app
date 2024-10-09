'use client'

import { formatDuration } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { DadosManutencaoEquipamentoType } from '../../schemas/ManutencaoSchema'

interface IndicadorMediaEquipamentoParadoProps {
  listaManutencoes: Array<DadosManutencaoEquipamentoType>
}

export default function IndicadoresMediaEquipamentoParado({
  listaManutencoes,
}: IndicadorMediaEquipamentoParadoProps) {
  const manutencoesFinalizadas = listaManutencoes.filter(
    (manutencoes) => manutencoes.equipamentoParado !== null,
  )

  const duracoesTotalParadas = manutencoesFinalizadas.reduce(
    (duracaoTotal, manutencoes) => {
      return duracaoTotal + Number(manutencoes.equipamentoParado)
    },
    0,
  )

  const duracoesTotalOperando = manutencoesFinalizadas.reduce(
    (duracaoTotal, manutencoes) => {
      return duracaoTotal + Number(manutencoes.tempoMaquinaOperacao)
    },
    0,
  )

  const chartData = [
    { parado: duracoesTotalParadas, operando: duracoesTotalOperando },
  ]

  const chartConfig = {
    parado: {
      label: 'Parado',
      color: 'hsl(360, 92%, 35%)',
    },
    operando: {
      label: 'Operando',
      color: 'hsl(0, 0%, 15%)',
    },
  } satisfies ChartConfig

  const manutencoesRealizadasMesAtual = listaManutencoes?.filter(
    (manutencoes) => {
      if (manutencoes.finalizadoEm && manutencoes.criadoEm) {
        const dataManutencao = new Date(manutencoes.criadoEm)
        return (
          dataManutencao.getFullYear() === new Date().getFullYear() &&
          dataManutencao.getMonth() === new Date().getMonth()
        )
      }

      return null
    },
  )

  const somaTotalTempoParadoMesAtual = manutencoesRealizadasMesAtual?.reduce(
    (duracaoTotal, manutencoes) => {
      return duracaoTotal + Number(manutencoes.equipamentoParado)
    },
    0,
  )

  const mediaTempoParadoMesAtual = isNaN(somaTotalTempoParadoMesAtual)
    ? 0
    : somaTotalTempoParadoMesAtual / manutencoesRealizadasMesAtual.length

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[250px]"
      >
        <RadialBarChart
          data={chartData}
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
                        {formatDuration(
                          { minutes: mediaTempoParadoMesAtual },
                          { format: ['hours', 'minutes'], locale: ptBR },
                        )}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 45}
                        className="fill-muted-foreground"
                      >
                        Média parado
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="parado"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-parado)"
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="operando"
            fill="var(--color-operando)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </>
  )
}

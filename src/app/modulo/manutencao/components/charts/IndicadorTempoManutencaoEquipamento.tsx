'use client'

import { format } from "date-fns"
import { DuracaoManutencoesEquipamentoType } from "../../schemas/ManutencaoSchema"
import { ptBR } from "date-fns/locale"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { CardFooter } from "@/components/ui/card"

interface RankingDuracaoManutencaoProps {
  dados: DuracaoManutencoesEquipamentoType[]
}

export default function RankingDurancaoManutencaoEquipamento({ dados }: RankingDuracaoManutencaoProps) {

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const chartData = meses.flatMap((mes) => {
    const registroManutencao = dados.find(
      (manutencao) => {
        const mesAnoManutencao = manutencao.inicioManutencao.split('-')
        const mesManutencaoFormatado = format(new Date(Number(mesAnoManutencao[0]), Number(mesAnoManutencao[1])), 'MMMMMM', { locale: ptBR })

        if (mesManutencaoFormatado === mes.toLowerCase()) {
          return manutencao
        }
      }
    )

    return [
      {
        mes,
        duracao: registroManutencao ? registroManutencao.duracao : 0,
      },
    ]
  })
  
  const chartConfig = {
    duracao: {
      label: "Min",
      color: "hsl(0, 0%, 15%)",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig

  return (
    <>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            right: 16,
          }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="mes"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <XAxis dataKey="duracao" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" className="capitalize" />}
          />
          <Bar
            dataKey="duracao"
            layout="vertical"
            fill="var(--color-duracao)"
            radius={4}
          >
            <LabelList
              dataKey="mes"
              position="insideLeft"
              offset={8}
              className="fill-[--color-label] capitalize"
              fontSize={12}
            />
            <LabelList

              dataKey="duracao"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-center">
          {`Referencia de ranking ano atual`}
        </div>
      </CardFooter>
    </>
  )
}
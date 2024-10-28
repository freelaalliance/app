'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ChartNoAxesCombined,
  Contact,
  ListCheck,
  Loader2,
  Percent,
} from 'lucide-react'
import { Pie, PieChart } from 'recharts'

import { IndicadorInformativo } from '@/components/IndicadorInfo'
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { buscarResumoFornecedor } from '../api/RelatorioCompras'

export default function PainelFornecedores() {
  const dadosEstatisticasFornecedores = useQuery({
    queryKey: ['dadosEstatisticasFornecedores'],
    queryFn: () => buscarResumoFornecedor(),
    staleTime: Infinity,
  })

  const chartDataCritico = [
    {
      status: 'critico',
      qtd: dadosEstatisticasFornecedores.data?.fornecedoresCriticos.find(
        (statusCritico) => statusCritico.critico === true,
      )?.total,
      fill: 'hsl(360, 92%, 35%)',
    },
    {
      status: 'nao_critico',
      qtd: dadosEstatisticasFornecedores.data?.fornecedoresCriticos.find(
        (statusCritico) => statusCritico.critico === false,
      )?.total,
      fill: 'hsl(0, 0%, 15%)',
    },
  ]

  const chartConfigCritico = {
    status: {
      label: 'Status Fornecedor',
    },
    critico: {
      label: 'Crítico',
      color: 'hsl(360, 92%, 35%)',
    },
    nao_critico: {
      label: 'Não Crítico',
      color: 'hsl(0, 0%, 15%)',
    },
  } satisfies ChartConfig

  const chartDataAprovacao = [
    {
      status: 'aprovado',
      qtd: dadosEstatisticasFornecedores.data?.fornecedoresAprovados.find(
        (statusAprovacao) => statusAprovacao.aprovado === true,
      )?.total,
      fill: 'hsl(360, 92%, 35%)',
    },
    {
      status: 'reprovado',
      qtd: dadosEstatisticasFornecedores.data?.fornecedoresAprovados.find(
        (statusAprovacao) => statusAprovacao.aprovado === false,
      )?.total,
      fill: 'hsl(0, 0%, 15%)',
    },
  ]

  const chartConfigAprovacao = {
    status: {
      label: 'Status Aprovação',
    },
    reprovado: {
      label: 'Reprovados',
      color: 'hsl(360, 92%, 35%)',
    },
    aprovado: {
      label: 'Aprovados',
      color: 'hsl(0, 0%, 15%)',
    },
  } satisfies ChartConfig

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <IndicadorInformativo
          titulo="Fornecedores ativos"
          info={String(dadosEstatisticasFornecedores.data?.totalFornecedores)}
          carregandoInformacao={dadosEstatisticasFornecedores.isLoading}
          icon={Contact}
        />
        <IndicadorInformativo
          titulo="Desempenho médio"
          info={String(dadosEstatisticasFornecedores.data?.mediaDesempenho)}
          carregandoInformacao={dadosEstatisticasFornecedores.isLoading}
          icon={ChartNoAxesCombined}
        />
        <IndicadorInformativo
          titulo="Avaliações realizadas"
          info={String(dadosEstatisticasFornecedores.data?.avaliacoes.total)}
          carregandoInformacao={dadosEstatisticasFornecedores.isLoading}
          icon={ListCheck}
        />
        <IndicadorInformativo
          titulo="Média de avaliações"
          info={String(dadosEstatisticasFornecedores.data?.avaliacoes.media)}
          carregandoInformacao={dadosEstatisticasFornecedores.isLoading}
          icon={Percent}
        />
      </div>
      {dadosEstatisticasFornecedores.isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Status de fornecedores</CardTitle>
              <CardDescription>
                Estatísticas de fornecedores críticos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfigCritico}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartDataCritico}
                    dataKey="qtd"
                    nameKey="status"
                    innerRadius={60}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="status" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/2 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Situação de compra</CardTitle>
              <CardDescription>
                Estatísticas de fornecedores aptos a receber pedidos de compras
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfigAprovacao}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartDataAprovacao}
                    dataKey="qtd"
                    nameKey="status"
                    innerRadius={60}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="status" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/2 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}

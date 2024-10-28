'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, Plus } from 'lucide-react'
import { Bar, BarChart, Label, Rectangle, ReferenceLine, XAxis } from 'recharts'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { AvaliacaoFornecedorType } from '../(api)/FornecedorApi'
import { NovaAvaliacaoCriticoDialog } from '../components/dialogs/NovaAvaliacaoCriticoDialog'

interface EstatisticaAvaliacaoCriticoProps {
  idFornecedor: string
  fornecedorCritico: boolean
  avaliacoes: Array<AvaliacaoFornecedorType>
  carregandoAvaliacoes: boolean
}

export default function ViewEstatisticaAvaliacoesCritico({
  idFornecedor,
  fornecedorCritico,
  avaliacoes,
  carregandoAvaliacoes,
}: EstatisticaAvaliacaoCriticoProps) {
  const dadosAvaliacoes: Array<{
    date: Date
    nota: number
  }> =
    avaliacoes.length > 0
      ? avaliacoes.map((avaliacao) => {
          return {
            date: new Date(avaliacao.avaliadoEm),
            nota: Number(avaliacao.nota),
          }
        })
      : []

  const totalAvaliacao = dadosAvaliacoes.reduce((total, avaliacao) => {
    return total + avaliacao.nota
  }, 0)

  const qtdAvaliacoes = avaliacoes.length

  const mediaAvaliacao =
    dadosAvaliacoes.length > 0
      ? Number((totalAvaliacao / qtdAvaliacoes).toFixed(2))
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
      <div
        className={cn('md:col-span-3', qtdAvaliacoes === 0 && 'md:col-span-5')}
      >
        <Card>
          <CardHeader className="flex flex-col justify-center md:flex-row md:justify-between">
            <div className="space-y-1">
              <CardTitle>
                {carregandoAvaliacoes ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <div className="text-4xl tabular-nums">
                    {`${qtdAvaliacoes} `}
                    <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                      avaliações realizadas
                    </span>
                  </div>
                )}
              </CardTitle>
              <CardDescription>Avaliação Crítico</CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size={'icon'}
                      className="shadow bg-padrao-red hover:bg-red-800"
                      disabled={!fornecedorCritico}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <NovaAvaliacaoCriticoDialog idFornecedor={idFornecedor} />
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Realizar nova avaliação</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            {carregandoAvaliacoes ? (
              <div className="flex flex-row justify-center items-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : avaliacoes.length === 0 ? (
              <p className="text-center text-lg font-medium tracking-normal text-muted-foreground">
                Nenhuma avaliação realizada até o momento.
              </p>
            ) : (
              <ChartContainer
                config={{
                  nota: {
                    label: 'Nota',
                    color: 'hsl(60, 1%, 44%)',
                  },
                }}
              >
                <BarChart
                  accessibilityLayer
                  margin={{
                    left: -4,
                    right: -4,
                  }}
                  data={dadosAvaliacoes}
                >
                  <Bar
                    dataKey="nota"
                    fill="var(--color-nota)"
                    radius={5}
                    fillOpacity={0.6}
                    activeBar={<Rectangle fillOpacity={1} />}
                  />
                  <XAxis
                    dataKey="date"
                    className="capitalize"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    tickFormatter={(value) => {
                      return format(new Date(value), 'P', {
                        locale: ptBR,
                      })
                    }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <ReferenceLine
                    y={mediaAvaliacao}
                    stroke="hsl(0, 0%, 99%)"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                  >
                    <Label
                      position="insideBottomLeft"
                      value="Média avaliações"
                      offset={7}
                      className="font-bold "
                      fill="hsl(var(--muted-foreground))"
                    />
                    <Label
                      position="insideTopLeft"
                      value={`${mediaAvaliacao}%`}
                      className="text-lg font-bold"
                      fill="hsl(var(--muted-foreground))"
                      offset={10}
                      startOffset={100}
                    />
                  </ReferenceLine>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
      <div
        className={cn('flex-1 md:col-span-2', qtdAvaliacoes === 0 && 'hidden')}
      >
        <Card>
          <CardContent>
            <Accordion
              type="single"
              collapsible
              className="w-full overflow-auto max-h-[390.27px]"
            >
              {avaliacoes.map((avaliacao, index) => {
                return (
                  <AccordionItem value={avaliacao.id} key={index}>
                    <AccordionTrigger>{`Avaliado em ${format(
                      new Date(avaliacao.avaliadoEm),
                      'PP',
                      {
                        locale: ptBR,
                      },
                    )}`}</AccordionTrigger>
                    <AccordionContent className="grid">
                      <p className="text-sm font-medium tracking-normal text-muted-foreground">
                        {`Avaliação realizado por ${avaliacao.usuario}`}
                      </p>
                      <p className="text-sm font-medium tracking-normal text-muted-foreground">
                        {`Nota: ${avaliacao.nota}%`}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

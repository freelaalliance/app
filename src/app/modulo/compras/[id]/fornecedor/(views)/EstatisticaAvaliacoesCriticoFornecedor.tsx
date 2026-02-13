'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Bar, BarChart, Label, Rectangle, ReferenceLine, XAxis } from 'recharts'

import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn, formatarDataBrasil } from '@/lib/utils'

import type { AvaliacaoFornecedorType } from '../(api)/FornecedorApi'
import { ExcluirAvaliacaoDialog } from '../components/dialogs/ExcluirAvaliacaoDialog'
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
      ? avaliacoes.map(avaliacao => {
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
                    tickFormatter={value => {
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
          <CardHeader>
            <CardTitle className="text-base">Histórico</CardTitle>
            <CardDescription>Avaliações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded border overflow-auto max-h-[390px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avaliacoes.map(avaliacao => (
                    <TableRow key={avaliacao.id}>
                      <TableCell className="text-sm">
                        {formatarDataBrasil(new Date(avaliacao.avaliadoEm), false, 'P')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {avaliacao.usuario}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {`${avaliacao.nota}%`}
                      </TableCell>
                      <TableCell className="text-sm text-red-600">
                        {formatarDataBrasil(new Date(avaliacao.validade), false, 'P')}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                >
                                  <Trash2 className="size-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Excluir avaliação</p>
                            </TooltipContent>
                          </Tooltip>
                          <ExcluirAvaliacaoDialog
                            avaliacaoId={avaliacao.id}
                            idFornecedor={idFornecedor}
                          />
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

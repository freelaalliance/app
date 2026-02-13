/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  Clock,
  Loader2,
  MessageSquareWarning,
  Pen,
  Plus,
  ShoppingCart,
  TicketX,
  Truck,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import type { z } from 'zod'

import { IndicadorInformativo } from '@/components/IndicadorInfo'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  aplicarMascaraDocumento,
} from '@/lib/utils'

import { buscarPedidosFornecedor } from '../(api)/ComprasApi'
import {
  type AvaliacaoFornecedorType,
  consultarAnexosFornecedor,
  consultarAvaliacoesFornecedor,
  consultarDadosFornecedor,
} from '../(api)/FornecedorApi'
import type { schemaDocumentoForm } from '../../../(schemas)/fornecedores/schema-fornecedor'
import { EdicaoEnderecoFornecedorDialog } from '../components/dialogs/EdicaoEnderecoFornecedorDialog'
import { NovoEmailFornecedorDialog } from '../components/dialogs/NovoEmailFornecedorDialog'
import { NovoTelefoneFornecedorDialog } from '../components/dialogs/NovoTelefoneFornecedorDialog'
import { TabelaEmailsFornecedor } from '../components/tabelas/emails/tabela-email-fornecedores'
import { ColunasPedidosFornecedor } from '../components/tabelas/pedidos/colunas-tabela-pedidos-fornecedor'
import { TabelaPedidos } from '../components/tabelas/pedidos/tabela-pedidos'
import { TabelaTelefonesFornecedor } from '../components/tabelas/telefones/tabela-telefones-fornecedores'
import { ListaAnexosFornecedor } from '../components/lista-anexos-fornecedor'
import { FormularioAnexoFornecedor } from '../components/formulario-anexo-fornecedor'

interface DadosFornecedorProps {
  idFornecedor: string
}

export type AlertaVencimentoType = {
  titulo: string
  mensagem: string
}

export type FormularioAnexoType = z.infer<typeof schemaDocumentoForm>

const EstatisticaAvalicoesFornecedorCritico = dynamic(
  () => import('./EstatisticaAvaliacoesCriticoFornecedor'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  }
)

export default function ViewDadosFornecedores({
  idFornecedor,
}: DadosFornecedorProps) {

  const consultaDadosFornecedor = useQuery({
    queryKey: ['dadosFornecedor', idFornecedor],
    queryFn: () => consultarDadosFornecedor({ id: idFornecedor }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const estatisticasAvaliacaoCritico = useQuery({
    queryKey: ['estatisticasAvaliacoesCritico', idFornecedor],
    queryFn: () => consultarAvaliacoesFornecedor({ id: idFornecedor }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const consultarAnexosFornecedores = useQuery({
    queryKey: ['anexosFornecedor', idFornecedor],
    queryFn: () => consultarAnexosFornecedor({ id: idFornecedor }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const listaPedidosFornecedor = useQuery({
    queryKey: ['pedidosFornecedor', idFornecedor],
    queryFn: () => buscarPedidosFornecedor({ fornecedorId: idFornecedor }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const alertaVencimentoAvaliacao = useMemo(() => {
    if (
      estatisticasAvaliacaoCritico.data?.dados &&
      estatisticasAvaliacaoCritico.data.dados.length > 0
    ) {
      const ultimaAvaliacaoRealizada: AvaliacaoFornecedorType =
        estatisticasAvaliacaoCritico.data.dados[0]

      if (new Date(ultimaAvaliacaoRealizada.validade) <= new Date()) {
        return {
          titulo: 'Avaliação crítica vencida',
          mensagem: `A ultima avaliação realizado em (${format(new Date(ultimaAvaliacaoRealizada.validade), 'P', { locale: ptBR })}) do fornecedor está vencida e enquanto não for realizada uma nova avaliação não estará apto para novos pedidos`,
        }
      }
    }

    return null
  }, [estatisticasAvaliacaoCritico.data?.dados])

  const chartData = [
    {
      fornecedor: consultaDadosFornecedor.data?.dados?.nome ?? '',
      media: consultaDadosFornecedor.data?.dados?.desempenho ?? 0,
      fill: 'var(--color-fornecedor)',
    },
  ]

  const chartConfig = {
    desempenho: {
      label: 'Desempenho',
    },
    fornecedor: {
      label: consultaDadosFornecedor.data?.dados?.nome,
      color: 'hsl(210, 2%, 21%)',
    },
  } satisfies ChartConfig

  return (
    <>
      <div className="flex flex-1 shadow rounded bg-zinc-200 p-4 space-x-2 justify-start items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'link'}
              size={'icon'}
              onClick={() => {
                history.back()
              }}
            >
              <ArrowLeft className="size-5 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar para lista de fornecedores</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">
            {consultaDadosFornecedor.isLoading ? (
              <Skeleton className="w-80 h-4" />
            ) : (
              consultaDadosFornecedor.data?.dados?.nome ||
              'Fornecedor não encontrado'
            )}
          </CardTitle>
          <CardDescription>
            Informações estatísticos do fornecedor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 items-center">
            <div>
              {consultaDadosFornecedor.isLoading ? (
                <ul className="grid space-y-2">
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                </ul>
              ) : (
                <ul className="grid">
                  <li className="flex items-center gap-2">
                    <strong>CPF/CNPJ:</strong>
                    <span>{` ${consultaDadosFornecedor.data?.dados?.documento ? aplicarMascaraDocumento(consultaDadosFornecedor.data?.dados?.documento) : ''}`}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong className="text-muted-foreground">Crítico:</strong>
                    <span>{`${consultaDadosFornecedor.data?.dados?.critico ? 'Sim' : 'Não'}`}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong className="text-muted-foreground">
                      Ultima Avaliação:
                    </strong>
                    <span>{`${consultaDadosFornecedor.data?.dados?.ultimaAvaliacao ? format(new Date(consultaDadosFornecedor.data?.dados?.ultimaAvaliacao), 'P', { locale: ptBR }) : 'Não realizado'}`}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong className="text-muted-foreground">
                      Status Avaliação:
                    </strong>
                    <span>{`${consultaDadosFornecedor.data?.dados?.aprovado ? 'Aprovado' : 'Reprovado'}`}</span>
                  </li>
                </ul>
              )}
            </div>
            <div className="md:col-span-2">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadialBarChart
                  data={chartData}
                  startAngle={0}
                  endAngle={
                    ((consultaDadosFornecedor.data?.dados?.desempenho ?? 0) *
                      360) /
                    100
                  }
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
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
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
                                {`${chartData[0].media.toLocaleString()}%`}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Desempenho
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Avaliações</CardTitle>
          <CardDescription>
            Lista das avaliações realizadas no fornecedor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {alertaVencimentoAvaliacao && (
            <Alert className="bg-yellow-300">
              <MessageSquareWarning className="size-4" />
              <AlertTitle>{alertaVencimentoAvaliacao.titulo}</AlertTitle>
              <AlertDescription>
                {alertaVencimentoAvaliacao.mensagem}
              </AlertDescription>
            </Alert>
          )}
          <EstatisticaAvalicoesFornecedorCritico
            idFornecedor={idFornecedor}
            avaliacoes={estatisticasAvaliacaoCritico.data?.dados ?? []}
            carregandoAvaliacoes={estatisticasAvaliacaoCritico.isLoading}
            fornecedorCritico={
              consultaDadosFornecedor.data?.dados?.critico ?? true
            }
          />
        </CardContent>
      </Card>
      <Tabs defaultValue="pedidos">
        <TabsList className="flex flex-row justify-start overflow-auto md:justify-center">
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="endereco">Endereço</TabsTrigger>
          <TabsTrigger value="telefone">Telefones</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
          <TabsTrigger value="documento">Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="pedidos">
          <Card>
            <CardContent className="space-y-2 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <IndicadorInformativo
                  carregandoInformacao={listaPedidosFornecedor.isLoading}
                  titulo={'Pedidos realizados'}
                  info={String(
                    listaPedidosFornecedor.data?.dados?.filter(
                      pedido => !pedido.cancelado
                    ).length
                  )}
                  icon={ShoppingCart}
                />
                <IndicadorInformativo
                  carregandoInformacao={listaPedidosFornecedor.isLoading}
                  titulo={'Pedidos cancelados'}
                  info={String(
                    listaPedidosFornecedor.data?.dados?.filter(
                      pedido => pedido.cancelado === true
                    ).length ?? 0
                  )}
                  icon={TicketX}
                />
                <IndicadorInformativo
                  carregandoInformacao={listaPedidosFornecedor.isLoading}
                  titulo={'Pedidos não recebido'}
                  info={String(
                    listaPedidosFornecedor.data?.dados?.filter(
                      pedido => pedido.recebido === false && !pedido.cancelado
                    ).length ?? 0
                  )}
                  icon={Clock}
                />
                <IndicadorInformativo
                  carregandoInformacao={listaPedidosFornecedor.isLoading}
                  titulo={'Pedidos recebidos'}
                  info={String(
                    listaPedidosFornecedor.data?.dados?.filter(
                      pedido => pedido.recebido === true
                    ).length ?? 0
                  )}
                  icon={Truck}
                />
              </div>
              <TabelaPedidos
                novoPedido={consultaDadosFornecedor.data?.dados?.aprovado}
                fornecedorId={idFornecedor}
                carregandoPedidos={listaPedidosFornecedor.isLoading}
                listaPedidos={listaPedidosFornecedor.data?.dados ?? []}
                colunasTabela={ColunasPedidosFornecedor}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="endereco">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="space-y-2">
                <CardTitle>Endereço</CardTitle>
                <CardDescription>Localização do fornecedor</CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size={'icon'}
                        className="shadow bg-padrao-red hover:bg-red-800"
                      >
                        <Pen className="size-4" />
                      </Button>
                    </DialogTrigger>
                    <EdicaoEnderecoFornecedorDialog
                      idFornecedor={idFornecedor}
                      endereco={
                        consultaDadosFornecedor.data?.dados?.endereco ?? {
                          logradouro: '',
                          numero: '',
                          complemento: '',
                          bairro: '',
                          cidade: '',
                          estado: '',
                          cep: '',
                        }
                      }
                    />
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar os dados de endereço do fornecedor</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              {consultaDadosFornecedor.isLoading ? (
                <ul className="grid space-y-2">
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                  <li className="flex items-center">
                    <Skeleton className="w-80 h-4" />
                  </li>
                </ul>
              ) : (
                <ul className="grid">
                  <li className="flex items-center gap-2">
                    <strong>Logradouro:</strong>
                    <span>{` ${consultaDadosFornecedor.data?.dados?.endereco?.logradouro ?? ''}`}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong>Número:</strong>
                    <span>{` ${consultaDadosFornecedor.data?.dados?.endereco?.numero ?? ''}`}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong>Bairro:</strong>
                    <span>
                      {` ${consultaDadosFornecedor.data?.dados?.endereco?.bairro ?? ''}`}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong>Cidade:</strong>
                    <span>{` ${consultaDadosFornecedor.data?.dados?.endereco?.cidade ?? ''} - ${consultaDadosFornecedor.data?.dados?.endereco?.estado ?? ''}`}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong>CEP:</strong>
                    <span>{` ${consultaDadosFornecedor.data?.dados?.endereco?.cep ?? ''}`}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong>Complemento:</strong>
                    <span>{` ${consultaDadosFornecedor.data?.dados?.endereco?.complemento ?? 'Não informado'}`}</span>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="telefone">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="space-y-2">
                <CardTitle>Contato</CardTitle>
                <CardDescription>
                  Informações de contato do fornecedor
                </CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        size={'icon'}
                        className="shadow bg-padrao-red hover:bg-red-800"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </DialogTrigger>
                    <NovoTelefoneFornecedorDialog idFornecedor={idFornecedor} />
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar novo telefone</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <TabelaTelefonesFornecedor
                listaTelefones={
                  consultaDadosFornecedor.data?.dados?.telefones ?? []
                }
                carregandoTelefones={consultaDadosFornecedor.isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="email">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="space-y-2">
                <CardTitle>Emails</CardTitle>
                <CardDescription>
                  Informações de emails do fornecedor
                </CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        size={'icon'}
                        className="shadow bg-padrao-red hover:bg-red-800"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </DialogTrigger>
                    <NovoEmailFornecedorDialog idFornecedor={idFornecedor} />
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar novo email</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <TabelaEmailsFornecedor
                listaEmails={consultaDadosFornecedor.data?.dados?.emails ?? []}
                carregandoEmails={consultaDadosFornecedor.isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documento">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="space-y-2">
                <CardTitle>Anexos</CardTitle>
                <CardDescription>Documentos do fornecedor</CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size={'icon'}
                        className="shadow bg-padrao-red hover:bg-red-800"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Adicionar anexo</DialogTitle>
                        <DialogDescription>
                          Selecione um arquivo e adicione uma observação opcional.
                        </DialogDescription>
                      </DialogHeader>
                      <FormularioAnexoFornecedor idFornecedor={idFornecedor} />
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar novo anexo ao fornecedor</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <ListaAnexosFornecedor
                listarAnexos={consultarAnexosFornecedores.data}
                isLoading={consultaDadosFornecedor.isLoading}
                idFornecedor={idFornecedor}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

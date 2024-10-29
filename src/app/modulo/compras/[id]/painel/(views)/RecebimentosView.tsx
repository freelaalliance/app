'use client'

import { useQueryClient } from '@tanstack/react-query'
import { ptBR } from 'date-fns/locale'
import { ArrowBigDownDash, Filter, Percent, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import generatePDF, { Margin, Options, Resolution } from 'react-to-pdf'
import { toast } from 'sonner'

import { IndicadorInformativo } from '@/components/IndicadorInfo'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { formatarDataBrasil } from '@/lib/utils'

import {
  buscarDadosRelatorioRecebimento,
  EstatisticasDadosRecebimentoType,
  ListaDadosRecebimentosType,
} from '../api/RelatorioCompras'
import { ChartAvaliacaoRecebimento } from '../components/ChartAvaliacaoRecebimento'
import { ChartRecebimentos } from '../components/ChartQuantidadeRecebimentos'

export default function PainelRecebimentos() {
  const queryClient = useQueryClient()

  const [carregando, setCarregamento] = useState(false)
  const [listaRecebimentosCompraEmpresas, setListaRecebimentosCompraEmpresas] =
    useState<Array<ListaDadosRecebimentosType>>([])
  const [dadosRecebimentosCompraEmpresas, setDadosRecebimentosCompraEmpresas] =
    useState<EstatisticasDadosRecebimentoType | null>(null)

  const dataAtual = new Date()
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1),
    to: dataAtual,
  })

  const getDadosRelatorioRecebimentos = () =>
    document.getElementById('relatorioRecebimentos')

  const options: Options = {
    method: 'open',
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: 'A4',
      orientation: 'portrait',
    },
  }

  const buscaDadosRelatorioRecebimento = async (
    dataInicial: Date,
    dataFinal: Date,
  ) => {
    try {
      toast.loading('Consultando os dados...')

      setCarregamento(true)
      const listaPedidosEmpresa = await queryClient.fetchQuery({
        queryKey: ['dadosRecebimentosEmpresa', date],
        queryFn: () =>
          buscarDadosRelatorioRecebimento({
            dataInicial,
            dataFinal,
          }),
      })
      setCarregamento(false)
      toast.dismiss()

      setDadosRecebimentosCompraEmpresas(
        listaPedidosEmpresa.estatisticasRecebimentos,
      )
      setListaRecebimentosCompraEmpresas(listaPedidosEmpresa.recebimentos)
    } catch (err) {
      toast.error('Erro ao consultar dados de recebimentos de compras')
    }
  }

  useEffect(() => {
    if (date && date.from && date.to) {
      buscaDadosRelatorioRecebimento(date.from, date.to)
    }
  }, [date])

  return (
    <section>
      <Card>
        <CardHeader className="flex flex-col justify-start md:flex-row md:justify-between">
          <div>
            <CardTitle>Relatório de recebimentos</CardTitle>
            <CardDescription>
              {'Dados estatísticos das compras recebidos do fornecedor'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'sm'}
                  className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2 hidden md:flex"
                  onClick={() =>
                    generatePDF(getDadosRelatorioRecebimentos, options)
                  }
                >
                  <ArrowBigDownDash className="size-5" />
                  {'Baixar PDF'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Baixar PDF</p>
              </TooltipContent>
            </Tooltip>
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      size={'sm'}
                      className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2"
                    >
                      <Filter className="size-4 hidden md:flex" />
                      <span className="flex md:hidden">
                        Filtrar data da entrega
                      </span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filtrar pela data da entrega</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-full overflow-auto h-[300px] md:h-auto">
                <Calendar
                  className="border rounded-sm"
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="space-y-4" id="relatorioRecebimentos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <IndicadorInformativo
              titulo="Recebimentos"
              info={String(
                dadosRecebimentosCompraEmpresas?.totalRecebimentos ?? 0,
              )}
              icon={Truck}
              carregandoInformacao={carregando}
            />
            <IndicadorInformativo
              titulo="Média de avaliações"
              info={`${String(dadosRecebimentosCompraEmpresas?.avaliacao ?? 0)}%`}
              icon={Percent}
              carregandoInformacao={carregando}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <ChartRecebimentos
              final={(date && date.to) ?? new Date()}
              inicial={(date && date.from) ?? new Date()}
              dados={
                dadosRecebimentosCompraEmpresas?.recebimentos.map(
                  (recebimento) => {
                    return {
                      dataRecebimento: new Date(recebimento.data),
                      quantidade: recebimento.quantidade,
                    }
                  },
                ) ?? []
              }
            />
            <ChartAvaliacaoRecebimento
              final={(date && date.to) ?? new Date()}
              inicial={(date && date.from) ?? new Date()}
              dados={
                dadosRecebimentosCompraEmpresas?.recebimentos.map(
                  (recebimento) => {
                    return {
                      dataRecebimento: new Date(recebimento.data),
                      maximaAvaliacaoEntrega:
                        recebimento.maximaAvaliacaoEntrega ?? 0,
                      mediaAvaliacaoEntrega:
                        recebimento.mediaAvaliacaoEntrega ?? 0,
                      minimaAvaliacaoEntrega:
                        recebimento.minimaAvaliacaoEntrega ?? 0,
                    }
                  },
                ) ?? []
              }
            />
          </div>
          <div className="rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto">Pedido</TableHead>
                  <TableHead className="w-2/6">Dt. Entrega</TableHead>
                  <TableHead className="w-3/4">Responsável</TableHead>
                  <TableHead className="w-2/6">NFs</TableHead>
                  <TableHead className="w-2/6">Certificado</TableHead>
                  <TableHead className="w-auto">Avarias</TableHead>
                  <TableHead className="w-auto">Qtd. incorreta</TableHead>
                  <TableHead className="w-auto">Avaliação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaRecebimentosCompraEmpresas.map((entrega) => (
                  <TableRow key={entrega.id}>
                    <TableCell>{entrega.compra.numPedido}</TableCell>
                    <TableCell>
                      {formatarDataBrasil(
                        new Date(entrega.recebidoEm),
                        false,
                        'PP',
                      )}
                    </TableCell>
                    <TableCell>{entrega.usuario.pessoa.nome}</TableCell>
                    <TableCell>
                      {entrega.AvaliacaoRecebimento?.numeroNota ?? '--'}
                    </TableCell>
                    <TableCell>
                      {entrega.AvaliacaoRecebimento?.numeroCertificado ?? '--'}
                    </TableCell>
                    <TableCell>
                      {entrega.AvaliacaoRecebimento?.avaria ? 'Sim' : 'Não'}
                    </TableCell>
                    <TableCell>
                      {entrega.AvaliacaoRecebimento?.quantidadeIncorreta
                        ? 'Sim'
                        : 'Não'}
                    </TableCell>
                    <TableCell>{`${entrega.avaliacaoEntrega}%`}</TableCell>
                  </TableRow>
                )) ?? []}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

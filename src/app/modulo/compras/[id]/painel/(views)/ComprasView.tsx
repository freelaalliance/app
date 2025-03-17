'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ptBR } from 'date-fns/locale'
import {
  ArrowBigDownDash,
  CalendarClock,
  FileText,
  FileX2,
  Filter,
  PackageCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import generatePDF, { Margin, type Options, Resolution } from 'react-to-pdf'

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
import { aplicarMascaraDocumento, formatarDataBrasil } from '@/lib/utils'

import {
  type PedidosEmpresaType,
  buscarListaPedidosEmpresa,
  buscarResumoCompras,
} from '../api/RelatorioCompras'

export default function PainelCompras() {
  const queryClient = useQueryClient()
  const dataAtual = new Date()
  const [listaComprasEmpresas, setListaCompras] = useState<
    Array<PedidosEmpresaType>
  >([])

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1),
    to: dataAtual,
  })

  const resumoEstatisticasCompras = useQuery({
    queryKey: ['resumoEstatisticaCompras'],
    queryFn: () => buscarResumoCompras(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const getDadosRelatorioCompras = () =>
    document.getElementById('relatorioCompras')

  const options: Options = {
    method: 'open',
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: 'A4',
      orientation: 'portrait',
    },
  }

  const ConsultaListaCompras = async (dataInicial: Date, dataFinal: Date) => {
    const listaPedidosEmpresa = await queryClient.fetchQuery({
      queryKey: ['listaFornecedoresEmpresa', date],
      queryFn: () =>
        buscarListaPedidosEmpresa({
          dataInicial,
          dataFinal,
        }),
    })

    setListaCompras(listaPedidosEmpresa)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (date?.from && date.to) {
      ConsultaListaCompras(date.from, date.to)
    }
  }, [date])

  return (
    <section>
      <Card>
        <CardHeader className="flex flex-col justify-start md:flex-row md:justify-between">
          <div>
            <CardTitle>Relatório de compras</CardTitle>
            <CardDescription>
              {'Dados estatísticos das compras realizadas'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'sm'}
                  className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2 hidden md:flex"
                  onClick={() => generatePDF(getDadosRelatorioCompras, options)}
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
                        Filtrar data do pedido
                      </span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filtrar pela data do pedido</p>
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
        <CardContent className="space-y-4" id="relatorioCompras">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <IndicadorInformativo
              titulo="Compras registradas"
              info={String(resumoEstatisticasCompras.data?.totalPedidos)}
              carregandoInformacao={resumoEstatisticasCompras.isLoading}
              icon={FileText}
            />
            <IndicadorInformativo
              titulo="Compras canceladas"
              info={String(resumoEstatisticasCompras.data?.totalCancelados)}
              carregandoInformacao={resumoEstatisticasCompras.isLoading}
              icon={FileX2}
            />
            <IndicadorInformativo
              titulo="Compras recebidas"
              info={String(resumoEstatisticasCompras.data?.totalRecebidos)}
              carregandoInformacao={resumoEstatisticasCompras.isLoading}
              icon={PackageCheck}
            />
            <IndicadorInformativo
              titulo="Compras não recebidas"
              info={String(resumoEstatisticasCompras.data?.totalNaoRecebidos)}
              carregandoInformacao={resumoEstatisticasCompras.isLoading}
              icon={CalendarClock}
            />
          </div>
          <div className="rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto">Pedido</TableHead>
                  <TableHead className="w-2/6">Prazo entrega</TableHead>
                  <TableHead className="w-auto">Entrega parcial</TableHead>
                  <TableHead className="w-auto">Recebido</TableHead>
                  <TableHead className="w-auto">Cancelado</TableHead>
                  <TableHead className="w-3/4">Fornecedor</TableHead>
                  <TableHead className="w-2/6">Documento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaComprasEmpresas.map(pedido => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.numPedido}</TableCell>
                    <TableCell>
                      {formatarDataBrasil(
                        new Date(pedido.prazoEntrega),
                        false,
                        'PP'
                      )}
                    </TableCell>
                    <TableCell>
                      {pedido.permiteEntregaParcial ? 'Sim' : 'Não'}
                    </TableCell>
                    <TableCell>{pedido.recebido ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>{pedido.cancelado ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>{pedido.fornecedor.nome}</TableCell>
                    <TableCell>
                      {aplicarMascaraDocumento(pedido.fornecedor.documento)}
                    </TableCell>
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

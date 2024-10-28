import { ArrowBigDownDash, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import generatePDF, { Margin, Options, Resolution } from 'react-to-pdf'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatarDataBrasil } from '@/lib/utils'

import { VisualizacaoDadosPedidoProps } from '../../(views)/VisualizarDadosPedido'

const PedidoView = dynamic(
  () => import('../../(views)/VisualizarDadosPedido'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

export function VisualizaDadosPedido({
  dadosPedido,
}: VisualizacaoDadosPedidoProps) {
  const getDadosPedido = () => document.getElementById('dadosPedido')

  const options: Options = {
    method: 'open',
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: 'A4',
      orientation: 'portrait',
    },
  }

  return (
    <DialogContent className="max-h-screen max-w-screen-sm md:max-w-screen-lg overflow-auto">
      <DialogHeader>
        <DialogTitle>Detalhes do pedido</DialogTitle>
        <DialogDescription>
          Visualiza os detalhes do pedido e o historico de entregas
        </DialogDescription>
      </DialogHeader>
      <Tabs>
        <TabsList className="w-full">
          <TabsTrigger value="pedido">Pedido</TabsTrigger>
          <TabsTrigger value="entregas">Entregas</TabsTrigger>
        </TabsList>
        <TabsContent value="pedido" className="grid space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={'sm'}
                className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2"
                onClick={() => generatePDF(getDadosPedido, options)}
              >
                <ArrowBigDownDash className="size-5" />
                {'Baixar PDF'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Baixar PDF pedido</p>
            </TooltipContent>
          </Tooltip>
          <Separator />
          <div id="dadosPedido" className="space-y-2">
            <PedidoView dadosPedido={dadosPedido} />
          </div>
        </TabsContent>
        <TabsContent value="entregas" className="grid space-y-2">
          {dadosPedido.recebimento && dadosPedido.recebimento.length > 0 ? (
            <div className="border rounded overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-auto">Data</TableHead>
                    <TableHead className="w-auto">
                      Responsável por receber
                    </TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Certificado</TableHead>
                    <TableHead>Avaria</TableHead>
                    <TableHead>Qtd. Incorreta</TableHead>
                    <TableHead>Avaliação Entrega</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosPedido.recebimento.map((recebimento) => {
                    return (
                      <TableRow key={recebimento.id}>
                        <TableCell>
                          {formatarDataBrasil(
                            new Date(recebimento.dataRecebimento),
                            true,
                          )}
                        </TableCell>
                        <TableCell className="capitalize">
                          {recebimento.usuario}
                        </TableCell>
                        <TableCell>{recebimento.numeroNota}</TableCell>
                        <TableCell>{recebimento.numeroCertificado}</TableCell>
                        <TableCell>
                          {recebimento.avaria ? 'Sim' : 'Não'}
                        </TableCell>
                        <TableCell>
                          {recebimento.quantidadeIncorreta ? 'Sim' : 'Não'}
                        </TableCell>
                        <TableCell>
                          {`${recebimento.avaliacaoEntrega}%`}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full py-4">
              <p className="text-center text-gray-600">
                Nenhuma entrega registrado para esse pedido.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
          >
            Fechar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

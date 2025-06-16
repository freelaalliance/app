'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { axiosInstance } from '@/lib/AxiosLib'
import {
  aplicarMascaraDocumento,
  formatarDataBrasil,
  formatarValorMoeda,
} from '@/lib/utils'
import { ArrowBigDownDash, Loader2 } from 'lucide-react'
import { useState } from 'react'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import type { VendaDetalhada } from '../../../_schemas/vendas.schema'

interface VisualizarFichaVendaProps {
  id: string
  venda: VendaDetalhada
}

export default function VisualizarFichaVenda({ id, venda }: VisualizarFichaVendaProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDownload() {
    try {
      setIsLoading(true)
      toast.loading('Gerando PDF da venda...')

      const response = await axiosInstance.get(`/vendas/${id}/pdf`, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `venda-${id}.pdf`
      link.click()

      window.URL.revokeObjectURL(url)
      toast.dismiss()
      toast.success('PDF gerado com sucesso!')
    } catch (error) {
      toast.error('Erro ao gerar PDF')
      console.error('Erro ao baixar PDF:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className=" py-4">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between">
            <h1 className="text-2xl font-bold">{`Detalhes da Venda #${venda?.numPedido}`}</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'sm'}
                  disabled={!venda || isLoading}
                  className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2"
                  onClick={() => handleDownload()}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin size-5" />
                  ) : (
                    <ArrowBigDownDash className="size-5" />
                  )}
                  {isLoading ? 'Baixando...' : 'Baixar PDF'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Baixar PDF da venda</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator />

          <section className="p-4 bg-white shadow rounded space-y-8">
            <div className="space-y-2 flex flex-row justify-between">
              <div>
                <p>
                  <strong>Código:</strong> {venda?.codigo}
                </p>
                <p>
                  <strong>Data da venda:</strong>{' '}
                  {venda &&
                    formatarDataBrasil(
                      new Date(venda?.cadastradoEm),
                      true,
                      'Pp'
                    )}
                </p>
              </div>
              <div className="size-32 p-2 rounded border">
                <QRCode
                  size={256}
                  style={{
                    height: 'auto',
                    maxWidth: '100%',
                    width: '100%',
                  }}
                  value={`${venda.codigo}`}
                  viewBox={'0 0 256 256'}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col md:flex-row justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Cliente</h2>
                <ul>
                  <li className="flex items-center gap-2">
                    <strong>Nome Fantasia/Razão Social:</strong>
                    <span>{venda?.cliente.pessoa.nome}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <strong>Documento:</strong>
                    <span>
                      {venda &&
                        aplicarMascaraDocumento(venda.cliente.documento)}
                    </span>
                  </li>
                </ul>
                <Separator className="my-2" />
                <article className='text-wrap grid space-y-4'>
                  <h3>Observações do cliente</h3>
                  <p className='text-justify'>{venda?.cliente.observacoes}</p>
                </article>
              </div>

              <div className="space-y-2 w-1/3">
                <h2 className="text-lg font-semibold">Endereço</h2>
                <div className="w-full">
                  {venda?.cliente.pessoa.Endereco ? (
                    <p className="text-sm">
                      {venda?.cliente.pessoa.Endereco.logradouro},{' '}
                      {venda?.cliente.pessoa.Endereco.numero}
                      {venda?.cliente.pessoa.Endereco.complemento &&
                        ` — ${venda?.cliente.pessoa.Endereco.complemento}`}
                      <br />
                      {venda?.cliente.pessoa.Endereco.bairro},{' '}
                      {venda?.cliente.pessoa.Endereco.cidade} -{' '}
                      {venda?.cliente.pessoa.Endereco.estado}
                      <br />
                      CEP: {venda?.cliente.pessoa.Endereco.cep}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Não informado
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="p-4 bg-white shadow rounded space-y-2">
            <h2 className="text-xl font-semibold">Itens da Venda</h2>

            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-auto">#</TableHead>
                    <TableHead className="w-3/4">Nome</TableHead>
                    <TableHead className="w-auto">Qtd.</TableHead>
                    <TableHead className="w-auto">Preço</TableHead>
                    <TableHead className="w-auto">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venda?.itensVenda.map((item, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.produtoServico.nome}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>
                        {formatarValorMoeda(item.produtoServico.preco)}
                      </TableCell>
                      <TableCell>
                        {formatarValorMoeda(
                          item.quantidade * Number(item.produtoServico.preco)
                        )}
                      </TableCell>
                    </TableRow>
                  )) ?? []}
                </TableBody>
                <TableFooter>
                  <TableRow className='px-6'>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell colSpan={1} className="mr-10">
                      {formatarValorMoeda(
                        venda?.itensVenda.reduce(
                          (acc, item) =>
                            acc +
                            item.quantidade * Number(item.produtoServico.preco),
                          0
                        )
                      )}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </section>

          <section className="p-4 bg-white shadow rounded space-y-2">
            <h2 className="text-xl font-semibold">Complementos</h2>
            <div className="space-y-1">
              <p>
                <strong>Entrega parcial:</strong>{' '}
                {venda?.permiteEntregaParcial ? 'Sim' : 'Não'}
              </p>
              <p>
                <strong>Prazo de entrega:</strong>{' '}
                {venda &&
                  formatarDataBrasil(new Date(venda.prazoEntrega), false, 'P')}
              </p>
              <p>
                <strong>Observações:</strong> {venda?.condicoes || '—'}
              </p>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}

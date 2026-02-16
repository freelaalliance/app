'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import {
  aplicarMascaraDocumento,
  formatarDataBrasil,
  formatarValorMoeda,
} from '@/lib/utils'
import { ArrowBigDownDash, Loader2 } from 'lucide-react'
import QRCode from 'react-qr-code'
import type { VendaDetalhada } from '../../../_schemas/vendas.schema'
import { useDownloadPdfVenda } from '../../../_servicos/useVendas'

interface VisualizarFichaVendaProps {
  id: string
  venda: VendaDetalhada
}

interface DetalheItemProps {
  label: string
  valor: string
}

function DetalheItem({ label, valor }: DetalheItemProps) {
  return (
    <li className="flex justify-between items-center gap-2">
      <strong>{label}</strong>
      <span>{valor}</span>
    </li>
  )
}

interface CardInformacaoProps {
  titulo: string
  descricao: string
  children: React.ReactNode
}

function CardInformacao({ titulo, descricao, children }: CardInformacaoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default function VisualizarFichaVenda({
  id,
  venda,
}: VisualizarFichaVendaProps) {
  const { mutateAsync: downloadPdf, isPending } = useDownloadPdfVenda(id)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">{`Detalhes da Venda #${venda.numPedido}`}</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'sm'}
              disabled={isPending}
              className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2"
              onClick={() => downloadPdf()}
            >
              {isPending ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <ArrowBigDownDash className="size-5" />
              )}
              {isPending ? 'Baixando...' : 'Baixar PDF'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Baixar PDF da venda</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator />

      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 bg-background rounded-md p-4">
        <div className="size-32 p-2">
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
        <div className="space-y-2 px-4 py-2 flex-1">
          <h3 className="font-medium text-lg">Dados do pedido</h3>
          <Separator />
          <ul className="space-y-1">
            <DetalheItem
              label="Num. do Pedido:"
              valor={String(venda.numPedido)}
            />
            <DetalheItem
              label="Data da Venda:"
              valor={formatarDataBrasil(
                new Date(venda.cadastradoEm),
                true,
                'Pp'
              )}
            />
            <DetalheItem
              label="Cód. do Pedido:"
              valor={venda.codigo ?? ''}
            />
          </ul>
        </div>
      </div>

      <Separator />

      <CardInformacao
        titulo="Cliente"
        descricao="Informações do cliente da venda"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
          <ul className="space-y-1">
            <DetalheItem
              label="Nome Fantasia/Razão Social:"
              valor={venda.cliente.pessoa.nome}
            />
            <DetalheItem
              label="Documento:"
              valor={aplicarMascaraDocumento(venda.cliente.documento)}
            />
          </ul>
          <ul className="space-y-1">
            {venda.cliente.pessoa.Endereco ? (
              <>
                <DetalheItem
                  label="Logradouro:"
                  valor={venda.cliente.pessoa.Endereco.logradouro}
                />
                <DetalheItem
                  label="Número:"
                  valor={venda.cliente.pessoa.Endereco.numero}
                />
                <DetalheItem
                  label="Bairro:"
                  valor={venda.cliente.pessoa.Endereco.bairro}
                />
                <DetalheItem
                  label="Cidade:"
                  valor={`${venda.cliente.pessoa.Endereco.cidade} - ${venda.cliente.pessoa.Endereco.estado}`}
                />
                <DetalheItem
                  label="CEP:"
                  valor={venda.cliente.pessoa.Endereco.cep}
                />
                <DetalheItem
                  label="Complemento:"
                  valor={
                    venda.cliente.pessoa.Endereco.complemento || 'Não informado'
                  }
                />
              </>
            ) : (
              <li className="text-sm text-muted-foreground">
                Endereço não informado
              </li>
            )}
          </ul>
        </div>
      </CardInformacao>

      {venda.cliente.observacoes && (
        <CardInformacao
          titulo="Observações do cliente"
          descricao="Observações registradas sobre o cliente"
        >
          <p className="text-justify whitespace-break-spaces">
            {venda.cliente.observacoes}
          </p>
        </CardInformacao>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Itens da Venda</CardTitle>
          <CardDescription>
            Descrição dos itens e valores do pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {venda.itensVenda.map((item, index) => (
                  <TableRow key={item.produtoServico.id}>
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
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell>
                    {formatarValorMoeda(
                      venda.itensVenda.reduce(
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
        </CardContent>
        <CardFooter>
          <div className="grid space-y-2">
            <div>
              <strong>Prazo para entrega: </strong>
              <span>
                {formatarDataBrasil(new Date(venda.prazoEntrega), false, 'P')}
              </span>
            </div>

            <div>
              <strong>Permite entrega parcial do pedido: </strong>
              <span>{venda.permiteEntregaParcial ? 'Sim' : 'Não'}</span>
            </div>

            {venda.condicoes && (
              <div className="grid">
                <strong>Observações:</strong>
                <blockquote>
                  <p className="ml-2 whitespace-break-spaces">
                    {venda.condicoes}
                  </p>
                </blockquote>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

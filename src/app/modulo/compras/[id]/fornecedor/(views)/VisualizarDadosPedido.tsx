import QRCode from 'react-qr-code'

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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatarDataBrasil, formatarDocumento } from '@/lib/utils'

import type { PedidosFornecedorType } from '../../../(schemas)/compras/schema-compras'

export interface VisualizacaoDadosPedidoProps {
  dadosPedido: PedidosFornecedorType
}

export default function VisualizacaoDadosPedido({
  dadosPedido,
}: VisualizacaoDadosPedidoProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="size-32 p-2 rounded border">
          <QRCode
            size={256}
            style={{
              height: 'auto',
              maxWidth: '100%',
              width: '100%',
            }}
            value={`${dadosPedido.codigo}`}
            viewBox={"0 0 256 256"}
          />
        </div>
        <div className="space-y-2 border rounded px-4 py-2">
          <h3 className="font-medium text-lg">Dados do pedido</h3>
          <Separator />
          <ul>
            <li className="flex items-center gap-2">
              <strong>Num. do Pedido:</strong>
              <span>{dadosPedido.numPedido ?? ''}</span>
            </li>
            <li className="flex items-center gap-2">
              <strong>Data do Pedido:</strong>
              <span>
                {formatarDataBrasil(
                  new Date(dadosPedido.cadastro.dataCadastro)
                )}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <strong>Responsável:</strong>
              <span>{dadosPedido.cadastro.usuario ?? ''}</span>
            </li>
            <li className="flex items-center gap-2">
              <strong>Cód. do Pedido:</strong>
              <span>{dadosPedido.codigo ?? ''}</span>
            </li>
          </ul>
        </div>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Solicitante</CardTitle>
          <CardDescription>
            Informações do solicitante do pedido
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
          <div>
            <ul>
              <li className="flex items-center gap-2">
                <strong>Nome Fantasia/Razão Social:</strong>
                <span>{` ${dadosPedido.empresa?.nome}`}</span>
              </li>
              <li className="flex items-center gap-2">
                <strong>CPF/CNPJ:</strong>
                <span>{` ${dadosPedido.empresa?.documento ? formatarDocumento(dadosPedido.empresa.documento) : ''}`}</span>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li className="flex items-center gap-2">
                <strong>Logradouro:</strong>
                <span>{` ${dadosPedido.empresa?.endereco?.logradouro ?? ''}`}</span>
              </li>
              <li className="flex items-center gap-2">
                <strong>Número:</strong>
                <span>{` ${dadosPedido.empresa?.endereco?.numero ?? ''}`}</span>
              </li>
              <li className="flex items-center gap-2">
                <strong>Bairro:</strong>
                <span>{` ${dadosPedido.empresa?.endereco?.bairro ?? ''}`}</span>
              </li>
              <li className="flex items-center gap-2">
                <strong>Cidade:</strong>
                <span>{` ${dadosPedido.empresa?.endereco?.cidade ?? ''} - ${dadosPedido.empresa?.endereco?.estado ?? ''}`}</span>
              </li>
              <li className="flex items-center gap-2">
                <strong>CEP:</strong>
                <span>{` ${dadosPedido.empresa?.endereco?.cep ?? ''}`}</span>
              </li>
              <li className="flex items-center gap-2">
                <strong>Complemento:</strong>
                <span>{` ${dadosPedido.empresa?.endereco?.complemento ?? 'Não informado'}`}</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fornecedor</CardTitle>
          <CardDescription>
            Informações do fornecedor do produto/serviço
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul>
            <li className="flex items-center gap-2">
              <strong>Nome Fantasia/Razão Social:</strong>
              <span>{` ${dadosPedido.fornecedor.nome}`}</span>
            </li>
            <li className="flex items-center gap-2">
              <strong>CPF/CNPJ:</strong>
              <span>{` ${dadosPedido.fornecedor.documento ? formatarDocumento(dadosPedido.fornecedor.documento) : ''}`}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Itens</CardTitle>
          <CardDescription>Descrição dos itens do pedido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto">#</TableHead>
                  <TableHead className="w-3/4">Descrição</TableHead>
                  <TableHead className="w-auto">Qtd.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosPedido.itens.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                  </TableRow>
                )) ?? []}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid space-y-2">
            <div>
              <strong>Prazo para entrega: </strong>
              <span>
                {formatarDataBrasil(new Date(dadosPedido.prazoEntrega))}
              </span>
            </div>

            <div>
              <strong>Permite entrega parcial do pedido: </strong>
              <span>{`${dadosPedido.permiteEntregaParcial ? 'Sim' : 'Não'}`}</span>
            </div>

            {dadosPedido.condicoesEntrega && (
              <div className="grid">
                <strong>Condições de entrega:</strong>
                <blockquote>
                  <p className="ml-2 whitespace-break-spaces">
                    {dadosPedido.condicoesEntrega}
                  </p>
                </blockquote>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

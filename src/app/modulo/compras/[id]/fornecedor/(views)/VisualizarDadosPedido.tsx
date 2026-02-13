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
import { formatarDataBrasil } from '@/lib/utils'

import type { PedidosFornecedorType } from '../../../(schemas)/compras/schema-compras'

export interface VisualizacaoDadosPedidoProps {
  dadosPedido: PedidosFornecedorType
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
        <div className="space-y-2 border rounded px-4 py-2 flex-1">
          <h3 className="font-medium text-lg">Dados do pedido</h3>
          <Separator />
          <ul className="space-y-1">
            <DetalheItem
              label="Num. do Pedido:"
              valor={dadosPedido.numPedido ?? ''}
            />
            <DetalheItem
              label="Data do Pedido:"
              valor={formatarDataBrasil(
                new Date(dadosPedido.cadastro.dataCadastro)
              )}
            />
            <DetalheItem
              label="Responsável:"
              valor={dadosPedido.cadastro.usuario ?? ''}
            />
            <DetalheItem
              label="Cód. do Pedido:"
              valor={dadosPedido.codigo ?? ''}
            />
          </ul>
        </div>
      </div>
      <Separator />
      <CardInformacao
        titulo="Solicitante"
        descricao="Informações do solicitante do pedido"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
          <ul>
            <DetalheItem
              label="Nome Fantasia/Razão Social:"
              valor={dadosPedido.empresa?.nome ?? ''}
            />
          </ul>
          <ul className="space-y-1">
            <DetalheItem
              label="Logradouro:"
              valor={dadosPedido.empresa?.endereco?.logradouro ?? ''}
            />
            <DetalheItem
              label="Número:"
              valor={dadosPedido.empresa?.endereco?.numero ?? ''}
            />
            <DetalheItem
              label="Bairro:"
              valor={dadosPedido.empresa?.endereco?.bairro ?? ''}
            />
            <DetalheItem
              label="Cidade:"
              valor={`${dadosPedido.empresa?.endereco?.cidade ?? ''} - ${dadosPedido.empresa?.endereco?.estado ?? ''}`}
            />
            <DetalheItem
              label="CEP:"
              valor={dadosPedido.empresa?.endereco?.cep ?? ''}
            />
            <DetalheItem
              label="Complemento:"
              valor={dadosPedido.empresa?.endereco?.complemento || 'Não informado'}
            />
          </ul>
        </div>
      </CardInformacao>
      <CardInformacao
        titulo="Fornecedor"
        descricao="Informações do fornecedor do produto/serviço"
      >
        <ul>
          <DetalheItem
            label="Nome Fantasia/Razão Social:"
            valor={dadosPedido.fornecedor.nome}
          />
        </ul>
      </CardInformacao>
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

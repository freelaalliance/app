import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { PedidosFornecedorType } from '@/app/modulo/compras/(schemas)/compras/schema-compras'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatarDataBrasil } from '@/lib/utils'

export const ColunasPedidosEmpresaRecebimento: Array<
  ColumnDef<PedidosFornecedorType>
> = [
  {
    id: 'acoes',
    enableHiding: false,
    enableColumnFilter: false,

    cell: ({ row }) =>
      !row.original.recebido && (
        <div className="flex flex-row justify-center">
          <Button asChild className="shadow bg-padrao-red hover:bg-red-800">
            <Link href={`recebimento/${row.original.codigo}`}>Conferir</Link>
          </Button>
        </div>
      ),
  },
  {
    accessorKey: 'numPedido',
    header: 'Número do pedido',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => <div>{row.getValue('numPedido')}</div>,
  },
  {
    accessorKey: 'cadastro',
    header: 'Data do pedido',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const dataCadastroPedido = new Date(row.original.cadastro.dataCadastro)

      return <div>{formatarDataBrasil(dataCadastroPedido, true)}</div>
    },
  },
  {
    accessorKey: 'prazoEntrega',
    header: 'Previsão entrega',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const dataPrevisaoEntrega = new Date(row.original.prazoEntrega)

      return (
        <div className="capitalize">
          {formatarDataBrasil(dataPrevisaoEntrega, false, 'PP')}
        </div>
      )
    },
  },
  {
    accessorKey: 'permiteEntregaParcial',
    header: 'Entrega parcial',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <div>{row.original.permiteEntregaParcial ? 'Sim' : 'Não'}</div>
    },
  },
  {
    accessorKey: 'comprador',
    header: 'Comprador',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const nomeUsuarioComprador = row.original.cadastro.usuario

      return <div>{nomeUsuarioComprador}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      let statusCompra = ''

      if (row.original.recebido) {
        statusCompra = 'recebido'
      } else if (row.original.cancelado) {
        statusCompra = 'cancelado'
      } else {
        statusCompra = 'pendente'
      }

      return <div className="capitalize">{statusCompra}</div>
    },
  },
  {
    accessorKey: 'recebimento',
    header: 'Data da entrega',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const dataEntrega = row.original.permiteEntregaParcial
        ? row.original.recebimento
          ? row.original.recebimento[row.original.recebimento.length - 1]
              .dataRecebimento
          : null
        : row.original.recebimento
          ? row.original.recebimento[0]?.dataRecebimento
          : null

      return (
        <div className="capitalize">
          {dataEntrega
            ? formatarDataBrasil(new Date(dataEntrega), false, 'PP')
            : '--'}
        </div>
      )
    },
  },
  {
    accessorKey: 'condicoesEntrega',
    header: 'Obs',
    enableHiding: false,
    enableColumnFilter: true,
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <span className="line-clamp-1">
              {row.original.condicoesEntrega}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="whitespace-pre-line">
              {row.original.condicoesEntrega}
            </p>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
]

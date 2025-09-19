import type { ColumnDef } from '@tanstack/react-table'

import type { PedidosFornecedorType } from '@/app/modulo/compras/(schemas)/compras/schema-compras'
import { formatarDataBrasil } from '@/lib/utils'

import { MenuTabelaPedidosFornecedor } from './menu-tabela-pedidos-fornecedor'

export const ColunasPedidosFornecedor: Array<ColumnDef<PedidosFornecedorType>> =
  [
    {
      id: 'acoes',
      enableHiding: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="flex flex-row justify-center">
          <MenuTabelaPedidosFornecedor pedido={row.original} />
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
      accessorKey: 'recebimento',
      header: 'Data da entrega',
      enableHiding: false,
      enableColumnFilter: true,
      cell: ({ row }) => {
        if (row.original.recebimento && row.original.recebimento.length > 0) {
          const dataEntrega = row.original.permiteEntregaParcial
            ? row.original.recebimento[row.original.recebimento.length - 1]?.dataRecebimento
            : row.original.recebimento[0]?.dataRecebimento

          return (
            <div className="capitalize">
              {dataEntrega
                ? formatarDataBrasil(new Date(dataEntrega), false, 'PP')
                : '--'}
            </div>
          )
        }
        return '--'
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
  ]

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatarDataBrasil } from '@/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import { VendasCliente } from '../../../_schemas/vendas.schema'
import { MenuTabelaVendaCliente } from './menu-tabela-vendas-realizadas'

export const columnsVendasCliente: ColumnDef<VendasCliente>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="max-w-10">
        <MenuTabelaVendaCliente dadosVenda={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'numeroPedido',
    header: 'Pedido',
  },
  {
    accessorKey: 'codigo',
    header: 'Código',
  },
  {
    accessorKey: 'usuario',
    header: 'Vendedor',
  },
  {
    accessorKey: 'dataCadastro',
    header: 'Data venda',
    cell: ({ row }) => formatarDataBrasil(new Date(row.original.dataCadastro), true, 'Pp'),
  },
  {
    accessorKey: 'prazoEntrega',
    header: 'Prazo de Entrega',
    cell: ({ row }) => formatarDataBrasil(new Date(row.original.prazoEntrega), false, 'P'),
  },
  {
    accessorKey: 'permiteEntregaParcial',
    header: 'Parcial?',
    cell: ({ row }) => (
      <div>{row.original.permiteEntregaParcial ? 'Sim' : 'Não'}</div>
    ),
  },
  {
    accessorKey: 'expedido',
    header: 'Expedido',
    cell: ({ row }) => (
      <div>{row.original.expedido ? 'Sim' : 'Não'}</div>
    ),
  },
  {
    accessorKey: 'qtdExpedicoes',
    header: 'Expedições Realizadas',
  },
  {
    accessorKey: 'condicoes',
    header: 'Condições',
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='line-clamp-1'>{row.original.condicoes}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.condicoes}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
]

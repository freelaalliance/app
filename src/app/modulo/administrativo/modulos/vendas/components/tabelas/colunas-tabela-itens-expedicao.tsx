import type { ColumnDef } from '@tanstack/react-table'
import type { ItemAvaliacaoExpedicaoType } from '../../../_api/AdmVendas'
import { MenuTabelaItensAvaliacaoExpedicao } from './menu-tabela-itens-expedicao'

export const colunasItensAvaliacaoExpedicao: ColumnDef<ItemAvaliacaoExpedicaoType>[] =
  [
    {
      id: 'acoes',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="w-2">
          <MenuTabelaItensAvaliacaoExpedicao row={row.original} />
        </div>
      ),
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="w-auto capitalize">{row.original.pergunta}</div>
      ),
    },
  ]

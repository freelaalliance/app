import type { ColumnDef } from '@tanstack/react-table'
import type { ItemAvaliacaoEmpresaType } from '../../../_api/AdmCompras'
import { MenuTabelaItensAvaliacaoRecebimento } from './menu-tabela-itens-avaliacao'

export const colunasItensAvaliacaoRecebimento: ColumnDef<ItemAvaliacaoEmpresaType>[] =
  [
    {
      id: 'acoes',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="w-2">
          <MenuTabelaItensAvaliacaoRecebimento row={row.original}/>
        </div>
      ),
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => <div className="w-auto capitalize">{row.original.descricao}</div>,
    },
    {
      accessorKey: 'ativo',
      header: 'Status',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => <div className="w-auto">{row.original.ativo ? 'Ativo' : 'Desativado'}</div>,
    },
  ]

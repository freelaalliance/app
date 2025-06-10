import { aplicarMascaraDocumento } from '@/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import type { ClienteType } from '../../../_types/clientes'
import { MenuTabelaCliente } from './menu-tabela-cliente'

export const columnsTabelaCliente: ColumnDef<ClienteType>[] = [
  {
      id: 'acoes',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="max-w-10">
          <MenuTabelaCliente dadosCliente={row.original}/>
        </div>
      ),
    },
  {
    header: 'Documento',
    accessorKey: 'documento',
    enableHiding: false,
    cell: ({ row }) => <div>{aplicarMascaraDocumento(row.original.documento)}</div>,
  },
  {
    header: 'Nome',
    accessorKey: 'nome',
    enableHiding: false,
    cell: ({ row }) => <div>{row.original.nome}</div>,
  },
]

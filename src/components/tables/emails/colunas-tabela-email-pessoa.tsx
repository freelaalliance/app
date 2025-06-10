'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { MenuTabelaEmailsPessoa } from './menu-tabela-email-pessoa'
import type { ListaEmailType } from './tabela-email-pessoa'

export const colunasEmailsPessoa: ColumnDef<ListaEmailType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="w-10">
        <MenuTabelaEmailsPessoa 
          emailPessoa={row.original}
        />
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableHiding: false,
    cell: ({ row }) => <div>{`${row.getValue('email')}`}</div>,
  },
]

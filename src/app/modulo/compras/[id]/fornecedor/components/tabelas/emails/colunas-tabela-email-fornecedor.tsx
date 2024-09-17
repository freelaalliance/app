import { ColumnDef } from '@tanstack/react-table'
import { z } from 'zod'

import { schemaEmailForm } from '@/app/modulo/compras/(schemas)/fornecedores/schema-fornecedor'

import { MenuTabelaEmailsFornecedor } from './menu-tabela-email-fornecedor'

export const colunasEmailsFornecedor: ColumnDef<
  z.infer<typeof schemaEmailForm>
>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="w-10">
        <MenuTabelaEmailsFornecedor emailFornecedor={row.original} />
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

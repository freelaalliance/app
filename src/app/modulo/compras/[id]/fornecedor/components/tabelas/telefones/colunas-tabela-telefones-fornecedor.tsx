import type { ColumnDef } from '@tanstack/react-table'
import type { z } from 'zod'

import type { schemaTelefoneForm } from '@/app/modulo/compras/(schemas)/fornecedores/schema-fornecedor'
import { formatarNumeroTelefone } from '@/lib/utils'

import { MenuTabelaTelefonesFornecedor } from './menu-tabela-telefones-fornecedor'

export const colunasTelefonesFornecedor: ColumnDef<
  z.infer<typeof schemaTelefoneForm>
>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="max-w-10">
        <MenuTabelaTelefonesFornecedor telefoneFornecedor={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'numero',
    header: 'Telefone',
    enableHiding: false,
    cell: ({ row }) => (
      <div>{`(${row.original.codigoArea}) ${formatarNumeroTelefone(row.getValue('numero'))}`}</div>
    ),
  },
]

'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { formatarNumeroTelefoneComDDD } from '@/lib/utils'

import { MenuTabelaTelefonesPessoa } from './menu-tabela-telefones-pessoa'
import type { TelefonePessoaType } from './tabela-telefones-pessoa'

export const colunasTelefonesPessoa: ColumnDef<TelefonePessoaType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="max-w-10">
        <MenuTabelaTelefonesPessoa 
          telefonePessoa={row.original}
        />
      </div>
    ),
  },
  {
    accessorKey: 'numero',
    header: 'Telefone',
    enableHiding: false,
    cell: ({ row }) => (
      <div>{`${formatarNumeroTelefoneComDDD(row.original.numero)}`}</div>
    ),
  },
]

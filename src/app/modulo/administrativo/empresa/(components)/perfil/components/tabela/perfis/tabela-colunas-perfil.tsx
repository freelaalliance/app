import { ColumnDef } from '@tanstack/react-table'

import { PerfilType } from '@/app/modulo/administrativo/empresa/schemas/SchemaPerfil'

import { MenuTabelaPerfil } from './tabela-menu-perfil'

export const colunasPerfil: ColumnDef<PerfilType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex flex-row justify-center w-auto">
        <MenuTabelaPerfil row={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'nome',
    header: 'Perfil',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="md:w-96">{row.getValue('nome')}</div>,
  },
  {
    accessorKey: 'administrativo',
    header: 'Administrativo',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div>{row.getValue('administrativo') ? 'Sim' : 'Não'}</div>
    ),
  },
]

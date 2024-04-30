import { ColumnDef } from '@tanstack/react-table'

import { PermissaoVinculadoPerfilType } from '@/app/modulo/administrativo/empresa/schemas/SchemaModulo'
import { Checkbox } from '@/components/ui/checkbox'

export const colunasPermissoesVinculadasPerfil: ColumnDef<PermissaoVinculadoPerfilType>[] =
  [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nome',
      header: 'Função',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <div className="md:w-96">{row.getValue('nome')}</div>,
    },
    {
      accessorKey: 'moduloNome',
      header: 'Módulo',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="w-auto">{row.getValue('moduloNome')}</div>
      ),
    },
  ]

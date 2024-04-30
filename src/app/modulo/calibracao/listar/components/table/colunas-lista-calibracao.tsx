import { ColumnDef } from '@tanstack/react-table'
import { CheckCircle, CircleOff } from 'lucide-react'

import { formatarDataBrasil } from '@/lib/utils'

import { DataTableRowActions } from './acoes-lista-calibracao'
import { Calibracao } from './schemas/SchemaNovaCalibracao'

export const colunasCalibracao: ColumnDef<Calibracao>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex flex-row justify-center">
        <DataTableRowActions row={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'codigo',
    header: 'Codigo do instrumento',
    enableHiding: false,
    cell: ({ row }) => <div>{row.getValue('codigo')}</div>,
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    cell: ({ row }) => <div className="capitalize">{row.getValue('nome')}</div>,
  },
  {
    accessorKey: 'marca',
    header: 'Marca do instrumento',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('marca')}</div>
    ),
  },
  {
    accessorKey: 'localizacao',
    header: 'Localização',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('localizacao')}</div>
    ),
  },
  {
    accessorKey: 'data',
    header: 'Data da calibração',
    cell: ({ row }) => (
      <div>{formatarDataBrasil(new Date(row.getValue('data')))}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status calibração',
    cell: ({ row }) => {
      switch (row.getValue('status')) {
        case 'aprovado':
          return (
            <div className="font-semibold py-1 flex items-center gap-2">
              <span className="text-green-700 text-center w-20">Aprovado</span>
              <CheckCircle className="w-4 h-4 text-green-700" />
            </div>
          )
        case 'reprovado':
          return (
            <div className="font-semibold py-1 flex items-center gap-2">
              <span className="text-red-600 text-center w-20">Reprovado</span>
              <CircleOff className="w-4 h-4 text-red-600" />
            </div>
          )
        default:
          break
      }
    },
  },
]

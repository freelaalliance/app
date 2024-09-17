import { ColumnDef } from '@tanstack/react-table'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatarDataBrasil } from '@/lib/utils'

import { Calibracao } from '../../../schemas/(calibracoes)/SchemaNovaCalibracao'

import { DataTableRowActions } from './acoes-lista-calibracao'
import { optionsStatusCalibracao } from './data-table-calibracao'

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
    header: 'Cod. do instrumento',
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
    header: 'Marca',
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
    accessorKey: 'resolucao',
    header: 'Resolução',
    cell: ({ row }) => <div>{`${row.getValue('resolucao')}`}</div>,
  },
  {
    accessorKey: 'frequencia',
    header: 'Freq. Calibração',
    cell: ({ row }) => {
      if (row.getValue('frequencia') === 1) {
        return <div>{`${row.getValue('frequencia')} Mês`}</div>
      }

      return <div>{`${row.getValue('frequencia')} Mêses`}</div>
    },
  },
  {
    accessorKey: 'data',
    header: 'Dt. calibração',
    cell: ({ row }) => (
      <div>{formatarDataBrasil(new Date(row.getValue('data')))}</div>
    ),
  },
  {
    accessorKey: 'usuario',
    header: 'Realizado por',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('usuario')}</div>
    ),
  },
  {
    accessorKey: 'numeroCertificado',
    header: 'Num. Certificado',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('numeroCertificado')}</div>
    ),
  },
  {
    accessorKey: 'tolerancia',
    header: 'Tolerância estabelecida',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('tolerancia')}</div>
    ),
  },
  {
    accessorKey: 'incertezaTendencia',
    header: 'Incerteza/Tendencia',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('incertezaTendencia')}</div>
    ),
  },
  {
    accessorKey: 'erroEncontrado',
    header: 'Erro Encontrado',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('erroEncontrado')}</div>
    ),
  },
  {
    accessorKey: 'observacao',
    header: 'Observações',
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="line-clamp-4">{row.getValue('observacao')}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{row.getValue('observacao')}</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Sts. calibração',
    cell: ({ row }) => {
      const statusCalibracao = optionsStatusCalibracao.find(
        (status) => status.value === row.getValue('status'),
      )

      if (!statusCalibracao) {
        return null
      }

      switch (row.getValue('status')) {
        case 'aprovado':
          return (
            <div className="font-semibold">
              <span className="text-green-700 w-20">Aprovado</span>
            </div>
          )
        case 'reprovado':
          return (
            <div className="font-semibold">
              <span className="text-red-600 w-20">Reprovado</span>
            </div>
          )
        default:
          break
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]

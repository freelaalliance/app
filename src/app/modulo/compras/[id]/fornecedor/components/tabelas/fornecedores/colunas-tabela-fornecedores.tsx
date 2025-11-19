import type { ColumnDef } from '@tanstack/react-table'

import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { aplicarMascaraDocumento } from '@/lib/utils'

import type { FornecedoresEmpresaType } from '../../../(api)/FornecedorApi'

import { MenuTabelaFornecedores } from './menu-tabela-fornecedores'
import {
  optionsStatusAprovado,
  optionsStatusCritico,
} from './tabela-fornecedores'

export const colunasFornecedores: ColumnDef<FornecedoresEmpresaType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex flex-row justify-center">
        <MenuTabelaFornecedores fornecedor={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'documento',
    header: 'Documento',
    enableHiding: false,
    cell: ({ row }) => (
      <div>{aplicarMascaraDocumento(row.getValue('documento'))}</div>
    ),
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize">{row.getValue('nome')}</div>,
  },
  {
    accessorKey: 'critico',
    header: 'Crítico',
    enableHiding: false,
    cell: ({ row }) => {
      const statusFiltro = row.getValue('critico') ? 'sim' : 'nao'

      const filtroFornecedoreCritico = optionsStatusCritico.find(
        critico => statusFiltro === critico.value
      )

      if (!filtroFornecedoreCritico) return null

      return <div>{row.getValue('critico') ? 'Sim' : 'Não'}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id) ? 'sim' : 'nao')
    },
  },
  {
    accessorKey: 'aprovado',
    header: 'Aprovado',
    enableHiding: false,
    cell: ({ row }) => {
      const statusFiltro = row.getValue('aprovado') ? 'sim' : 'nao'

      const filtroFornecedorAprovado = optionsStatusAprovado.find(
        aprovado => statusFiltro === aprovado.value
      )

      if (!filtroFornecedorAprovado) return null

      return <div>{row.getValue('aprovado') ? 'Sim' : 'Não'}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id) ? 'sim' : 'nao')
    },
  },
  {
    accessorKey: 'desempenho',
    header: 'Desempenho',
    enableHiding: false,
    cell: ({ row }) => (
      <div>
        {`${row.getValue('desempenho')}%`}
      </div>
    ),
  },
]

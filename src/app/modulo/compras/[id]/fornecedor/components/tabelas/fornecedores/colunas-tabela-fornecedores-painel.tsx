import type { ColumnDef } from '@tanstack/react-table'

import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { aplicarMascaraDocumento, cn } from '@/lib/utils'

import type { FornecedoresEmpresaType } from '../../../(api)/FornecedorApi'

import { MenuTabelaFornecedores } from './menu-tabela-fornecedores'
import {
  optionsStatusAprovado,
  optionsStatusCritico,
} from './tabela-fornecedores'
import { Badge } from '@/components/ui/badge'

export const colunasFornecedoresPainel: ColumnDef<FornecedoresEmpresaType>[] = [
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
    accessorKey: 'avaliacao.avaliadoEm',
    header: 'Última Avaliação',
    enableHiding: false,
    cell: ({ row }) => {
      const ultimaAvaliacao = row.original.avaliacao
      if (!ultimaAvaliacao) return <div>N/A</div>
      return (
        <div>
          {`${new Date(
            ultimaAvaliacao.avaliadoEm 
          ).toLocaleDateString()}`}
        </div>
      )
    },
  },
  {
    accessorKey: 'avaliacao.validade',
    header: 'Validade Avaliação',
    enableHiding: false,
    cell: ({ row }) => {
      const ultimaAvaliacao = row.original.avaliacao
      if (!ultimaAvaliacao) return <div>N/A</div>
      return (
        <div>
          {`${new Date(
            ultimaAvaliacao.validade
          ).toLocaleDateString()}`}
        </div>
      )
    },
  },
  {
    accessorKey: 'avaliacao.nota',
    header: 'Nota Avaliação',
    enableHiding: false,
    cell: ({ row }) => {
      const ultimaAvaliacao = row.original.avaliacao
      if (!ultimaAvaliacao) return <div>N/A</div>
      return (
        <div>
          {`${ultimaAvaliacao.nota}%`}
        </div>
      )
    },
  },
  {
    accessorKey: 'mediaAvaliacoes',
    header: 'Média Avaliações',
    enableHiding: false,
    cell: ({ row }) => {
      const mediaAvaliacoes = row.getValue('mediaAvaliacoes')
      if (mediaAvaliacoes === null || mediaAvaliacoes === undefined) return <div>N/A</div>
      return (
        <div>
          {`${mediaAvaliacoes}%`}
        </div>
      )
    },
  },
  {
    accessorKey: 'conceito',
    header: 'Conceito',
    enableHiding: false,
    cell: ({ row }) => {
      const conceito = row.getValue('conceito')
      if (conceito === null || conceito === undefined) return <div>N/A</div>
      return (
        <Badge className={cn({ 'bg-green-500': conceito === 'A', 'bg-yellow-500': conceito === 'B', 'bg-red-500': conceito === 'C' })}>
          {`${conceito}`}
        </Badge>
      )
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

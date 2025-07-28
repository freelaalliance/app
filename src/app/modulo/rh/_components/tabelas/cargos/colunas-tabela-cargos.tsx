import { Badge } from '@/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ColumnDef } from '@tanstack/react-table'
import type { Cargo } from '../../../_types/cargos/CargoType'
import { MenuTabelaCargos } from './menu-tabela-cargos'
import { cn } from '@/lib/utils'

export const colunasTabelaCargos: ColumnDef<Cargo>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="max-w-10">
        <MenuTabelaCargos dadosCargo={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'nome',
    header: 'Nome do Cargo',
  },
  {
    accessorKey: 'atribuicoes',
    header: 'Atribuições',
    cell: ({ row }) => {
      const atribuicoes = row.original.atribuicoes
      if (!atribuicoes) return <div className="text-gray-500">-</div>
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help max-w-[200px] truncate">
                {atribuicoes}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p className="whitespace-pre-wrap">{atribuicoes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'superior',
    header: 'Exige Ensino Superior',
    cell: ({ row }) => (
      <Badge className={cn('w-fit', row.original.superior ? 'bg-emerald-500' : 'bg-red-500')} variant={row.original.superior ? 'default' : 'secondary'}>
        {row.original.superior ? 'Sim' : 'Não'}
      </Badge>
    ),
  },
  {
    accessorKey: 'experienciaMinima',
    header: 'Experiência Mínima',
    cell: ({ row }) => {
      const experiencia = row.original.experienciaMinima
      if (!experiencia) return <div className="text-gray-500">-</div>
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[150px] truncate text-sm">
                {experiencia}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="whitespace-pre-wrap">{experiencia}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'escolaridadeMinima',
    header: 'Escolaridade Mínima',
    cell: ({ row }) => {
      const escolaridade = row.original.escolaridadeMinima
      if (!escolaridade) return <div className="text-gray-500">-</div>
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[150px] truncate text-sm">
                {escolaridade}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="whitespace-pre-wrap">{escolaridade}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'treinamentos',
    header: 'Treinamentos',
    cell: ({ row }) => {
      const treinamentos = row.original.treinamentos
      if (!treinamentos || treinamentos.length === 0) {
        return <div className="text-gray-500">Nenhum</div>
      }
      
      if (treinamentos.length === 1) {
        return <div className="text-sm">{treinamentos[0].nome}</div>
      }
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help">
                {treinamentos.length} treinamento{treinamentos.length > 1 ? 's' : ''}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {treinamentos.map(treinamento => (
                  <div key={treinamento.id} className="text-sm">
                    {treinamento.nome}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
]

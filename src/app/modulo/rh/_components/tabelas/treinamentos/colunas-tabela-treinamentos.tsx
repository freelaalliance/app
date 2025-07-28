import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ColumnDef } from '@tanstack/react-table'
import type { TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'
import { MenuTabelaTreinamentos } from './menu-tabela-treinamentos'

export const colunasTabelaTreinamentos: ColumnDef<TreinamentosType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="max-w-10">
        <MenuTabelaTreinamentos dadosTreinamento={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'nome',
    header: 'Nome do Treinamento',
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => {
      const tipo = row.original.tipo
      return (
        <div className="capitalize">
          {tipo === 'integracao' ? 'Integração' : 'Capacitação'}
        </div>
      )
    },
  },
  {
    accessorKey: 'planos',
    header: 'Planos de Treinamento',
    cell: ({ row }) => {
      const planos = row.original.planos
      if (!planos || planos.length === 0) {
        return <div className="text-gray-500">Nenhum plano de treinamento</div>
      }
      
      if (planos.length === 1) {
        return <div>{`${planos.length} treinamento criado`}</div>
      }
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                {planos.length} plano{planos.length > 1 ? 's' : ''}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {planos.map(plano => (
                  <div key={plano.id}>{plano.nome}</div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
]

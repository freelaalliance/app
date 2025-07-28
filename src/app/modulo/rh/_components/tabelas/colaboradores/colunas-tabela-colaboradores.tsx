import { Badge } from '@/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'
import { MenuTabelaColaboradores } from './menu-tabela-colaboradores'
import { aplicarMascaraDocumento } from '@/lib/utils'

const formatarData = (data: string) => {
  try {
    return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return 'Data inválida'
  }
}

const getStatusBadge = (status?: string) => {
  if (!status) return null
  
  const statusConfig = {
    ativo: { variant: 'default' as const, color: 'bg-green-100 text-green-800', label: 'Ativo' },
    inativo: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800', label: 'Inativo' },
    afastado: { variant: 'outline' as const, color: 'bg-yellow-100 text-yellow-800', label: 'Afastado' },
    demitido: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800', label: 'Demitido' },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inativo

  return (
    <Badge variant={config.variant} className={config.color}>
      {config.label}
    </Badge>
  )
}

export const colunasColaboradores: ColumnDef<Contratacao>[] = [
  {
    id: 'acoes',
    cell: ({ row }) => {
      const contratacao = row.original
      return <MenuTabelaColaboradores dadosColaborador={contratacao} />
    },
  },
  {
    accessorKey: 'colaborador.pessoa.nome',
    header: 'Nome do Colaborador',
    id: 'colaborador',
    cell: ({ row }) => {
      return row.original.colaborador.pessoa.nome
    },
  },
  {
    accessorKey: 'colaborador.documento',
    header: 'CPF',
    cell: ({ row }) => {
      const cpf = row.original.colaborador.documento
      if (!cpf) return 'Não informado'
      // Formatar CPF: 000.000.000-00
      return aplicarMascaraDocumento(cpf)
    },
  },
  {
    accessorKey: 'cargo',
    header: 'Cargo',
    cell: ({ row }) => {
      const cargo = row.original.cargo
      return cargo ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="cursor-help">
                {cargo.nome}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cargo: {cargo.nome}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="text-gray-500 text-sm">Sem cargo</span>
      )
    },
  },
  {
    accessorKey: 'admitidoEm',
    header: 'Data de Admissão',
    cell: ({ getValue }) => {
      const data = getValue() as string
      return (
        <span className="text-sm text-gray-900">
          {formatarData(data)}
        </span>
      )
    },
  },
  {
    accessorKey: 'demitidoEm',
    header: 'Status',
    cell: ({ row }) => {
      const demitidoEm = row.original.demitidoEm
      const status = demitidoEm ? 'demitido' : 'ativo'
      return getStatusBadge(status)
    },
  },
  
]

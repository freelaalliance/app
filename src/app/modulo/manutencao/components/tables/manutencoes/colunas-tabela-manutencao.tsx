import { ColumnDef } from '@tanstack/react-table'
import { differenceInMinutes } from 'date-fns'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatarDataBrasil } from '@/lib/utils'

import { DadosManutencaoEquipamentoType } from '../../../schemas/ManutencaoSchema'

import { MenuTabelaManutencaoEquipamento } from './menu-tabela-manutencao'

export const colunasManutencaoEquipamento: ColumnDef<DadosManutencaoEquipamentoType>[] =
  [
    {
      id: 'acoes',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="md:w-4">
          <MenuTabelaManutencaoEquipamento row={row.original} />
        </div>
      ),
    },
    {
      accessorKey: 'criadoEm',
      header: 'Criado em',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="w-auto">
          {formatarDataBrasil(new Date(row.getValue('criadoEm')))}
        </div>
      ),
    },
    {
      accessorKey: 'responsavel',
      header: 'Responsável',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="capitalize w-auto">
            {row.original.usuario.pessoa.nome}
          </div>
        )
      },
    },
    {
      accessorKey: 'situacao',
      header: 'Status',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        let status = 'Aberto'

        if (
          row.original.iniciadoEm &&
          !row.original.finalizadoEm &&
          !row.original.canceladoEm
        ) {
          status = 'Em andamento'
        } else if (row.original.finalizadoEm) {
          status = 'Finalizado'
        } else if (row.original.canceladoEm) {
          status = 'Cancelado'
        }

        return <div className="md:w-full">{status}</div>
      },
    },
    {
      accessorKey: 'duracao',
      header: 'Duração manutenção',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        let duracao: number = 0

        if (
          row.original.iniciadoEm &&
          !row.original.finalizadoEm &&
          !row.original.canceladoEm
        ) {
          duracao = differenceInMinutes(
            new Date(),
            new Date(row.original.iniciadoEm),
          )
        } else if (row.original.finalizadoEm) {
          duracao = Number(row.original.duracao)
        } else {
          duracao = 0
        }

        return <div className="md:w-full">{`${duracao} min`}</div>
      },
    },
    {
      accessorKey: 'equipamentoParado',
      header: 'Tempo parado',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        let duracao: number = 0

        if (
          !row.original.equipamentoParado &&
          !row.original.finalizadoEm &&
          !row.original.canceladoEm
        ) {
          duracao = differenceInMinutes(
            new Date(),
            new Date(row.original.criadoEm),
          )
        } else {
          duracao = Number(row.original.equipamentoParado) ?? 0
        }

        return <div className="md:w-full">{`${duracao} min`}</div>
      },
    },
    {
      accessorKey: 'observacao',
      header: 'Descrição',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="md:w-full line-clamp-2 truncate">
                {row.original.observacoes}
              </div>
            </TooltipTrigger>
            <TooltipContent>{row.original.observacoes}</TooltipContent>
          </Tooltip>
        )
      },
    },
  ]

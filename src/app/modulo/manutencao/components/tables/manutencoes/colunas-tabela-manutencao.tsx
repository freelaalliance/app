import { ColumnDef } from "@tanstack/react-table";
import { DadosManutencaoEquipamentoType } from "../../../schemas/ManutencaoSchema";
import { formatarDataBrasil } from "@/lib/utils";
import { differenceInMinutes } from "date-fns";
import { MenuTabelaManutencaoEquipamento } from "./menu-tabela-manutencao";

export const colunasManutencaoEquipamento: ColumnDef<DadosManutencaoEquipamentoType>[] = [
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
      <div className="w-auto">{formatarDataBrasil(new Date(row.getValue('criadoEm')))}</div>
    ),
  },
  {
    accessorKey: 'usuario',
    header: 'Usuário',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => {
      const usuario: any = row.getValue('usuario')
      return (
        <div className="capitalize w-auto">{usuario.pessoa.nome}</div>
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

      if (row.original.iniciadoEm && (!row.original.finalizadoEm && !row.original.canceladoEm)) {
        status = 'Em andamento'
      }
      else if (row.original.finalizadoEm) {
        status = 'Finalizado'
      }
      else if (row.original.canceladoEm) {
        status = 'Cancelado'
      }

      return (
        <div className="md:w-full">{status}</div>
      )
    },
  },
  {
    accessorKey: 'duracao',
    header: 'Duração manutenção',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => {
      let duracao: Number = 0

      if(row.original.iniciadoEm && (!row.original.finalizadoEm && !row.original.canceladoEm)){
        duracao = differenceInMinutes(new Date(), new Date(row.original.iniciadoEm))
      }
      else if(row.original.finalizadoEm){
        duracao = row.original.duracao ?? 0
      }
      else{
        duracao = 0
      }

      return (
        <div className="md:w-full">{`${duracao} min`}</div>
      )
    },
  },
  {
    accessorKey: 'equipamentoParado',
    header: 'Tempo parado',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => {
      let duracao: Number = 0

      if(!row.original.equipamentoParado && (!row.original.finalizadoEm && !row.original.canceladoEm)){
        duracao = differenceInMinutes(new Date(), new Date(row.original.criadoEm))
      }
      else{
        duracao = row.original.equipamentoParado ?? 0
      }

      return (
        <div className="md:w-full">{`${duracao} min`}</div>
      )
    },
  }
]
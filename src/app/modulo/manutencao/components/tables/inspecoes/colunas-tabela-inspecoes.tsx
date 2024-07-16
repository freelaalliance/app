import { ColumnDef } from "@tanstack/react-table";
import { DadosInspecoesEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { formatarDataBrasil } from "@/lib/utils";
import { MenuTabelaInspecoesEquipamento } from "./menu-tabela-inspecoes";
import { optionsStatusInspecao } from "./tabela-inspecoes";

export const colunasInspecoesEquipamento: ColumnDef<DadosInspecoesEquipamentoType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex-1 justify-center md:w-1">
        <MenuTabelaInspecoesEquipamento row={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'iniciadoEm',
    header: 'Iniciado em',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="w-auto">{formatarDataBrasil(new Date(row.getValue('iniciadoEm')))}</div>,
  },
  {
    accessorKey: 'usuario',
    header: 'Usuário',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => {
      const usuario: any = row.getValue('usuario')
      return (<div className="capitalize md:w-full">{usuario.pessoa.nome}</div>)
    },
  },
  {
    accessorKey: 'statusInspecao',
    header: 'Status',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => {
      const status = optionsStatusInspecao.find(
        (status) => status.value === row.getValue('statusInspecao'),
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex md:w-6 items-center">
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'finalizadoEm',
    header: 'Finalizado em',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize md:w-full">{row.getValue('finalizadoEm') ? formatarDataBrasil(new Date(row.getValue('finalizadoEm'))) : 'Em andamento'}</div>,
  }
]
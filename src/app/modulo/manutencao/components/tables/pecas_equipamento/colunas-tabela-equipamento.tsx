import { ColumnDef } from "@tanstack/react-table";
import { DadosPecasEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { MenuTabelaPecasEquipamento } from "./menu-tabela-pecas-equipamento";

export const colunasPecasEquipamento: ColumnDef<DadosPecasEquipamentoType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="md:w-10">
        <MenuTabelaPecasEquipamento row={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize md:w-28">{row.getValue('nome')}</div>,
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="md:w-full line-clamp-2">{row.getValue('descricao')}</div>,
  }
]
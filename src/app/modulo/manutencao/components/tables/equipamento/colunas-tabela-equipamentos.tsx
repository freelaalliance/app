import { ColumnDef } from "@tanstack/react-table";
import { DadosEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { MenuTabelaEquipamento } from "./menu-tabela-equipamentos";

export const colunasEquipamento: ColumnDef<DadosEquipamentoType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex-1 justify-center w-10">
        <MenuTabelaEquipamento row={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize w-full">{row.getValue('nome')}</div>,
  },
  {
    accessorKey: 'codigo',
    header: 'Código',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="w-16">{row.getValue('codigo')}</div>,
  }
]
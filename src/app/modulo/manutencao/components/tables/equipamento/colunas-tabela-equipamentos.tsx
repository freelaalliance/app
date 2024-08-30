import { ColumnDef } from "@tanstack/react-table";
import { DadosEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { MenuTabelaEquipamento } from "./menu-tabela-equipamentos";
import { formatarDataBrasil } from "@/lib/utils";

export const colunasEquipamento: ColumnDef<DadosEquipamentoType>[] = [
  {
    id: 'acoes',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="w-auto md:w-10">
        <MenuTabelaEquipamento row={row.original} />
      </div>
    ),
  },
  {
    accessorKey: 'codigo',
    header: 'Código',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="w-auto md:w-16">{row.getValue('codigo')}</div>,
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="w-auto capitalize md:w-full">{row.getValue('nome')}</div>,
  },
  {
    accessorKey: 'frequencia',
    header: 'Freq. de verificação',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="w-auto md:w-full">{`${row.getValue('frequencia')} dias`}</div>,
  },
  {
    accessorKey: 'inspecionadoEm',
    header: 'Última preventiva',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="w-auto md:w-full">{row.getValue('inspecionadoEm') ? formatarDataBrasil(new Date(row.getValue('inspecionadoEm'))) : '--'}</div>,
  },
  {
    accessorKey: 'concertadoEm',
    header: 'Última corretiva',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="w-auto md:w-full">{row.getValue('concertadoEm') ? formatarDataBrasil(new Date(row.getValue('concertadoEm'))) : '--'}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableColumnFilter: false,
    enableHiding: false,
    cell: ({ row }) => <div className="w-auto capitalize md:w-full">{row.getValue('status')}</div>,
  }
]
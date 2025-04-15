import type { ColumnDef } from '@tanstack/react-table'
import type { CategoriaDocumentoType } from '../../../_api/AdmDocumentos'
import { MenuTabelaCategoriasDocumento } from './menu-tabela-categorias-documentos'

export const colunasCategoriasDocumentos: ColumnDef<CategoriaDocumentoType>[] =
  [
    {
      id: 'acoes',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="w-2">
          <MenuTabelaCategoriasDocumento row={row.original} />
        </div>
      ),
    },
    {
      accessorKey: 'nome',
      header: 'Categoria',
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="w-auto capitalize">{row.original.nome}</div>
      ),
    }
  ]

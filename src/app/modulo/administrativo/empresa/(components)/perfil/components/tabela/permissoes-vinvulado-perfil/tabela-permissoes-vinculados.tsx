import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { CheckCheck, Loader2, Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { adicionarPermissaoPerfil } from '@/app/modulo/administrativo/empresa/api/Perfil'
import { PermissaoVinculadoPerfilType } from '@/app/modulo/administrativo/empresa/schemas/SchemaModulo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { queryClient } from '@/lib/react-query'

import { colunasPermissoesPerfil } from '../permissoes-perfil/tabela-colunas-permissoes'

import { colunasPermissoesVinculadasPerfil } from './tabela-colunas-permissoes-vinculados'

interface DataTableProps {
  data: Array<PermissaoVinculadoPerfilType>
  idPerfil: string
  removerPermissoes: (funcoes: Array<string>) => void
}

export function DataTablePermissoesVinculadasPerfil({
  data,
  idPerfil,
  removerPermissoes,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [atualizandoPermissoes, atualizarPermissoes] = React.useState(false)

  const table = useReactTable({
    data,
    columns: colunasPermissoesVinculadasPerfil,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  async function vincularPermissoes() {
    atualizarPermissoes(true)

    const processaVinculoPermissao = await adicionarPermissaoPerfil(
      idPerfil,
      data.map((permissao) => {
        return {
          idFuncao: permissao.id,
        }
      }),
    )

    atualizarPermissoes(false)

    if (processaVinculoPermissao.status) {
      toast.success(processaVinculoPermissao.msg)

      await queryClient.refetchQueries({
        queryKey: ['listaPermissoesPerfil', idPerfil],
        type: 'active',
      })
    } else {
      toast.error(processaVinculoPermissao.msg)
    }
  }

  function desvincularPermissao() {
    removerPermissoes(
      table
        .getSelectedRowModel()
        .rows.map((permissao) => permissao.original.id),
    )

    table.resetRowSelection()
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row-reverse md:justify-between">
        <Button
          disabled={table.getSelectedRowModel().rows.length === 0}
          className="shadow bg-red-600 hover:bg-red-700 flex justify-center md:justify-between gap-2 w-full md:w-auto"
          onClick={desvincularPermissao}
        >
          <Trash />
          {'Remover permissões'}
        </Button>
        {!atualizandoPermissoes ? (
          <Button
            disabled={data.length === 0}
            className="shadow bg-sky-400 hover:bg-sky-500 flex justify-center md:justify-between gap-2 w-full md:w-auto"
            onClick={vincularPermissoes}
          >
            <CheckCheck />
            {'Vincular permissões'}
          </Button>
        ) : (
          <Button
            className="shadow bg-sky-600  hover:bg-sky-700 w-full md:w-auto justify-center md:justify-between"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Vinculando...
          </Button>
        )}
        <Input
          placeholder="Filtrar pelo nome da permissão..."
          className="w-full md:w-64"
          disabled={data?.length === 0}
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="rounded-md border shadow-md bg-gray-50">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={colunasPermissoesPerfil.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm mt-5 md:text-base lg:text-lg"
                >
                  Nenhuma permissão vinculada!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

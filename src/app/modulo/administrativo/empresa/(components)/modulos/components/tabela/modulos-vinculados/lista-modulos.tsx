'use client'

import { useMutation } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Loader2, Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import {
  type VinculoModuloEmpresaProps,
  removerModulosEmpresa,
} from '@/app/modulo/administrativo/empresa/api/Empresa'
import type { ModuloType } from '@/app/modulo/administrativo/empresa/schemas/SchemaModulo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { queryClient } from '@/lib/react-query'

import { colunasTabelaModulos } from './colunas-tabela-modulos'

interface DataTableModuloProps {
  data: Array<ModuloType>
  idEmpresa: string
  carregandoDados: boolean
}

export function DataTableModulos({
  data,
  idEmpresa,
  carregandoDados,
}: DataTableModuloProps) {
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns: colunasTabelaModulos,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  const { mutateAsync: desvincularModulos, isPending } = useMutation({
    mutationFn: ({ idEmpresa, modulos }: VinculoModuloEmpresaProps) =>
      removerModulosEmpresa({
        idEmpresa,
        modulos,
      }),
    onMutate({ modulos }: VinculoModuloEmpresaProps) {
      const { cacheModulosEmpresa } = atualizarListaModulosEmpresa(modulos)

      return { cacheModulosEmpresa }
    },
    onError(_, __, context) {
      if (context?.cacheModulosEmpresa) {
        queryClient.setQueryData(
          ['listaModulosVinculadosEmpresa', idEmpresa],
          context.cacheModulosEmpresa
        )
      }
      toast.error('Falha ao desvincular módulo na empresa, tente novamente!')
    },
    onSuccess() {
      toast.success('Módulos desvinculados com sucesso!')

      table.resetRowSelection()
    },
  })

  function atualizarListaModulosEmpresa(
    modulos: Array<{
      idModulo: string
    }>
  ) {
    const cacheModulosEmpresa: Array<ModuloType> | undefined =
      queryClient.getQueryData(['listaModulosVinculadosEmpresa', idEmpresa])

    if (cacheModulosEmpresa) {
      modulos.forEach(moduloSelecionado => {
        const modulosEmpresa = cacheModulosEmpresa.filter(
          modulo => modulo.id !== moduloSelecionado.idModulo
        )

        queryClient.setQueryData(
          ['listaModulosVinculadosEmpresa', idEmpresa],
          modulosEmpresa
        )
      })
    } else {
      toast.error('Problema ao atualizar modulos vinculados')
    }

    return { cacheModulosEmpresa }
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col items-center gap-2 md:py-4 md:flex-row-reverse md:justify-between">
        {!isPending ? (
          <Button
            disabled={table.getSelectedRowModel().rows.length === 0}
            className="shadow bg-red-600 hover:bg-red-700 flex md:justify-between gap-2 w-full md:w-auto"
            onClick={() => {
              desvincularModulos({
                idEmpresa,
                modulos: table
                  .getSelectedRowModel()
                  .rows.map(moduloSelecionado => {
                    return {
                      idModulo: moduloSelecionado.original.id,
                    }
                  }),
              })
            }}
          >
            <Trash />
            {'Remover permissões'}
          </Button>
        ) : (
          <Button
            className="shadow bg-red-600 hover:bg-red-700 flex md:justify-between gap-2 w-full md:w-auto"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Removendo...
          </Button>
        )}

        <Input
          placeholder="Filtrar pelo nome do módulo..."
          className="w-full md:w-64"
          disabled={data?.length === 0}
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="rounded-md border shadow bg-gray-50">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {carregandoDados ? (
              <>
                <TableRow>
                  <Skeleton className="w-full h-[20px] rounded-full" />
                </TableRow>
                <TableRow>
                  <Skeleton className="w-full h-[20px] rounded-full" />
                </TableRow>
                <TableRow>
                  <Skeleton className="w-full h-[20px] rounded-full" />
                </TableRow>
              </>
            ) : table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={colunasTabelaModulos.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm mt-5 md:text-base lg:text-lg"
                >
                  Nenhum módulo encontrado!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-2 gap-2 md:w-64 md:float-right">
        <Button
          className="enabled:shadow-md"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

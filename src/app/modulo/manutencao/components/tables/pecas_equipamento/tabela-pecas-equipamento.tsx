'use client'

import { useQuery } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { colunasPecasEquipamento } from "./colunas-tabela-equipamento"
import { listarPecasEquipamento } from "../../../api/EquipamentoAPi"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export interface TabelaPecasEquipamentoProps {
  idEquipamento: string
}
export function TabelaPecasEquipamento({ idEquipamento }: TabelaPecasEquipamentoProps) {
  const { data: listaPecas, isLoading: carregandoPecas } = useQuery({
    queryKey: ['listaPecasEquipamento', idEquipamento],
    queryFn: () => listarPecasEquipamento({ idEquipamento })
  })

  const tabela = useReactTable({
    data: listaPecas ?? [],
    columns: colunasPecasEquipamento,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-2 w-full">
      <div className="flex-1">
        <Input
          placeholder="Filtrar pelo nome da peça..."
          className="md:w-64"
          disabled={listaPecas?.length === 0}
          value={(tabela.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            tabela.getColumn('nome')?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="rounded-md border shadow-md bg-gray-50">
        <Table>
          <TableHeader>
            {tabela.getHeaderGroups().map((headerGroup) => (
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
            {
              carregandoPecas ? (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={colunasPecasEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasPecasEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasPecasEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                </>
              ) : tabela.getRowModel().rows?.length > 0 ? (
                tabela.getRowModel().rows.map((row) => (
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
                    colSpan={colunasPecasEquipamento.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    Nenhuma peça encontrada!
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-2 gap-2 md:w-64 md:float-right">
        <Button
          className="enabled:shadow-md"
          variant="outline"
          size="sm"
          onClick={() => tabela.previousPage()}
          disabled={!tabela.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md"
          variant="outline"
          size="sm"
          onClick={() => tabela.nextPage()}
          disabled={!tabela.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
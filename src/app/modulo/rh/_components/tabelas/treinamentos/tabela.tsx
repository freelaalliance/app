'use client'

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
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'
import { colunasTabelaTreinamentos } from './colunas-tabela-treinamentos'

interface TabelaTreinamentosProps {
  listaTreinamentos: Array<TreinamentosType>
  carregandoTreinamentos: boolean
  colunasTabela: ColumnDef<TreinamentosType>[]
}

export function TabelaTreinamentos({
  listaTreinamentos,
  carregandoTreinamentos,
  colunasTabela,
}: TabelaTreinamentosProps) {
  const tabela = useReactTable({
    data: listaTreinamentos,
    columns: colunasTabela,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row md:justify-between">
        <div className="flex flex-row gap-2 w-full">
          <Input
            disabled={listaTreinamentos.length === 0 || carregandoTreinamentos}
            placeholder="Filtrar por nome do treinamento"
            value={
              (tabela.getColumn('nome')?.getFilterValue() as string) ?? ''
            }
            onChange={e =>
              tabela.getColumn('nome')?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="rounded-md border shadow overflow-auto bg-gray-50">
        <Table>
          <TableHeader>
            {tabela.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {carregandoTreinamentos ? (
              Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
                <TableRow key={i}>
                  <TableCell
                    colSpan={colunasTabelaTreinamentos.length}
                    className="h-16 text-center"
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : tabela.getRowModel().rows.length > 0 ? (
              tabela.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
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
                  colSpan={colunasTabelaTreinamentos.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium"
                >
                  Nenhum treinamento encontrado!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => tabela.previousPage()}
          disabled={!tabela.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
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

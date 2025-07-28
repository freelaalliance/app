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
import type { Cargo } from '../../../_types/cargos/CargoType'
import { colunasTabelaCargos } from './colunas-tabela-cargos'

interface TabelaCargosProps {
  listaCargos: Array<Cargo>
  carregandoCargos: boolean
  colunas: ColumnDef<Cargo>[]
}

export function TabelaCargos({
  listaCargos,
  carregandoCargos,
  colunas,
}: TabelaCargosProps) {
  const tabela = useReactTable({
    data: listaCargos,
    columns: colunas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const cargo = row.original as Cargo
      const nome = cargo.nome?.toLowerCase() || ''
      const atribuicoes = cargo.atribuicoes?.toLowerCase() || ''
      const escolaridade = cargo.escolaridadeMinima?.toLowerCase() || ''
      
      return nome.includes(filterValue.toLowerCase()) ||
             atribuicoes.includes(filterValue.toLowerCase()) ||
             escolaridade.includes(filterValue.toLowerCase())
    },
  })

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row md:justify-between">
        <div className="flex flex-row gap-2 w-full">
          <Input
            disabled={listaCargos.length === 0 || carregandoCargos}
            placeholder="Filtrar por nome do cargo"
            value={
              (tabela.getColumn('nome')?.getFilterValue() as string) ?? ''
            }
            onChange={e =>
              tabela.getColumn('nome')?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="text-sm text-gray-600">
          {tabela.getFilteredRowModel().rows.length} de {listaCargos.length} cargo(s)
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
            {carregandoCargos ? (
              Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
                <TableRow key={i}>
                  <TableCell
                    colSpan={colunasTabelaCargos.length}
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
                  colSpan={colunasTabelaCargos.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium"
                >
                  Nenhum cargo encontrado!
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

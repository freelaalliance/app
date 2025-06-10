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
  TableRow
} from '@/components/ui/table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useVendasByCliente } from '../../../_servicos/useVendas'
import { columnsVendasCliente } from './colunas-tabela-vendas-realizadas'
import Link from 'next/link'

interface TabelaVendasClienteProps {
  clienteId: string
  novaVenda: boolean
}

export function TabelaVendasCliente({ clienteId, novaVenda }: TabelaVendasClienteProps) {
  const { data: listaVendas = [], isFetching } = useVendasByCliente(clienteId)

  const tabela = useReactTable({
    data: listaVendas,
    columns: columnsVendasCliente,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row md:justify-between">
        <div className="flex flex-row gap-2 w-full md:w-64">
          <Input
            disabled={listaVendas.length === 0 || isFetching}
            placeholder="Filtrar por código"
            value={
              (tabela.getColumn('codigo')?.getFilterValue() as string) ?? ''
            }
            onChange={(e) =>
              tabela.getColumn('codigo')?.setFilterValue(e.target.value)
            }
          />
        </div>
        {novaVenda && (
          <Button className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto" asChild>
            <Link href={`../venda?cliente=${clienteId}`}>Nova venda</Link>
          </Button>
        )}
      </div>

      <div className="rounded-md border shadow overflow-auto bg-gray-50">
        <Table>
          <TableHeader>
            {tabela.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
            {isFetching ? (
              Array.from({ length: 2 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <TableRow key={i}>
                  <TableCell
                    colSpan={columnsVendasCliente.length}
                    className="h-16 text-center"
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : tabela.getRowModel().rows.length > 0 ? (
              tabela.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
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
                  colSpan={columnsVendasCliente.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium"
                >
                  Nenhuma venda encontrada!
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

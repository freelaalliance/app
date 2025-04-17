'use client'

import type { DocumentoType } from '@/app/modulo/documentos/_api/documentos'
import { Button } from '@/components/ui/button'
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

interface TabelaDocumentosProps {
  carregandoDados?: boolean
  colunasDocumento: Array<ColumnDef<DocumentoType>>
  dadosDocumentos: Array<DocumentoType>
}

export function TabelaDocumentos({
  dadosDocumentos,
  carregandoDados,
  colunasDocumento,
}: TabelaDocumentosProps) {

  const table = useReactTable({
    data: dadosDocumentos,
    columns: colunasDocumento,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <section className="space-y-2">
      <div className="rounded-md border shadow bg-gray-50 overflow-auto w-[300px] md:w-[1110.4px]">
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
                  <TableCell
                    colSpan={colunasDocumento.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={colunasDocumento.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
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
                  colSpan={colunasDocumento.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm mt-5 md:text-base lg:text-lg"
                >
                  Nenhum documento encontrado!
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
    </section>
  )
}

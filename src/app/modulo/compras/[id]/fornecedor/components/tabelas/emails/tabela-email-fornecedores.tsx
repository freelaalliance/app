'use client'

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { z } from 'zod'

import { schemaEmailForm } from '@/app/modulo/compras/(schemas)/fornecedores/schema-fornecedor'
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

import { colunasEmailsFornecedor } from './colunas-tabela-email-fornecedor'

interface TabelaEmailsFornecedorProps {
  listaEmails: z.infer<typeof schemaEmailForm>[]
  carregandoEmails: boolean
}

export function TabelaEmailsFornecedor({
  listaEmails,
  carregandoEmails,
}: TabelaEmailsFornecedorProps) {
  const tabelaEmailsFornecedor = useReactTable({
    data: listaEmails,
    columns: colunasEmailsFornecedor,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-2">
      <div className="rounded-md border shadow overflow-auto bg-gray-50 ">
        <Table>
          <TableHeader>
            {tabelaEmailsFornecedor.getHeaderGroups().map((headerGroup) => (
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
            {carregandoEmails ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={colunasEmailsFornecedor.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={colunasEmailsFornecedor.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
              </>
            ) : tabelaEmailsFornecedor.getRowModel().rows?.length > 0 ? (
              tabelaEmailsFornecedor.getRowModel().rows.map((row) => (
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
                  colSpan={colunasEmailsFornecedor.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                >
                  Nenhum email encontrado!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaEmailsFornecedor.previousPage()}
          disabled={!tabelaEmailsFornecedor.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaEmailsFornecedor.nextPage()}
          disabled={!tabelaEmailsFornecedor.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

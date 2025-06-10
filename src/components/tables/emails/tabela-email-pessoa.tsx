'use client'

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

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

import { colunasEmailsPessoa } from './colunas-tabela-email-pessoa'

export type ListaEmailType = {
  id: string,
  email: string
}

interface TabelaEmailsPessoaProps {
  listaEmails: ListaEmailType[]
  carregandoEmails: boolean
}

export function TabelaEmailsPessoa({
  listaEmails,
  carregandoEmails,
}: TabelaEmailsPessoaProps) {
  const tabelaEmailsPessoa = useReactTable({
    data: listaEmails,
    columns: colunasEmailsPessoa,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-2">
      <div className="rounded-md border shadow overflow-auto bg-gray-50 ">
        <Table>
          <TableHeader>
            {tabelaEmailsPessoa.getHeaderGroups().map((headerGroup) => (
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
                    colSpan={colunasEmailsPessoa.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={colunasEmailsPessoa.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
              </>
            ) : tabelaEmailsPessoa.getRowModel().rows?.length > 0 ? (
              tabelaEmailsPessoa.getRowModel().rows.map((row) => (
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
                  colSpan={colunasEmailsPessoa.length}
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
          onClick={() => tabelaEmailsPessoa.previousPage()}
          disabled={!tabelaEmailsPessoa.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaEmailsPessoa.nextPage()}
          disabled={!tabelaEmailsPessoa.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

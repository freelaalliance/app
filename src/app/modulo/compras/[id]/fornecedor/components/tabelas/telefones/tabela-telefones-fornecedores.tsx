'use client'

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { z } from 'zod'

import { schemaTelefoneForm } from '@/app/modulo/compras/(schemas)/fornecedores/schema-fornecedor'
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

import { colunasTelefonesFornecedor } from './colunas-tabela-telefones-fornecedor'

interface TabelaTelefonesFornecedorProps {
  listaTelefones: z.infer<typeof schemaTelefoneForm>[]
  carregandoTelefones: boolean
}

export function TabelaTelefonesFornecedor({
  listaTelefones,
  carregandoTelefones,
}: TabelaTelefonesFornecedorProps) {
  const tabelaTelefonesFornecedor = useReactTable({
    data: listaTelefones,
    columns: colunasTelefonesFornecedor,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-2">
      <div className="rounded-md border shadow overflow-auto bg-gray-50 ">
        <Table>
          <TableHeader>
            {tabelaTelefonesFornecedor.getHeaderGroups().map((headerGroup) => (
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
            {carregandoTelefones ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={colunasTelefonesFornecedor.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={colunasTelefonesFornecedor.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
              </>
            ) : tabelaTelefonesFornecedor.getRowModel().rows?.length > 0 ? (
              tabelaTelefonesFornecedor.getRowModel().rows.map((row) => (
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
                  colSpan={colunasTelefonesFornecedor.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                >
                  Nenhum telefone encontrado!
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
          onClick={() => tabelaTelefonesFornecedor.previousPage()}
          disabled={!tabelaTelefonesFornecedor.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaTelefonesFornecedor.nextPage()}
          disabled={!tabelaTelefonesFornecedor.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

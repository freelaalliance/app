'use client'

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { colunasTelefonesFornecedor } from '@/app/modulo/compras/[id]/fornecedor/components/tabelas/telefones/colunas-tabela-telefones-fornecedor'
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
import { colunasTelefonesPessoa } from './colunas-tabela-telefones-pessoa'


export type TelefonePessoaType = {
  id: string
  numero: string
  pessoaId: string
}

interface TabelaTelefonesPessoaProps {
  listaTelefones: Array<TelefonePessoaType>
  carregandoTelefones: boolean
}

export function TabelaTelefonesPessoa({
  listaTelefones,
  carregandoTelefones,
}: TabelaTelefonesPessoaProps) {
  const tabelaTelefonesPessoa = useReactTable({
    data: listaTelefones,
    columns: colunasTelefonesPessoa,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-2">
      <div className="rounded-md border shadow overflow-auto bg-gray-50 ">
        <Table>
          <TableHeader>
            {tabelaTelefonesPessoa.getHeaderGroups().map((headerGroup) => (
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
            ) : tabelaTelefonesPessoa.getRowModel().rows?.length > 0 ? (
              tabelaTelefonesPessoa.getRowModel().rows.map((row) => (
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
          onClick={() => tabelaTelefonesPessoa.previousPage()}
          disabled={!tabelaTelefonesPessoa.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaTelefonesPessoa.nextPage()}
          disabled={!tabelaTelefonesPessoa.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

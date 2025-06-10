'use client'

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
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { colunasTabelaProdutosServicos } from './colunas-tabela-produtos-servicos'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import type { ProdutoServicoType } from '../../../_types/produtoServico'
import { NovoProdutoServicoDialog } from '../dialogs/novo-produto'

interface TabelaProdutosFornecedorProps {
  listaProdutos: ProdutoServicoType[]
  carregandoProdutos: boolean
}

export function TabelaProdutosServicos({
  listaProdutos,
  carregandoProdutos,
}: TabelaProdutosFornecedorProps) {
  const tabelaProdutosServicos = useReactTable({
    data: listaProdutos,
    columns: colunasTabelaProdutosServicos,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row-reverse md:justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto">
              <Plus />
              {'Novo'}
            </Button>
          </DialogTrigger>
          <NovoProdutoServicoDialog />
        </Dialog>
        <div className="flex flex-row gap-2">
          <Input
            disabled={listaProdutos.length === 0 || carregandoProdutos}
            placeholder="Filtrar pelo nome do produto/serviço"
            className="w-full md:w-64"
            value={
              (tabelaProdutosServicos
                .getColumn('nome')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={event =>
              tabelaProdutosServicos
                .getColumn('nome')
                ?.setFilterValue(event.target.value)
            }
          />
        </div>
      </div>
      <div className="rounded-md border shadow overflow-auto bg-gray-50 ">
        <Table>
          <TableHeader>
            {tabelaProdutosServicos.getHeaderGroups().map(headerGroup => (
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
            {carregandoProdutos ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={colunasTabelaProdutosServicos.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={colunasTabelaProdutosServicos.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
              </>
            ) : tabelaProdutosServicos.getRowModel().rows?.length > 0 ? (
              tabelaProdutosServicos.getRowModel().rows.map(row => (
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
                  colSpan={colunasTabelaProdutosServicos.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                >
                  Nenhum produto/serviço encontrado!
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
          onClick={() => tabelaProdutosServicos.previousPage()}
          disabled={!tabelaProdutosServicos.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaProdutosServicos.nextPage()}
          disabled={!tabelaProdutosServicos.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

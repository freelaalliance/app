'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
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
  useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import type { ItemAvaliacaoEmpresaType } from '../../../_api/AdmCompras'
import { CadastraItensAvaliativosRecebimentoDialog } from '../dialogs/novos-itens-avaliativos-recebimento'
import { colunasItensAvaliacaoRecebimento } from './colunas-tabela-itens-avaliacao'

interface TabelaItensAvaliacaoEmpresaProps {
  listaItensAvaliacao: ItemAvaliacaoEmpresaType[]
  carregandoItens: boolean
  empresaId: string
}
export function TabelaItensAvaliacaoEmpresa({
  listaItensAvaliacao,
  carregandoItens,
  empresaId
}: TabelaItensAvaliacaoEmpresaProps) {
  const table = useReactTable({
    data: listaItensAvaliacao,
    columns: colunasItensAvaliacaoRecebimento,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row-reverse md:justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shadow bg-sky-400 hover:bg-sky-500 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto px-2">
              <Plus />
              {'Novos itens'}
            </Button>
          </DialogTrigger>
          <CadastraItensAvaliativosRecebimentoDialog empresaId={empresaId} />
        </Dialog>
        </div>
      <div className="rounded-md border shadow-md bg-gray-50">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
            {carregandoItens ? (
              <>
                <TableRow>
                  <TableCell colSpan={colunasItensAvaliacaoRecebimento.length}>
                    <Skeleton className="w-full h-[20px] rounded-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={colunasItensAvaliacaoRecebimento.length}>
                    <Skeleton className="w-full h-[20px] rounded-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={colunasItensAvaliacaoRecebimento.length}>
                    <Skeleton className="w-full h-[20px] rounded-full" />
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
                  colSpan={colunasItensAvaliacaoRecebimento.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                >
                  Nenhuma avaliação de recebimento cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

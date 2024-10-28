'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'

import { PedidosFornecedorType } from '@/app/modulo/compras/(schemas)/compras/schema-compras'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
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

import { NovoPedidoDialog } from '../../dialogs/NovoPedidoDialog'

interface TabelaPedidosProps {
  listaPedidos: Array<PedidosFornecedorType>
  carregandoPedidos: boolean
  novoPedido?: boolean
  fornecedorId?: string
  filtrarFornecedor?: boolean
  colunasTabela: Array<ColumnDef<PedidosFornecedorType>>
}

export function TabelaPedidos({
  listaPedidos,
  carregandoPedidos,
  novoPedido,
  fornecedorId,
  filtrarFornecedor,
  colunasTabela,
}: TabelaPedidosProps) {
  const tabelaPedidosFornecedor = useReactTable({
    data: listaPedidos,
    columns: colunasTabela,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <section className="space-y-2">
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row-reverse md:justify-between">
        {novoPedido && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto">
                <Plus />
                {'Novo Pedido'}
              </Button>
            </DialogTrigger>
            <NovoPedidoDialog fornecedorId={fornecedorId ?? ''} />
          </Dialog>
        )}

        <div className="flex flex-row gap-2">
          <Input
            disabled={listaPedidos.length === 0 || carregandoPedidos}
            placeholder="Filtrar por número do pedido"
            className="w-full md:w-64"
            value={
              (tabelaPedidosFornecedor
                .getColumn('numPedido')
                ?.getFilterValue() as number) ?? ''
            }
            onChange={(event) =>
              tabelaPedidosFornecedor
                .getColumn('numPedido')
                ?.setFilterValue(event.target.value)
            }
          />
          {filtrarFornecedor && (
            <Input
              disabled={listaPedidos.length === 0 || carregandoPedidos}
              placeholder="Filtrar pela razão social"
              className="w-full md:w-64"
              value={
                (tabelaPedidosFornecedor
                  .getColumn('nome')
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                tabelaPedidosFornecedor
                  .getColumn('nome')
                  ?.setFilterValue(event.target.value)
              }
            />
          )}
        </div>
      </div>
      <div className="rounded-md border shadow overflow-auto bg-gray-50 ">
        <Table>
          <TableHeader>
            {tabelaPedidosFornecedor.getHeaderGroups().map((headerGroup) => (
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
            {carregandoPedidos ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={colunasTabela.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={colunasTabela.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
              </>
            ) : tabelaPedidosFornecedor.getRowModel().rows?.length > 0 ? (
              tabelaPedidosFornecedor.getRowModel().rows.map((row) => (
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
                  colSpan={colunasTabela.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                >
                  Nenhum pedido encontrado!
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
          onClick={() => tabelaPedidosFornecedor.previousPage()}
          disabled={!tabelaPedidosFornecedor.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaPedidosFornecedor.nextPage()}
          disabled={!tabelaPedidosFornecedor.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </section>
  )
}

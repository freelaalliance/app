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
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import type { ClienteType } from '../../../_types/clientes'
import { NovoClienteDialog } from '../dialogs/novo-cliente'
import { columnsTabelaCliente } from './colunas-tabela-cliente'
import { Input } from '@/components/ui/input'

interface TabelaClientesProps {
  listaClientes: ClienteType[]
  carregandoClientes: boolean
}

export function TabelaClientes({
  listaClientes,
  carregandoClientes,
}: TabelaClientesProps) {

  const tabelaClientes = useReactTable({
    data: listaClientes,
    columns: columnsTabelaCliente,
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
          <NovoClienteDialog />
        </Dialog>

        <div className="flex flex-row gap-2">
          <Input
            disabled={listaClientes.length === 0 || carregandoClientes}
            placeholder="Filtrar pelo nome do cliente"
            className="w-full md:w-64"
            value={
              (tabelaClientes
                .getColumn('nome')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={event =>
              tabelaClientes
                .getColumn('nome')
                ?.setFilterValue(event.target.value)
            }
          />
        </div>
      </div>
      <div className="rounded-md border shadow overflow-auto bg-gray-50 ">
        <Table>
          <TableHeader>
            {tabelaClientes.getHeaderGroups().map(headerGroup => (
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
            {carregandoClientes ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={columnsTabelaCliente.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={columnsTabelaCliente.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
              </>
            ) : tabelaClientes.getRowModel().rows?.length > 0 ? (
              tabelaClientes.getRowModel().rows.map(row => (
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
                  colSpan={columnsTabelaCliente.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                >
                  Nenhum cliente encontrado!
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
          onClick={() => tabelaClientes.previousPage()}
          disabled={!tabelaClientes.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaClientes.nextPage()}
          disabled={!tabelaClientes.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

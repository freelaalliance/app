'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'

import { FiltroStatusTabela } from '@/components/tables/FiltroStatusTable'
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

import type { FornecedoresEmpresaType } from '../../../(api)/FornecedorApi'
import { NovoFornecedorDialog } from '../../dialogs/NovoFornecedorDialog'

import { colunasFornecedores } from './colunas-tabela-fornecedores'
import { cn } from '@/lib/utils'

interface TabelaFornecedoresProps {
  listaFornecedores: FornecedoresEmpresaType[]
  carregandoFornecedores: boolean
  colunasTabela?: ColumnDef<FornecedoresEmpresaType>[]
  opcaoFiltroSituacao?: boolean
  opcaoFiltroAvaliacao?: boolean
  opcaoNovoFornecedor?: boolean
}

export const optionsStatusCritico = [
  {
    label: 'Crítico',
    value: 'sim',
  },
  {
    label: 'Não crítico',
    value: 'nao',
  },
]

export const optionsStatusAprovado = [
  {
    label: 'Aprovado',
    value: 'sim',
  },
  {
    label: 'Reprovado',
    value: 'nao',
  },
]

export function TabelaFornecedores({
  listaFornecedores,
  carregandoFornecedores,
  colunasTabela,
  opcaoFiltroSituacao = true,
  opcaoFiltroAvaliacao = true,
  opcaoNovoFornecedor = true,
}: TabelaFornecedoresProps) {
  const tabelaFornecedor = useReactTable({
    data: listaFornecedores,
    columns: colunasTabela ?? colunasFornecedores,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-2">
      <div className={cn("flex flex-col items-center gap-2 py-4 justify-start md:flex-row", {
        "md:justify-between": opcaoNovoFornecedor,
        "md:flex-row-reverse": opcaoNovoFornecedor
      })}>
        {opcaoNovoFornecedor && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto">
                <Plus />
                {'Novo'}
              </Button>
            </DialogTrigger>
            <NovoFornecedorDialog />
          </Dialog>
        )}
        <div className="flex flex-row gap-2">
          <Input
            disabled={listaFornecedores.length === 0 || carregandoFornecedores}
            placeholder="Filtrar pela razão social"
            className="w-full md:w-64"
            value={
              (tabelaFornecedor
                .getColumn('nome')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={event =>
              tabelaFornecedor
                .getColumn('nome')
                ?.setFilterValue(event.target.value)
            }
          />
          {opcaoFiltroSituacao && (
            <FiltroStatusTabela
              options={optionsStatusCritico}
              title={'Situação'}
              column={tabelaFornecedor.getColumn('critico')}
            />
          )}
          {opcaoFiltroAvaliacao && (
            <FiltroStatusTabela
              options={optionsStatusAprovado}
              title={'Avaliação'}
              column={tabelaFornecedor.getColumn('aprovado')}
            />)}
        </div>
      </div>
      <div className="rounded-md border shadow overflow-auto bg-gray-50 ">
        <Table>
          <TableHeader>
            {tabelaFornecedor.getHeaderGroups().map(headerGroup => (
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
            {carregandoFornecedores ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={colunasFornecedores.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={colunasFornecedores.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
              </>
            ) : tabelaFornecedor.getRowModel().rows?.length > 0 ? (
              tabelaFornecedor.getRowModel().rows.map(row => (
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
                  colSpan={colunasFornecedores.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                >
                  Nenhum fornecedor encontrado!
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
          onClick={() => tabelaFornecedor.previousPage()}
          disabled={!tabelaFornecedor.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md w-full md:w-auto"
          variant="outline"
          size="sm"
          onClick={() => tabelaFornecedor.nextPage()}
          disabled={!tabelaFornecedor.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

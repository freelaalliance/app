'use client'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { colunasCalibracao } from './colunas-lista-calibracao'
import { Calibracao } from '../../../schemas/(calibracoes)/SchemaNovaCalibracao'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ArrowBigDownDash, Plus } from 'lucide-react'
import { NovaCalibracaoDialog } from '../../dialogs/(calibracoes)/NovaCalibracaoDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { gerarRelatorioCalibracoes } from '../../../utils/relatorios'

interface TabelaCalibracoesProps {
  data: Calibracao[]
  carregandoCalibracoes: boolean
}

export function TabelaCalibracoes({ data, carregandoCalibracoes }: TabelaCalibracoesProps) {

  const table = useReactTable({
    data,
    columns: colunasCalibracao,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const baixarRelatorioInstrumentos = async () => {
    const arquivo = await gerarRelatorioCalibracoes({
      dados: table.getRowModel().rows.map((row) => {
        return {
          codigo: row.getValue('codigo'),
          nome: row.getValue('nome'),
          data: row.getValue('data'),
          localizacao: row.getValue('localizacao'),
          marca: row.getValue('marca'),
          status: row.getValue('status'),
        }
      })
    })

    toast.success('Relatorio gerado com sucesso!', {
      closeButton: true,
      action: {
        label: 'Clique para baixar',
        onClick: () => {
          const url = window.URL.createObjectURL(arquivo)
          const a = document.createElement('a')
          a.href = url
          a.download = 'relatório-calibracoes.xlsx'
          a.click()
        },
      },
    })
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col items-center gap-2 md:py-4 md:flex-row-reverse md:justify-between">
        <div className="flex flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto"
              >
                <Plus />
                {'Novo'}
              </Button>
            </DialogTrigger>
            <NovaCalibracaoDialog />
          </Dialog>
          <Button
            className="shadow bg-padrao-gray-250 hover:bg-gray-900 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto"
            onClick={baixarRelatorioInstrumentos}
          >
            <ArrowBigDownDash className="size-5" />
            {'Exportar'}
          </Button>
        </div>

        <div className='flex flex-row gap-2'>
          <Input
            placeholder="Filtrar pelo nome do instrumento..."
            className="w-full md:w-64"
            disabled={data?.length === 0}
            value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('nome')?.setFilterValue(event.target.value)
            }
          />
        </div>
      </div>
      <div className="rounded-md border shadow-md bg-gray-50">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
            {
              carregandoCalibracoes ? (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={colunasCalibracao.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasCalibracao.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasCalibracao.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                </>
              ) : table.getRowModel().rows?.length > 0 ? (
                table.getRowModel().rows.map((row) => (
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
                    colSpan={colunasCalibracao.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    Nenhuma calibração encontrada!
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
    </div>
  )
}

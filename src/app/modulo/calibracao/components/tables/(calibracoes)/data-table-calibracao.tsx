'use client'

import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowBigDownDash, Plus } from 'lucide-react'
import { toast } from 'sonner'

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

import type { Calibracao } from '../../../schemas/(calibracoes)/SchemaNovaCalibracao'
import { gerarRelatorioCalibracoes } from '../../../utils/relatorios'
import { NovaCalibracaoDialog } from '../../dialogs/(calibracoes)/NovaCalibracaoDialog'

import { colunasCalibracao } from './colunas-lista-calibracao'
import { ConfigColunas } from './config-colunas-calibracao'
import { FiltroStatusCalibracao } from './filtro-status-calibracao'

interface TabelaCalibracoesProps {
  data: Calibracao[]
  carregandoCalibracoes: boolean
}

export const optionsStatusCalibracao = [
  {
    label: 'Aprovado',
    value: 'aprovado',
  },
  {
    label: 'Reprovado',
    value: 'reprovado',
  },
]

export function TabelaCalibracoes({
  data,
  carregandoCalibracoes,
}: TabelaCalibracoesProps) {
  const tabela = useReactTable({
    data,
    initialState: {
      columnVisibility: {
        nome: true,
        codigo: true,
        data: true,
        localizacao: false,
        resolucao: false,
        marca: false,
        status: true,
        usuario: true,
        observacao: false,
        frequencia: true,
        erroEncontrado: true,
        incertezaTendenciaEncontrado: true,
        toleranciaEstabelicida: true,
        numeroCertificado: true,
        realizadoEm: true,
      },
    },
    columns: colunasCalibracao,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const baixarRelatorioInstrumentos = async () => {
    const arquivo = await gerarRelatorioCalibracoes({
      dados: tabela.getRowModel().rows.map(row => {
        return {
          codigo: row.getValue('codigo'),
          nome: row.getValue('nome'),
          marca: row.getValue('marca'),
          localizacao: row.getValue('localizacao'),
          resolucao: row.getValue('resolucao'),
          frequencia: row.getValue('frequencia'),
          data: row.getValue('data'),
          usuario: row.getValue('usuario'),
          numeroCertificado: row.getValue('numeroCertificado'),
          tolerancia: row.getValue('tolerancia'),
          incertezaTendencia: row.getValue('incertezaTendencia'),
          erroEncontrado: row.getValue('erroEncontrado'),
          observacao: row.getValue('observacao'),
          status: row.getValue('status'),
        }
      }),
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
    <div className="w-full space-y-2 ">
      <div className="flex flex-col items-center gap-2 md:py-4 md:flex-row-reverse md:justify-between">
        <div className="flex flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto">
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
        <div className="flex flex-row gap-2">
          <ConfigColunas table={tabela} />
          <Input
            placeholder="Filtrar pelo nome do instrumento..."
            className="w-full md:w-64"
            disabled={data?.length === 0}
            value={(tabela.getColumn('nome')?.getFilterValue() as string) ?? ''}
            onChange={event =>
              tabela.getColumn('nome')?.setFilterValue(event.target.value)
            }
          />
          <FiltroStatusCalibracao
            options={optionsStatusCalibracao}
            title="Filtrar status"
            column={tabela.getColumn('status')}
          />
        </div>
      </div>
      <div className="rounded-md border shadow-md bg-gray-50 overflow-auto">
        <Table>
          <TableHeader>
            {tabela.getHeaderGroups().map(headerGroup => (
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
            {carregandoCalibracoes ? (
              <>
                <TableRow>
                  <TableCell colSpan={colunasCalibracao.length}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={colunasCalibracao.length}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={colunasCalibracao.length}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                </TableRow>
              </>
            ) : tabela.getRowModel().rows?.length > 0 ? (
              tabela.getRowModel().rows.map(row => (
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
      <div className="flex items-center justify-end space-x-2 py-2">
        <Button
          className="enabled:shadow-md"
          variant="outline"
          size="sm"
          onClick={() => tabela.previousPage()}
          disabled={!tabela.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          className="enabled:shadow-md"
          variant="outline"
          size="sm"
          onClick={() => tabela.nextPage()}
          disabled={!tabela.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

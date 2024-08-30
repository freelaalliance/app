'use client'

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { DadosEquipamentoType } from "../../../schemas/EquipamentoSchema"
import { colunasEquipamento } from "./colunas-tabela-equipamentos"
import { Button } from "@/components/ui/button"
import { ArrowBigDownDash, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { NovoEquipamentoDialog } from "../../dialogs/(equipamento)/NovoEquipamentoDialog"
import { gerarRelatorioEquipamentos } from "../../../utils/relatorio"
import { toast } from "sonner"

interface TabelaEquipamentosProps {
  data: Array<DadosEquipamentoType>
  carregandoEquipamentos: boolean
}

export function TabelaEquipamentos({ data, carregandoEquipamentos }: TabelaEquipamentosProps) {
  const tabela = useReactTable({
    data,
    columns: colunasEquipamento,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const baixarRelatorioEquipamentos = async () => {
    const arquivo = await gerarRelatorioEquipamentos({
      dados: tabela.getRowModel().rows.map((row) => {
        return {
          codigo: row.getValue('codigo'),
          nome: row.getValue('nome'),
          frequencia: row.getValue('frequencia'),
          inspecionadoEm: row.getValue('inspecionadoEm') ?? null,
          concertadoEm: row.getValue('concertadoEm') ?? null,
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
          a.download = 'relatório-equipamentos.xlsx'
          a.click()
        },
      },
    })
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-col items-center gap-2 py-2 md:flex-row-reverse md:justify-between">
        <div className="flex flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="shadow bg-padrao-red hover:bg-red-800 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto">
                <Plus className="size-5" />
                {'Novo'}
              </Button>
            </DialogTrigger>
            <NovoEquipamentoDialog />
          </Dialog>
          <Button
            className="shadow bg-padrao-gray-250 hover:bg-gray-900 flex md:justify-between justify-center md:gap-4 gap-2 w-full md:w-auto"
            onClick={baixarRelatorioEquipamentos}
          >
            <ArrowBigDownDash className="size-5" />
            {'Exportar'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Filtrar pelo nome do equipamento..."
            className="w-full md:w-64"
            disabled={data?.length === 0}
            value={(tabela.getColumn('nome')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              tabela.getColumn('nome')?.setFilterValue(event.target.value)
            }
          />
          <Input
            placeholder="Filtrar por codigo..."
            className="w-full md:w-64"
            disabled={data?.length === 0}
            value={(tabela.getColumn('codigo')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              tabela.getColumn('codigo')?.setFilterValue(event.target.value)
            }
          />
        </div>
      </div>
      <div className="rounded-md border shadow-md bg-gray-50">
        <Table>
          <TableHeader>
            {tabela.getHeaderGroups().map((headerGroup) => (
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
              carregandoEquipamentos ? (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={colunasEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                </>
              ) : tabela.getRowModel().rows?.length > 0 ? (
                tabela.getRowModel().rows.map((row) => (
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
                    colSpan={colunasEquipamento.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    Nenhum equipamento encontrado!
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-2 gap-2 md:w-64 md:float-right">
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
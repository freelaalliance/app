'use client'

import { Button } from "@/components/ui/button";
import { DadosInspecoesEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { colunasInspecoesEquipamento } from "./colunas-tabela-inspecoes";
import { Skeleton } from "@/components/ui/skeleton";
import { FiltroStatusInspecao } from "./filtro-status-tabela-inspecoes";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NovaInspecaoEquipamentoDialog } from "../../dialogs/(inspecao)/NovaInspecaoEquipamentoDialog";
import { useState } from "react";
import { Stethoscope } from "lucide-react";

interface TabelaInspecoesEquipamentoProps {
  idEquipamento: string
  data: Array<DadosInspecoesEquipamentoType>
  carregandoInspecoes: boolean
}

export const optionsStatusInspecao = [
  {
    label: 'Aprovado',
    value: 'aprovado',
  },
  {
    label: 'Reprovado',
    value: 'reprovado',
  },
]

export function TabelaInspecoesEquipamento({ idEquipamento, data, carregandoInspecoes }: TabelaInspecoesEquipamentoProps) {
  const [modalInspecaoAberto, abrirModalInspecao] = useState(false)
  const tabela = useReactTable({
    data,
    columns: colunasInspecoesEquipamento,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  return (
    <div className="space-y-2 w-full">
      <div className="flex gap-2">
        <Dialog open={modalInspecaoAberto} onOpenChange={abrirModalInspecao}>
          <DialogTrigger asChild>
            <Button className="shadow bg-sky-500 hover:bg-sky-600 gap-2">
              <Stethoscope className="size-5" />
              Nova inspeção
            </Button>
          </DialogTrigger>
          <NovaInspecaoEquipamentoDialog idEquipamento={idEquipamento ?? ''} fecharModalInspecao={() => {
            abrirModalInspecao(false)
          }} />
        </Dialog>
        <FiltroStatusInspecao
          options={optionsStatusInspecao}
          title="Status inspeção"
          column={tabela.getColumn('statusInspecao')}
        />
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
              carregandoInspecoes ? (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={colunasInspecoesEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasInspecoesEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasInspecoesEquipamento.length}
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
                    colSpan={colunasInspecoesEquipamento.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    Nenhuma inspeção encontrada!
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
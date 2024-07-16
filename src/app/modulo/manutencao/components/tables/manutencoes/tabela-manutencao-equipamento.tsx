'use client'

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { DadosManutencaoEquipamentoType } from "../../../schemas/ManutencaoSchema";
import { colunasManutencaoEquipamento } from "./colunas-tabela-manutencao";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NovaOrdemManutencaoDialog } from "../../dialogs/(manutencao)/DialogNovaOrdemManutencao";

interface TabelaManutencaoProps {
  idEquipamento: string;
  data: Array<DadosManutencaoEquipamentoType>;
  carregandoManutencoes: boolean;
}

export function TabelaManutencoesEquipamento({ idEquipamento, data, carregandoManutencoes }: TabelaManutencaoProps) {
  const tabela = useReactTable({
    data,
    columns: colunasManutencaoEquipamento,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const manutencaoAberto = data.filter((manutencoes) => manutencoes.criadoEm && (!manutencoes.finalizadoEm && !manutencoes.canceladoEm))

  return (
    <div className="space-y-2">
      <div className="flex-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={manutencaoAberto.length > 0}
              className="shadow bg-sky-500 hover:bg-sky-600 gap-2"
            >
              <Plus className="size-5" />
              Abrir ordem de manutenção
            </Button>
          </DialogTrigger>
          <NovaOrdemManutencaoDialog equipamentoId={idEquipamento}/>
        </Dialog>
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
              carregandoManutencoes ? (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={colunasManutencaoEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasManutencaoEquipamento.length}
                    >
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={colunasManutencaoEquipamento.length}
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
                    colSpan={colunasManutencaoEquipamento.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    Nenhuma manutenção encontrada!
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
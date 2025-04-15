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
import type { CategoriaDocumentoType } from '../../../_api/AdmDocumentos'
import { CadastraCategoriaDocumentosDialog } from '../dialogs/nova-categoria-documentos-dialog'
import { colunasCategoriasDocumentos } from './colunas-tabela-categorias-documentos'

interface TabelaCategoriasDocumentosEmpresaProps {
  listaCategorias: CategoriaDocumentoType[]
  carregandoCategorias: boolean
  empresaId: string
}
export function TabelaCategoriaDocumentos({
  listaCategorias,
  carregandoCategorias,
  empresaId,
}: TabelaCategoriasDocumentosEmpresaProps) {
  const table = useReactTable({
    data: listaCategorias,
    columns: colunasCategoriasDocumentos,
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
              {'Nova categoria'}
            </Button>
          </DialogTrigger>
          <CadastraCategoriaDocumentosDialog empresaId={empresaId} />
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
            {carregandoCategorias ? (
              <>
                <TableRow>
                  <TableCell colSpan={colunasCategoriasDocumentos.length}>
                    <Skeleton className="w-full h-[20px] rounded-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={colunasCategoriasDocumentos.length}>
                    <Skeleton className="w-full h-[20px] rounded-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={colunasCategoriasDocumentos.length}>
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
                  colSpan={colunasCategoriasDocumentos.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                >
                  Nenhuma categoria de documentos cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

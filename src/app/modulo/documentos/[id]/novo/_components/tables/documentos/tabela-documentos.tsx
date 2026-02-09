'use client'

import type { CategoriaDocumentoType } from '@/app/modulo/administrativo/modulos/_api/AdmDocumentos'
import type { DocumentoType, PastaDocumentoType } from '@/app/modulo/documentos/_api/documentos'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Check, FolderOpen, PlusCircle } from 'lucide-react'
import React from 'react'

interface TabelaDocumentosProps {
  carregandoDados?: boolean
  colunasDocumento: Array<ColumnDef<DocumentoType>>
  dadosDocumentos: Array<DocumentoType>
  categoriasDocumento: Array<CategoriaDocumentoType>
  pastasDocumento?: Array<PastaDocumentoType>
}

export function TabelaDocumentos({
  dadosDocumentos,
  carregandoDados,
  colunasDocumento,
  categoriasDocumento,
  pastasDocumento = [],
}: TabelaDocumentosProps) {
  const [open, setOpen] = React.useState(false)
  const [openPasta, setOpenPasta] = React.useState(false)
  const table = useReactTable({
    data: dadosDocumentos,
    columns: colunasDocumento,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const facets = table.getColumn('categoriaDocumentoNome')?.getFacetedUniqueValues()
  const selectedValues = new Set(table.getColumn('categoriaDocumentoNome')?.getFilterValue() as string[])

  const facetsPasta = table.getColumn('pastaNome')?.getFacetedUniqueValues()
  const selectedPastas = new Set(table.getColumn('pastaNome')?.getFilterValue() as string[])

  const pastasUnicas = React.useMemo(() => {
    const nomes = new Set<string>()
    for (const doc of dadosDocumentos) {
      if (doc.pasta?.nome) {
        nomes.add(doc.pasta.nome)
      }
    }
    return Array.from(nomes).sort()
  }, [dadosDocumentos])

  return (
    <section className="space-y-2">
      <div className="flex flex-col items-center gap-2 md:py-4 md:flex-row">
        <Input
          placeholder="Filtrar pelo código do documento"
          className="w-full md:w-64"
          disabled={dadosDocumentos?.length === 0}
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed" disabled={dadosDocumentos?.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {"Categorias do documento"}
              {selectedValues?.size > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {selectedValues.size}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedValues.size > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {`${selectedValues.size} selecionados`}
                      </Badge>
                    ) : (
                      categoriasDocumento
                        .filter((categoria) => selectedValues.has(categoria.nome))
                        .map((categoria) => (
                          <Badge
                            variant="secondary"
                            key={categoria.id}
                            className="rounded-sm px-1 font-normal"
                          >
                            {categoria.nome}
                          </Badge>
                        ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Command>
              <CommandInput placeholder="Buscar por categoria" className="h-9" />
              <CommandList>
                <CommandEmpty>Nenhuma categoria encontrada</CommandEmpty>
                <CommandGroup>
                  {categoriasDocumento.map((categoria) => {
                    const isSelected = selectedValues.has(categoria.nome)
                    return (
                      <CommandItem
                        key={categoria.id}
                        value={categoria.nome}
                        onSelect={() => {
                          if (isSelected) {
                            selectedValues.delete(categoria.nome)
                          } else {
                            selectedValues.add(categoria.nome)
                          }
                          const filterValues = Array.from(selectedValues)
                          table.getColumn('categoriaDocumentoNome')?.setFilterValue(
                            filterValues.length ? filterValues : undefined,
                          )
                        }}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <Check className={cn('h-4 w-4')} />
                        </div>
                        <span>{categoria.nome}</span>
                        {facets?.get(categoria.nome) && (
                          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                            {facets.get(categoria.nome)}
                          </span>
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {selectedValues.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => table.getColumn('categoriaDocumentoNome')?.setFilterValue(undefined)}
                        className="justify-center text-center"
                      >
                        Limpar filtros
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Popover open={openPasta} onOpenChange={setOpenPasta}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed" disabled={dadosDocumentos?.length === 0}>
              <FolderOpen className="mr-2 h-4 w-4" />
              {"Pastas"}
              {selectedPastas?.size > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {selectedPastas.size}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedPastas.size > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {`${selectedPastas.size} selecionadas`}
                      </Badge>
                    ) : (
                      Array.from(selectedPastas).map((nomePasta) => (
                        <Badge
                          variant="secondary"
                          key={nomePasta}
                          className="rounded-sm px-1 font-normal"
                        >
                          {nomePasta}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Command>
              <CommandInput placeholder="Buscar por pasta" className="h-9" />
              <CommandList>
                <CommandEmpty>Nenhuma pasta encontrada</CommandEmpty>
                <CommandGroup>
                  {pastasUnicas.map((nomePasta) => {
                    const isSelected = selectedPastas.has(nomePasta)
                    return (
                      <CommandItem
                        key={nomePasta}
                        value={nomePasta}
                        onSelect={() => {
                          if (isSelected) {
                            selectedPastas.delete(nomePasta)
                          } else {
                            selectedPastas.add(nomePasta)
                          }
                          const filterValues = Array.from(selectedPastas)
                          table.getColumn('pastaNome')?.setFilterValue(
                            filterValues.length ? filterValues : undefined,
                          )
                        }}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <Check className={cn('h-4 w-4')} />
                        </div>
                        <span>{nomePasta}</span>
                        {facetsPasta?.get(nomePasta) && (
                          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                            {facetsPasta.get(nomePasta)}
                          </span>
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {selectedPastas.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => table.getColumn('pastaNome')?.setFilterValue(undefined)}
                        className="justify-center text-center"
                      >
                        Limpar filtros
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="rounded-md border shadow bg-gray-50">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
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
            {carregandoDados ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={colunasDocumento.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={colunasDocumento.length}
                    className="h-16 text-center text-padrao-gray-200 text-sm font-medium mt-5 md:text-base lg:text-lg"
                  >
                    <Skeleton className="h-4 w-full " />
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
                  colSpan={colunasDocumento.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm mt-5 md:text-base lg:text-lg"
                >
                  Nenhum documento encontrado!
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
    </section>
  )
}

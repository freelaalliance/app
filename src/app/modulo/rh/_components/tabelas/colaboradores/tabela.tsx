'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'
import { colunasColaboradores } from './colunas-tabela-colaboradores'

interface TabelaColaboradoresProps {
  listaColaboradores: Array<Contratacao>
  carregandoColaboradores: boolean
  colunasTabela: ColumnDef<Contratacao>[]
}

export function TabelaColaboradores({
  listaColaboradores,
  carregandoColaboradores,
  colunasTabela,
}: TabelaColaboradoresProps) {
  const [filtroCargo, setFiltroCargo] = useState<string>('todos')
  
  // Extrair lista única de cargos de forma otimizada
  const cargosDisponiveis = useMemo(() => {
    if (!listaColaboradores || listaColaboradores.length === 0) return []
    
    const cargosMap = new Map()
    
    for (const contratacao of listaColaboradores) {
      const cargo = contratacao?.cargo
      if (cargo?.id && cargo?.nome && !cargosMap.has(cargo.id)) {
        cargosMap.set(cargo.id, cargo)
      }
    }
    
    return Array.from(cargosMap.values()).sort((a, b) => 
      a.nome.localeCompare(b.nome, 'pt-BR')
    )
  }, [listaColaboradores])

  // Filtro por cargo específico otimizado
  const colaboradoresFiltrados = useMemo(() => {
    if (!listaColaboradores || listaColaboradores.length === 0) return []
    
    if (filtroCargo === 'todos') return listaColaboradores
    
    return listaColaboradores.filter(contratacao => {
      if (filtroCargo === 'sem-cargo') {
        return !contratacao?.cargo?.id
      }
      return contratacao?.cargo?.id === filtroCargo
    })
  }, [listaColaboradores, filtroCargo])

  const tabela = useReactTable({
    data: colaboradoresFiltrados,
    columns: colunasTabela,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.trim() === '') return true
      
      const contratacao = row.original as Contratacao
      const searchTerm = filterValue.toLowerCase().trim()
      
      // Cache dos valores para evitar múltiplas operações
      const nome = contratacao?.colaborador?.pessoa?.nome?.toLowerCase() || ''
      const email = contratacao?.colaborador?.pessoa?.EmailPessoa?.[0]?.email?.toLowerCase() || ''
      const documento = contratacao?.colaborador?.documento?.toLowerCase() || ''
      const cargo = contratacao?.cargo?.nome?.toLowerCase() || ''
      
      return nome.includes(searchTerm) ||
             email.includes(searchTerm) ||
             documento.includes(searchTerm) ||
             cargo.includes(searchTerm)
    },
  })

  // Função otimizada para o filtro de texto
  const handleFiltroTexto = useCallback((value: string) => {
    tabela.setGlobalFilter(value)
  }, [tabela])
  
  // Função para filtro de cargo
  const handleFiltroCargo = useCallback((value: string) => {
    setFiltroCargo(value)
  }, [])

  // Reset filtro de cargo se o cargo selecionado não existe mais na lista
  useEffect(() => {
    if (filtroCargo !== 'todos' && filtroCargo !== 'sem-cargo') {
      const cargoExiste = cargosDisponiveis.some(cargo => cargo.id === filtroCargo)
      if (!cargoExiste) {
        setFiltroCargo('todos')
      }
    }
  }, [cargosDisponiveis, filtroCargo])

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row md:justify-between">
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <Input
            disabled={listaColaboradores.length === 0 || carregandoColaboradores}
            placeholder="Filtrar por nome do colaborador"
            value={
              (tabela.getColumn('colaborador')?.getFilterValue() as string) ?? ''
            }
            onChange={e =>
              tabela.getColumn('colaborador')?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
          <Select 
            disabled={listaColaboradores.length === 0 || carregandoColaboradores || cargosDisponiveis.length === 0} 
            value={filtroCargo} 
            onValueChange={handleFiltroCargo}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os cargos</SelectItem>
              <SelectItem value="sem-cargo">Sem cargo definido</SelectItem>
              {cargosDisponiveis.map(cargo => (
                <SelectItem key={cargo.id} value={cargo.id}>
                  {cargo.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border shadow overflow-auto bg-gray-50">
        <Table>
          <TableHeader>
            {tabela.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {carregandoColaboradores ? (
              Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
                <TableRow key={i}>
                  <TableCell
                    colSpan={colunasColaboradores.length}
                    className="h-16 text-center"
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : tabela.getRowModel().rows.length > 0 ? (
              tabela.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
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
                  colSpan={colunasColaboradores.length}
                  className="h-16 text-center text-padrao-gray-200 text-sm font-medium"
                >
                  Nenhum colaborador encontrado!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => tabela.previousPage()}
          disabled={!tabela.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
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

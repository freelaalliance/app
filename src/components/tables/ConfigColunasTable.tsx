import type { Table } from '@tanstack/react-table'
import { SlidersVertical } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatCamelCase } from '@/lib/utils'

interface ConfigColunasTabelaProps<TData> {
  tabela: Table<TData>
}

export function ConfigColunasTabela<TData>({
  tabela,
}: ConfigColunasTabelaProps<TData>) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-auto shadow-md ml-auto">
              <span className="flex md:hidden">Colunas</span>
              <SlidersVertical className="h-4 w-4 hidden md:flex" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Configurar colunas da tabela</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Selecione as colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tabela
          .getAllColumns()
          .filter(
            column =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map(column => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {formatCamelCase(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

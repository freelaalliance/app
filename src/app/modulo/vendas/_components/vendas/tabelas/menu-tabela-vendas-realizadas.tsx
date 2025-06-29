import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
import type { VendasCliente } from '../../../_schemas/vendas.schema'

interface MenuTabelaVendaClienteProps {
  dadosVenda: VendasCliente
}

export function MenuTabelaVendaCliente({
  dadosVenda,
}: MenuTabelaVendaClienteProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical className="size-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link href={`/modulo/vendas/visualizar/${dadosVenda.id}`}>
            Visualizar venda
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

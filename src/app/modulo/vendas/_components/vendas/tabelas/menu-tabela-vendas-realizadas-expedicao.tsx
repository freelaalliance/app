import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
import type { VendasCliente } from '../../../_schemas/vendas.schema'
import { ExpedicaoDialog } from '@/app/modulo/expedicao/_components/dialogs/expedicao-dialog'

interface MenuTabelaExpedicaoVendaProps {
  dadosVenda: VendasCliente
}

export function MenuTabelaExpedicaoVenda({
  dadosVenda,
}: MenuTabelaExpedicaoVendaProps) {
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
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Expedir venda
            </DropdownMenuItem>
          </DialogTrigger>
          <ExpedicaoDialog dadosVenda={dadosVenda}/>
        </Dialog>
        <DropdownMenuItem asChild>
          <Link href={`/modulo/vendas/visualizar/${dadosVenda.id}`}>
            Visualizar venda
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

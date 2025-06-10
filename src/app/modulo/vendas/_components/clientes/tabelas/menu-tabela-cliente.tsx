import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import type { ClienteType } from '../../../_types/clientes'
import { ExcluirClienteDialog } from '../dialogs/remover-produto'
import Link from 'next/link'

interface MenuTabelaClienteProps {
  dadosCliente: ClienteType
}

export function MenuTabelaCliente({ dadosCliente }: MenuTabelaClienteProps) {
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
          <Link href={`clientes/venda?cliente=${dadosCliente.id}`}>
            Nova venda
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`clientes/visualizar/${dadosCliente.id}`}>
            Visualizar Cliente
          </Link>
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault()
              }}
            >
              Excluir Cliente
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <ExcluirClienteDialog id={dadosCliente.id} nome={dadosCliente.nome} />
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

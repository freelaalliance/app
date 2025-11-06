import { MoreVertical } from 'lucide-react'

import type { PedidosFornecedorType } from '@/app/modulo/compras/(schemas)/compras/schema-compras'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { CancelarPedido } from '../../dialogs/CancelarPedidoDialog'
import { ExcluirPedido } from '../../dialogs/ExcluirPedidoDialog'
import { VisualizaDadosPedido } from '../../dialogs/VisualizaDadosPedidoDialog'

interface MenuTabelaPedidosFornecedorProps {
  pedido: PedidosFornecedorType
}

export function MenuTabelaPedidosFornecedor({
  pedido,
}: MenuTabelaPedidosFornecedorProps) {
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
              Visualizar pedido
            </DropdownMenuItem>
          </DialogTrigger>
          <VisualizaDadosPedido dadosPedido={pedido} />
        </Dialog>
        {!pedido.recebido && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={e => {
                  e.preventDefault()
                }}
              >
                Excluir pedido
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <ExcluirPedido
              idFornecedor={pedido.fornecedor.id}
              idPedido={pedido.id}
            />
          </AlertDialog>
        )}
        {/* {!pedido.recebido && !pedido.cancelado && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={e => {
                  e.preventDefault()
                }}
              >
                Cancelar pedido
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <CancelarPedido
              idFornecedor={pedido.fornecedor.id}
              idPedido={pedido.id}
            />
          </AlertDialog>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

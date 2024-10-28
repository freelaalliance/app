import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import NovoPedidoView, { NovoPedidoProps } from '../../(views)/NovoPedido'

export function NovoPedidoDialog({ fornecedorId }: NovoPedidoProps) {
  return (
    <DialogContent className="overflow-auto max-h-full max-w-5xl">
      <DialogHeader>
        <DialogTitle>Novo pedido</DialogTitle>
        <DialogDescription>
          Crie um novo pedido de compra para o fornecedor
        </DialogDescription>
      </DialogHeader>
      <NovoPedidoView fornecedorId={fornecedorId} />
    </DialogContent>
  )
}

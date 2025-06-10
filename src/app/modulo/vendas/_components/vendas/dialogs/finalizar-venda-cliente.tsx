import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ItemCarrinhoType } from '../../../_types/venda'
import { FormularioVendaCliente } from '../forms/FormularioFinalizacaoVenda'

interface FinalizarVendaClienteDialogProps {
  itens: Array<ItemCarrinhoType>
  idCliente: string
  vendaRealizada: () => void
}

export function FinalizarVendaClienteDialog({ itens, idCliente, vendaRealizada }: FinalizarVendaClienteDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Finalizar Compra</DialogTitle>
      </DialogHeader>
      <FormularioVendaCliente idCliente={idCliente} itens={itens} vendaRealizada={vendaRealizada}/>
    </DialogContent>
  )
}

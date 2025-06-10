import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ClienteType } from '../../../_types/clientes'
import { FormualarioCliente } from '../form/clientes-form'

interface EditarClienteDialogProps {
  cliente: ClienteType
}

export function EdicaoClienteDialog({
  cliente,
}: EditarClienteDialogProps) {
  return (
    <DialogContent className="overflow-auto max-h-full max-w-auto">
      <DialogHeader>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogDescription>
          Atualize os dados do cliente selecionado.
        </DialogDescription>
      </DialogHeader>
      
    </DialogContent>
  )
}
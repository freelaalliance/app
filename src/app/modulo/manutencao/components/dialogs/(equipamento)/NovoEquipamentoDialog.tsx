import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { NovoEquipamentoForm } from '../../forms/(equipamento)/FormularioNovoEquipamento'

export function NovoEquipamentoDialog() {
  return (
    <DialogContent className="max-w-5xl overflow-auto">
      <DialogHeader>
        <DialogTitle>Novo equipamento</DialogTitle>
        <DialogDescription>
          Área para cadastro de novos equipamentos
        </DialogDescription>
      </DialogHeader>
      <NovoEquipamentoForm />
    </DialogContent>
  )
}

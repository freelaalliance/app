import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { FormularioNovaEmpresa } from '../forms/FormularioEmpresa'

export function DialogNovaEmpresa() {
  return (
    <DialogContent className="max-w-5xl h-full overflow-auto md:h-auto">
      <DialogHeader>
        <DialogTitle>Nova Empresa</DialogTitle>
        <DialogDescription>Cadastrar uma nova empresa</DialogDescription>
      </DialogHeader>
      <FormularioNovaEmpresa />
    </DialogContent>
  )
}

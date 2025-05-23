import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { FormularioEdicaoEmpresa, type EdicaoEmpresaProps } from '../forms/FormularioEdicaoEmpresa'

export function DialogEdicaoEmpresa({ dadosEmpresa }: EdicaoEmpresaProps) {
  return (
    <DialogContent className="max-w-5xl h-full overflow-auto md:h-auto">
      <DialogHeader>
        <DialogTitle>Edição de Empresa</DialogTitle>
        <DialogDescription>{`Alterar dados da empresa ${dadosEmpresa?.nome}`}</DialogDescription>
      </DialogHeader>
      <FormularioEdicaoEmpresa dadosEmpresa={dadosEmpresa} />
    </DialogContent>
  )
}

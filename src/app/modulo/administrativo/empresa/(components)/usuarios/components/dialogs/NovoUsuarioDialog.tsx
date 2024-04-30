import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { EmpresaViewProps } from '../../../../[id]/page'
import { NovoUsuarioForm } from '../forms/NovoUsuarioForm'

export function DialogNovoUsuario({ idEmpresa }: EmpresaViewProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo usuário</DialogTitle>
        <DialogDescription>Crie usuários da empresa</DialogDescription>
      </DialogHeader>
      <NovoUsuarioForm idEmpresa={idEmpresa} />
    </DialogContent>
  )
}

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { FormularioNovoPerfil } from '../forms/NovoPerfil/FormularioNovoPerfil'

interface NovoPerfilProps {
  empresa: string
}

export function DialogNovoPerfil({ empresa }: NovoPerfilProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo perfil</DialogTitle>
        <DialogDescription>
          Crie novos perfis para os usuarios com as funções que o usuário terá
          permissão
        </DialogDescription>
      </DialogHeader>

      <FormularioNovoPerfil idEmpresa={empresa} />
    </DialogContent>
  )
}

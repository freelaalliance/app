import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  FormularioEdicaoPerfil,
  FormularioEdicaoPerfilProps,
} from '../forms/EditaPerfil/FormularioEdicaoPerfil'

export function DialogEditaPerfil({
  idPerfil,
  nomePerfil,
  perfilAdministrativo,
  idEmpresa,
}: FormularioEdicaoPerfilProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar perfil</DialogTitle>
        <DialogDescription>
          Modifique perfis para os usuários com as funções que o mesmo terá
          permissão de acesso
        </DialogDescription>
      </DialogHeader>

      <FormularioEdicaoPerfil
        idPerfil={idPerfil}
        nomePerfil={nomePerfil}
        perfilAdministrativo={perfilAdministrativo}
        idEmpresa={idEmpresa}
      />
    </DialogContent>
  )
}

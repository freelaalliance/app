import { axiosInstance, RespostaType } from '@/lib/AxiosLib'

interface PropsModificacaoSenhaUsuarioInterface {
  id: string
  senhaAntiga: string
  novaSenha: string
}
export async function AlterarSenhaUsuario({
  id,
  senhaAntiga,
  novaSenha,
}: PropsModificacaoSenhaUsuarioInterface): Promise<RespostaType> {
  const response = await axiosInstance.patch<RespostaType>(
    `admin/usuarios/${id}/senha`,
    {
      senhaAntiga,
      novaSenha,
    },
  )

  return response.data
}

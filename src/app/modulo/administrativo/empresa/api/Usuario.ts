import { type RespostaType, axiosInstance } from '@/lib/AxiosLib'

import type {
  FormularioEdicaoUsuarioType,
  FormularioNovoUsuarioType,
} from '../schemas/SchemaUsuarios'

export async function criarUsuario(dadosUsuario: FormularioNovoUsuarioType) {
  const response = await axiosInstance.post<RespostaType>(
    'admin/usuarios',
    dadosUsuario
  )

  return response.data
}

export async function alterarStatusUsuario(idUsuario: string, status: boolean) {
  const response = await axiosInstance.patch<RespostaType>(
    `admin/usuarios/${idUsuario}/status`,
    {
      status,
    }
  )

  return response.data
}

export async function alterarDadosUsuario(
  dadosUsuario: FormularioEdicaoUsuarioType
) {
  const response = await axiosInstance.put<RespostaType>(
    `admin/usuarios/${dadosUsuario.id}`,
    {
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      perfil: dadosUsuario.perfil,
    }
  )

  return response.data
}

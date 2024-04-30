'use server'

import { axiosInstance, RespostaType } from '@/lib/AxiosLib'

import { FormularioPerfilType, PerfilType } from '../schemas/SchemaPerfil'

interface VincularPermissaoPerfilProps {
  idFuncao: string
}

interface RemoverPermissoesPerfilProps {
  idFuncao: string
}

export async function buscarListaPerfis(empresaId: string) {
  const listaPerfis = await axiosInstance.get<Array<PerfilType>>(
    `admin/empresa/${empresaId}/perfis`,
  )

  return listaPerfis.data
}

export async function cadastrarPerfil({
  nome,
  administrativo,
  empresa,
}: FormularioPerfilType) {
  const response = await axiosInstance.post<RespostaType>('admin/perfil', {
    nome,
    administrativo,
    empresa,
  })

  return response.data
}

export async function modificarPerfil({
  id,
  nome,
  administrativo,
}: PerfilType) {
  const response = await axiosInstance.put<RespostaType>(`admin/perfil/${id}`, {
    nome,
    administrativo,
  })

  return response.data
}

export async function excluirPerfil(id: string) {
  const response = await axiosInstance.delete<RespostaType>(
    `admin/perfil/${id}`,
  )

  return response.data
}

export async function adicionarPermissaoPerfil(
  idPerfil: string,
  permissoes: VincularPermissaoPerfilProps[],
) {
  const response = await axiosInstance.post<RespostaType>(
    `admin/perfil/${idPerfil}/vincular/funcao`,
    permissoes,
  )

  return response.data
}

export async function removerPermissoesPerfil(
  idPerfil: string,
  permissoes: RemoverPermissoesPerfilProps[],
) {
  const response = await axiosInstance.delete<RespostaType>(
    `admin/perfil/${idPerfil}/remover/funcao`,
    {
      data: permissoes,
    },
  )

  return response.data
}

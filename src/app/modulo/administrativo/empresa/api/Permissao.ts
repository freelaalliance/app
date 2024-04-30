import { axiosInstance } from '@/lib/AxiosLib'

import {
  FuncaoModuloType,
  ModuloType,
  PermissaoPerfilType,
} from '../schemas/SchemaModulo'

export async function listarModulosEmpresa(idEmpresa: string) {
  const listaModulos = await axiosInstance.get<Array<ModuloType>>(
    `/admin/empresa/${idEmpresa}/modulos`,
  )

  return listaModulos.data
}

export async function listarPermissoesPerfil(idPerfil: string) {
  const listaPermissoes = await axiosInstance.get<Array<PermissaoPerfilType>>(
    `/admin/perfil/${idPerfil}/permissoes`,
  )

  return listaPermissoes.data
}

export async function listarFuncoesModulo(idModulo: string | null) {
  if (!idModulo) return []

  const listaFuncoes = await axiosInstance.get<Array<FuncaoModuloType>>(
    `/modulo/${idModulo}/funcoes`,
  )

  return listaFuncoes.data
}

export async function listarPermissoesModuloPerfil(idModulo: string | null) {
  if (!idModulo) return []

  const listaPermissoes = await axiosInstance.get<Array<FuncaoModuloType>>(
    `/usuario/perfil/permissoes/modulo/${idModulo}`,
  )

  return listaPermissoes.data
}

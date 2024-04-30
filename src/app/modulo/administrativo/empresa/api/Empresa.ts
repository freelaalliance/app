import { axiosInstance, RespostaType } from '@/lib/AxiosLib'

import { ModuloType } from '../schemas/SchemaModulo'
import { EmpresaFormType, empresaType } from '../schemas/SchemaNovaEmpresa'
import { UsuarioType } from '../schemas/SchemaUsuarios'

export interface VinculoModuloEmpresaProps {
  idEmpresa: string
  modulos: Array<{
    idModulo: string
  }>
}

export async function listarEmpresas() {
  const listaEmpresas =
    await axiosInstance.get<Array<empresaType>>('admin/empresa/all')

  return listaEmpresas.data
}

export async function cadastrarEmpresa({
  cep,
  logradouro,
  bairro,
  cidade,
  cnpj,
  estado,
  nome,
  numero,
  complemento,
}: EmpresaFormType) {
  const response = await axiosInstance.post<RespostaType>('admin/empresa', {
    nome,
    cnpj,
    logradouro,
    bairro,
    cidade,
    estado,
    numero,
    complemento,
    cep,
  })

  return response.data
}

export async function buscarListaModulosSistema() {
  const lista = await axiosInstance.get<Array<ModuloType>>('modulo/all')

  return lista.data
}

export async function removerModulosEmpresa({
  idEmpresa,
  modulos,
}: VinculoModuloEmpresaProps) {
  const removeModulos = await axiosInstance.delete<RespostaType>(
    `admin/empresa/${idEmpresa}/desvincular/modulo`,
    {
      data: modulos,
    },
  )

  return removeModulos.data
}

export async function adicionarModulosEmpresa(
  idEmpresa: string,
  idModulo: string,
) {
  const vincula = await axiosInstance.post<RespostaType>(
    `admin/empresa/${idEmpresa}/vincular/modulo`,
    {
      idModulo,
    },
  )

  return vincula.data
}

export async function buscarUsuariosEmpresa(idEmpresa: string) {
  const usuarios = await axiosInstance.get<Array<UsuarioType>>(
    `admin/empresa/${idEmpresa}/usuarios`,
  )

  return usuarios.data
}

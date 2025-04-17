import type { UsuarioType } from '@/components/auth/schema/SchemaUsuario'
import { axiosInstance } from '@/lib/AxiosLib'
import type { CategoriaDocumentoType } from '../../administrativo/modulos/_api/AdmDocumentos'
import type { NovaRevisaoDocumentoFormType } from '../[id]/novo/_components/forms/nova-revisao-documento-form'
import type { NovoDocumentoFormType } from '../[id]/novo/_components/forms/novo-documento-form'

export type ResponseType = {
  status: boolean
  msg: string
}

export type RevisoesDocumentoType = {
  id: string
  numeroRevisao: number
  revisadoEm: Date
  arquivoId: string
  arquivoNome: string
  arquivoUrl: string
  usuario: string
}

export type DocumentoType = {
  id: string
  nome: string
  descricaoDocumento: string
  copias: number
  recuperacao: string
  elegibilidade: string
  disposicao: string
  retencao: Date
  uso: string
  categoriaDocumentoNome: string
  revisoes: RevisoesDocumentoType[]
}

export async function buscarCategoriasDocumento() {
  return await axiosInstance
    .get<Array<CategoriaDocumentoType>>('documentos/categorias')
    .then(({ data }) => data)
    .catch(() => null)
}

export async function buscarUsuariosEmpresaPermissaoDocumentos() {
  return await axiosInstance
    .get<Omit<UsuarioType, 'perfil'>[]>('documentos/permissoes/usuarios')
    .then(({ data }) => data)
    .catch(() => null)
}

export async function buscarDocumentosUsuario() {
  return await axiosInstance
    .get<Array<DocumentoType>>('documentos/usuario')
    .then(({ data }) => data)
    .catch(() => null)
}

export async function buscarDocumentosEmpresa() {
  return await axiosInstance
    .get<Array<DocumentoType>>('documentos/empresa')
    .then(({ data }) => data)
    .catch(() => null)
}

export async function cadastrarNovoDocumento(documento: NovoDocumentoFormType) {
  return await axiosInstance
    .post<ResponseType>('documentos', documento)
    .then(({ data }) => data)
    .catch(() => null)
}

export async function cadastrarNovaRevisaoDocumento(
  revisaoDocumentoForm: NovaRevisaoDocumentoFormType
) {
  return await axiosInstance
    .post<ResponseType>(`documentos/revisao/${revisaoDocumentoForm.id}`, {
      arquivo: revisaoDocumentoForm.arquivo,
    })
    .then(({ data }) => data)
    .catch(() => null)
}

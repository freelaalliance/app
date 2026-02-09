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
  retencao?: Date
  uso: string
  empresaId: string
  categoriaDocumentoNome: string
  revisoes: RevisoesDocumentoType[]
  pasta: PastaDocumentoType | null
}

export type PastaDocumentoType = {
  id: string
  nome: string
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

export async function buscarDocumentosEmpresa(idEmpresa?: string | null) {
  return await axiosInstance
    .get<Array<DocumentoType>>('documentos/empresa', {
      params: {
        id: idEmpresa
      }
    })
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
      dataRevisao: revisaoDocumentoForm.dataRevisao,
      numeroRevisao: revisaoDocumentoForm.numeroRevisao,
    })
    .then(({ data }) => data)
    .catch(() => null)
}

export async function removerDocumento({ id, empresaId }: Pick<DocumentoType, 'id'> & { empresaId: string }) {
  return await axiosInstance
    .delete<ResponseType>(`documentos/${id}/empresa/${empresaId}`)
    .then(({ data }) => data)
    .catch(() => null)
}

// ==================== PASTAS DE DOCUMENTOS ====================

/**
 * Cria uma nova pasta vinculada à empresa do usuário logado
 */
export async function criarPastaDocumento(nome: string) {
  return await axiosInstance
    .post<{
      status: boolean
      msg: string
      data?: {
        id: string
        nome: string
        empresaId: string
      }
    }>('documentos/pastas', { nome })
    .then(({ data }) => data)
    .catch(() => null)
}

/**
 * Lista todas as pastas não excluídas da empresa do usuário logado
 */
export async function listarPastasUsuario() {
  return await axiosInstance
    .get<Array<PastaDocumentoType>>('documentos/pastas')
    .then(({ data }) => data)
    .catch(() => null)
}

/**
 * Lista todas as pastas não excluídas de uma empresa específica
 */
export async function listarPastasPorEmpresa(empresaId: string) {
  return await axiosInstance
    .get<Array<PastaDocumentoType>>(`documentos/pastas/empresa/${empresaId}`)
    .then(({ data }) => data)
    .catch(() => null)
}

/**
 * Atualiza o nome de uma pasta
 */
export async function atualizarPastaDocumento(id: string, nome: string) {
  return await axiosInstance
    .put<{
      status: boolean
      msg: string
      data?: {
        id: string
        nome: string
        empresaId: string
      }
    }>(`documentos/pastas/${id}`, { nome })
    .then(({ data }) => data)
    .catch(() => null)
}

/**
 * Exclui logicamente uma pasta (soft delete)
 */
export async function excluirPastaDocumento(id: string) {
  return await axiosInstance
    .delete<ResponseType>(`documentos/pastas/${id}`)
    .then(({ data }) => data)
    .catch(() => null)
}

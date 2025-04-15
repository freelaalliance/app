import { axiosInstance } from '@/lib/AxiosLib'
import type { CategoriaDocumentosFormType } from '../documentos/_components/forms/cadastro-categoria-documento'

export interface CategoriaDocumentoType {
  id: string
  nome: string
  empresaId: string
}

export async function cadastrarCategoriaDocumento({
  empresaId,
  categorias,
}: CategoriaDocumentosFormType) {
  await axiosInstance.post<{
    status: boolean,
    msg: string,
  }>(`admin/documentos/categorias/${empresaId}`, {
    categorias,
  })
}

export async function buscarListaCategoriasDocumento({ empresaId }: Pick<CategoriaDocumentoType, 'empresaId'>) {
  return await axiosInstance.get<Array<CategoriaDocumentoType>>(`admin/documentos/categorias/${empresaId}`).then(({ data }) => data).catch(() => null)
}

export async function removerCategoriaDocumento({ id }: Pick<CategoriaDocumentoType, 'id'>){
  return await axiosInstance.delete<{
    status: boolean,
    msg: string,
  }>(`admin/documentos/categorias/${id}`).then(({ data }) => data).catch(() => null)
}

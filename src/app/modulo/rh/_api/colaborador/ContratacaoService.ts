import { axiosInstance } from '@/lib/AxiosLib'
import type { EditarColaboradorData } from '../../_schemas/colaborador/EditarColaboradorSchemas'
import type {
  AtualizarContratacaoRequest,
  Contratacao,
  CriarContratacaoRequest,
  DemitirColaboradorRequest,
  DocumentoContrato,
  TransferirColaboradorRequest,
} from '../../_types/colaborador/ContratacaoType'
import type { ApiResponse } from '../rhService'

export const contratacaoApi = {
  criar: (data: CriarContratacaoRequest) =>
    axiosInstance.post<ApiResponse<void>>('/rh/contratacoes', data),

  listar: (ativas?: boolean) =>
    axiosInstance.get<ApiResponse<Contratacao[]>>('/rh/contratacoes', { params: { ativas } }),

  buscar: (id: string) => axiosInstance.get<ApiResponse<Contratacao>>(`/rh/contratacoes/${id}`),

  atualizar: (id: string, data: AtualizarContratacaoRequest) =>
    axiosInstance.put<ApiResponse<void>>(`/rh/contratacoes/${id}`, data),

  demitir: (id: string, data: DemitirColaboradorRequest) =>
    axiosInstance.patch<ApiResponse<void>>(`/rh/contratacoes/${id}/demitir`, data),

  transferir: (id: string, data: TransferirColaboradorRequest) =>
    axiosInstance.patch<ApiResponse<void>>(`/rh/contratacoes/${id}/transferir`, data),

  listarPorCargo: (cargoId: string) =>
    axiosInstance.get<ApiResponse<Contratacao[]>>(
      `/rh/contratacoes/cargo/${cargoId}/colaboradores`
    ),

  adicionarDocumento: (id: string, documento: string, chaveArquivo?: string) =>
    axiosInstance.post<ApiResponse<DocumentoContrato>>(`/rh/contratacoes/${id}/documentos`, {
      documento,
      chaveArquivo,
    }),

  removerDocumento: (documentoId: number) =>
    axiosInstance.delete<ApiResponse<void>>(`/rh/contratacoes/documentos/${documentoId}`),

  listarDocumentos: (id: string) =>
    axiosInstance.get<ApiResponse<DocumentoContrato[]>>(`/rh/contratacoes/${id}/documentos`),

  atualizarDadosColaborador: (id: string, data: EditarColaboradorData) =>
    axiosInstance.patch<ApiResponse<void>>(`/rh/contratacoes/colaborador/${id}`, data),

  atualizarArquivoDocumento: (documentoId: number, chaveArquivo: string) =>
    axiosInstance.patch<ApiResponse<DocumentoContrato>>(`/rh/contratacoes/documentos/${documentoId}/arquivo`, {
      chaveArquivo,
    }),
}

import { axiosInstance } from '@/lib/AxiosLib'
import type {
  AtualizarTreinamentoRealizadoRequest,
  FinalizarTreinamentoRequest,
  IniciarTreinamentoRequest,
  TreinamentoRealizado,
} from '../../_types/colaborador/ContratacaoType'
import type { ApiResponse } from '../rhService'

export const treinamentosColaboradorApi = {
  iniciar: (data: IniciarTreinamentoRequest) =>
    axiosInstance.post<ApiResponse<TreinamentoRealizado>>('/rh/contrato/treinamentos/', data),

  listar: (status?: 'pendentes' | 'finalizados' | 'todos') =>
    axiosInstance.get<ApiResponse<TreinamentoRealizado[]>>('/rh/contrato/treinamentos/', {
      params: { status },
    }),

  buscar: (id: string) =>
    axiosInstance.get<ApiResponse<TreinamentoRealizado>>(`/rh/contrato/treinamentos/${id}`),

  atualizar: (id: string, data: AtualizarTreinamentoRealizadoRequest) =>
    axiosInstance.put<ApiResponse<TreinamentoRealizado>>(`/rh/contrato/treinamentos/${id}`, data),

  finalizar: (id: string, data: FinalizarTreinamentoRequest) =>
    axiosInstance.post<ApiResponse<TreinamentoRealizado>>(
      `/rh/contrato/treinamentos/${id}/finalizar`,
      data
    ),

  cancelar: (id: string) => axiosInstance.delete<ApiResponse<void>>(`/rh/contrato/treinamentos/${id}`),

  listarPorColaborador: (contratacaoId: string) =>
    axiosInstance.get<ApiResponse<TreinamentoRealizado[]>>(
      `/rh/contrato/treinamentos/colaborador/${contratacaoId}`
    ),

  iniciarObrigatorios: (contratacaoId: string) =>
    axiosInstance.post<
      ApiResponse<{
        treinamentosIniciados: number
        treinamentosJaExistentes: number
        total: number
      }>
    >(`/rh/contrato/treinamentos/colaborador/${contratacaoId}/iniciar-obrigatorios`),

  listarPendentes: () =>
    axiosInstance.get<ApiResponse<TreinamentoRealizado[]>>('/rh/contrato/treinamentos/pendentes'),

  listarFinalizados: () =>
    axiosInstance.get<ApiResponse<TreinamentoRealizado[]>>('/rh/contrato/treinamentos/finalizados'),

  listarNaoRealizados: (contratacaoId: string, tipo?: 'integracao' | 'capacitacao') =>
    axiosInstance.get<ApiResponse<{ id: string; nome: string; tipo: string }[]>>(
      `/rh/contrato/treinamentos/colaborador/${contratacaoId}/nao-realizados`,
      {
        params: tipo ? { tipo } : {}
      }
    ),
}

import { axiosInstance } from '@/lib/AxiosLib'
import type {
  PlanosTreinamentoType,
  TreinamentosType,
} from '../../_types/treinamentos/TreinamentoType'
import type { ApiResponse } from '../rhService'

export interface CriarTreinamentoRequest {
  nome: string
  tipo: 'integracao' | 'capacitacao'
  planos: Array<{ nome: string }>
}

export interface AtualizarTreinamentoRequest {
  nome: string
  tipo: 'integracao' | 'capacitacao'
}

export interface CriarPlanoTreinamentoRequest {
  nome: string
}

export const treinamentosApi = {
  criar: (data: CriarTreinamentoRequest) =>
    axiosInstance.post<ApiResponse<void>>('/rh/treinamentos', data),

  listar: () => axiosInstance.get<ApiResponse<TreinamentosType[]>>('/rh/treinamentos'),

  listarIntegracao: () =>
    axiosInstance.get<ApiResponse<TreinamentosType[]>>('/rh/treinamentos?tipo=integracao'),

  listarIntegracaoPorCargo: (cargoId: string) =>
    axiosInstance.get<ApiResponse<TreinamentosType[]>>(`/rh/treinamentos/integracao/cargo/${cargoId}`),

  listarCapacitacao: () =>
    axiosInstance.get<ApiResponse<TreinamentosType[]>>('/rh/treinamentos/capacitacao'),

  atualizar: (id: string, data: AtualizarTreinamentoRequest) =>
    axiosInstance.put<ApiResponse<void>>(`/rh/treinamentos/${id}`, data),

  deletar: (id: string) => axiosInstance.delete<ApiResponse<void>>(`/rh/treinamentos/${id}`),

  criarPlano: (treinamentoId: string, data: CriarPlanoTreinamentoRequest) =>
    axiosInstance.post<ApiResponse<void>>(`/rh/treinamentos/${treinamentoId}/planos`, data),

  deletarPlano: (planoId: number) =>
    axiosInstance.delete<ApiResponse<void>>(`/rh/treinamentos/planos/${planoId}`),

  listarPlanos: (treinamentoId: string) =>
    axiosInstance.get<ApiResponse<PlanosTreinamentoType[]>>(
      `/rh/treinamentos/${treinamentoId}/planos`
    ),
}

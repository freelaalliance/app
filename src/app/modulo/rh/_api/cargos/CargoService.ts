import { axiosInstance } from '@/lib/AxiosLib'
import type {
  AdicionarTreinamentoCargoRequest,
  AtualizarCargoRequest,
  Cargo,
  CriarCargoRequest,
} from '../../_types/cargos/CargoType'
import type { Contratacao } from '../../_types/colaborador/ContratacaoType'
import type { TreinamentosType } from '../../_types/treinamentos/TreinamentoType'
import type { ApiResponse } from '../rhService'

export const cargosApi = {
  criar: (data: CriarCargoRequest) =>
    axiosInstance.post<ApiResponse<void>>('/rh/cargos', data),

  listar: () => axiosInstance.get<ApiResponse<Cargo[]>>('/rh/cargos'),

  buscar: (id: string) => axiosInstance.get<ApiResponse<Cargo>>(`/rh/cargos/${id}`),

  atualizar: (id: string, data: AtualizarCargoRequest) =>
    axiosInstance.put<ApiResponse<void>>(`/rh/cargos/${id}`, data),

  deletar: (id: string) => axiosInstance.delete<ApiResponse<void>>(`/rh/cargos/${id}`),

  listarTreinamentos: (id: string) =>
    axiosInstance.get<ApiResponse<TreinamentosType[]>>(`/rh/cargos/${id}/treinamentos`),

  adicionarTreinamento: (id: string, data: AdicionarTreinamentoCargoRequest) =>
    axiosInstance.post<ApiResponse<void>>(`/rh/cargos/${id}/treinamentos`, data),

  removerTreinamento: (id: string, treinamentoId: string) =>
    axiosInstance.delete<ApiResponse<void>>(
      `/rh/cargos/${id}/treinamentos/${treinamentoId}`
    ),

  listarColaboradores: (id: string) =>
    axiosInstance.get<ApiResponse<Contratacao[]>>(`/rh/cargos/${id}/colaboradores`),
}

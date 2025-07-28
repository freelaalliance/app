import { axiosInstance } from '@/lib/AxiosLib'
import type {
  AnalyticsCargoColaboradores,
  AnalyticsColaboradores,
  AnalyticsRotatividade,
  AnalyticsTreinamentos,
  ColaboradorEmTreinamento,
  ColaboradorListagem,
} from '../../_types/analytics/AnalyticsType'
import type { ApiResponse } from '../rhService'

export const analyticsRhApi = {
  getAnalyticsColaboradores: () =>
    axiosInstance.get<ApiResponse<AnalyticsColaboradores>>('/rh/analytics/colaboradores'),

  getAnalyticsRotatividade: (periodo?: 'mes' | 'trimestre' | 'semestre' | 'anual') =>
    axiosInstance.get<ApiResponse<AnalyticsRotatividade>>('/rh/analytics/rotatividade', {
      params: periodo ? { periodo } : {}
    }),

  getAnalyticsTreinamentos: () =>
    axiosInstance.get<ApiResponse<AnalyticsTreinamentos>>('/rh/analytics/treinamentos'),

  getAnalyticsColaboradoresPorCargo: () =>
    axiosInstance.get<ApiResponse<AnalyticsCargoColaboradores[]>>('/rh/analytics/colaboradores-por-cargo'),

  listarColaboradoresAtivos: () =>
    axiosInstance.get<ApiResponse<ColaboradorListagem[]>>('/rh/colaboradores/ativos'),

  listarColaboradoresDemitidos: () =>
    axiosInstance.get<ApiResponse<ColaboradorListagem[]>>('/rh/colaboradores/demitidos'),

  listarColaboradoresEmTreinamento: () =>
    axiosInstance.get<ApiResponse<ColaboradorEmTreinamento[]>>('/rh/colaboradores/em-treinamento'),
}

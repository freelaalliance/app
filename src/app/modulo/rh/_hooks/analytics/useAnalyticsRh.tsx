'use client'

import { useQuery } from '@tanstack/react-query'
import { analyticsRhApi } from '../../_api/analytics/AnalyticsRhService'

export const useAnalyticsColaboradores = () => {
  return useQuery({
    queryKey: ['analytics-rh', 'colaboradores'],
    queryFn: async () => {
      const { data } = await analyticsRhApi.getAnalyticsColaboradores()
      return data.dados
    },
  })
}

export const useAnalyticsRotatividade = (periodo: 'mes' | 'trimestre' | 'semestre' | 'anual' = 'mes') => {
  return useQuery({
    queryKey: ['analytics-rh', 'rotatividade', periodo],
    queryFn: async () => {
      const { data } = await analyticsRhApi.getAnalyticsRotatividade(periodo)
      return data.dados
    },
  })
}

export const useAnalyticsTreinamentos = () => {
  return useQuery({
    queryKey: ['analytics-rh', 'treinamentos'],
    queryFn: async () => {
      const { data } = await analyticsRhApi.getAnalyticsTreinamentos()
      return data.dados
    },
  })
}

export const useAnalyticsColaboradoresPorCargo = () => {
  return useQuery({
    queryKey: ['analytics-rh', 'colaboradores-por-cargo'],
    queryFn: async () => {
      const { data } = await analyticsRhApi.getAnalyticsColaboradoresPorCargo()
      return data.dados || []
    },
  })
}

export const useColaboradoresAtivos = () => {
  return useQuery({
    queryKey: ['colaboradores', 'ativos'],
    queryFn: async () => {
      const { data } = await analyticsRhApi.listarColaboradoresAtivos()
      return data.dados || []
    },
  })
}

export const useColaboradoresDemitidos = () => {
  return useQuery({
    queryKey: ['colaboradores', 'demitidos'],
    queryFn: async () => {
      const { data } = await analyticsRhApi.listarColaboradoresDemitidos()
      return data.dados || []
    },
  })
}

export const useColaboradoresEmTreinamento = () => {
  return useQuery({
    queryKey: ['colaboradores', 'em-treinamento'],
    queryFn: async () => {
      const { data } = await analyticsRhApi.listarColaboradoresEmTreinamento()
      return data.dados || []
    },
  })
}

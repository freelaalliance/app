import { axiosInstance } from "@/lib/AxiosLib"
import { useQuery } from "@tanstack/react-query"

export type ExpedicaoVenda = {
  id: string
  expedidoEm: Date
  venda: {
    id: string
    numeroVenda: string
    cliente: {
      nome: string
    }
  }
  usuario: string
  avaliacaoExpedicao: number
}

export function useVendasExpedidas() {
  return useQuery({
    queryKey: ['vendas-expedidas'],
    queryFn: async () => {
      const response = await axiosInstance.get<{ dados: Array<ExpedicaoVenda> }>('/vendas/expedicao')
      return response.data.dados
    },
    initialData: []
  })
}

export function useEstatisticasExpedicao() {
  return useQuery({
    queryKey: ['expedicoes-estatisticas'],
    queryFn: async () => {
      const response = await axiosInstance.get<{ dados: {
        realizadas: number
        pendentes: number
        total: number
      }}>('/vendas/expedicao/resumo')
      return response.data.dados
    },
    initialData: {
      realizadas: 0,
      pendentes: 0,
      total: 0
    }
  })
}

export function useMediaAvaliacaoExpedicao() {
  return useQuery({
    queryKey: ['expedicoes-media-avaliacao'],
    queryFn: async () => {
      const response = await axiosInstance.get<{ dados: {
        media: number
      }}>('/vendas/expedicao/media-avaliacao')
      return response.data.dados
    },
    initialData: {
      media: 0
    }
  })
}
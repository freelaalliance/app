import { axiosInstance } from '@/lib/AxiosLib'
import { useQuery } from '@tanstack/react-query'
import type { VendaDetalhada, VendasCliente } from '../_schemas/vendas.schema'

export function useVenda(id: string) {
  return useQuery<VendaDetalhada>({
    queryKey: ['venda', id],
    queryFn: async () => {
      const response = await axiosInstance.get<{ dados: VendaDetalhada }>(
        `/vendas/${id}/cliente`
      )
      return response.data.dados
    },
    enabled: !!id,
  })
}

export function useVendasByCliente(id: string) {
  return useQuery({
    queryKey: ['vendas-cliente', id],
    queryFn: async () => {
      const response = await axiosInstance.get<{ dados: Array<VendasCliente> }>(`/vendas/cliente/${id}`)
      return response.data.dados
    },
    enabled: !!id,
    initialData: []
  })
}

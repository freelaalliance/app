import { axiosInstance } from '@/lib/AxiosLib'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
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

export function useVendasPendentes() {
  return useQuery({
    queryKey: ['vendas-pendentes-expedicao'],
    queryFn: async () => {
      const response = await axiosInstance.get<{ dados: Array<VendasCliente> }>('/vendas/pendentes/expedicao')
      return response.data.dados
    },
    initialData: []
  })
}

export function useDownloadPdfVenda(id: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(`/vendas/${id}/pdf`, {
        responseType: 'blob',
      })

      return response.data
    },
    onMutate: () => {
      toast.loading('Gerando PDF da venda...')
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `venda-${id}.pdf`
      link.click()

      window.URL.revokeObjectURL(url)
      toast.dismiss()
      toast.success('PDF gerado com sucesso!')
    },
    onError: () => {
      toast.dismiss()
      toast.error('Erro ao gerar PDF da venda')
    },
  })
}


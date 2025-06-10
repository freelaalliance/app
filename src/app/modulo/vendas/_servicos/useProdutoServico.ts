import { axiosInstance } from '@/lib/AxiosLib'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchProdutoServico,
  fetchProdutosServicos,
} from '../_api/produtoServico'
import type { ProdutoServicoInput } from '../_components/produtosServicos/forms/produto-servico-form'

export function useProdutosServicos() {
  return useQuery({
    queryKey: ['produtos-servicos'],
    queryFn: fetchProdutosServicos,
    initialData: [],
  })
}

export function useProdutoServico(id: string) {
  return useQuery({
    queryKey: ['produtos-servicos', id],
    queryFn: () => fetchProdutoServico(id),
    enabled: !!id,
  })
}

export function useCriarProdutoServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: ProdutoServicoInput) => {
      const { data } = await axiosInstance.post('/produtos-servicos', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-servicos'] })
    },
  })
}

export function useEditarProdutoServico(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: ProdutoServicoInput) => {
      const { data } = await axiosInstance.put(`/produtos-servicos/${id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-servicos'] })
    },
  })
}

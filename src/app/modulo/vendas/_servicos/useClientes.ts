// lib/hooks/useClientes.ts
import { axiosInstance } from '@/lib/AxiosLib'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ClienteType } from '../_types/clientes'

export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        status: boolean
        msg: string
        dados: ClienteType[] | null
        error?: string
      }>('/pessoa/clientes')
      return response.data.dados
    },
  })
}

export const useCliente = (id: string) => {
  return useQuery({
    queryKey: ['pessoa-cliente', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/pessoa/clientes/${id}`)
      return response.data.dados
    },
    enabled: !!id,
  })
}

export const useCreateCliente = () => {
  const queryClient = useQueryClient()
  return useMutation({
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post('/pessoa/clientes', data)
      return response.data.dados
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}

export const useDeleteCliente = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/pessoa/clientes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}

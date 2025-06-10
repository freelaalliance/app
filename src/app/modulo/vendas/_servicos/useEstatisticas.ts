import { useQuery } from '@tanstack/react-query'
import { fetchTopCliente, fetchTopProduto, fetchTotalClientes, fetchTotalProdutos } from '../_api/estatisticasCliente'

export function useTopCliente() {
  return useQuery({
    queryKey: ['top-cliente'],
    queryFn: fetchTopCliente
  })
}
export function useTopProduto() {
  return useQuery({
    queryKey: ['top-produto'],
    queryFn: fetchTopProduto
  })
}
export function useTotalClientes() {
  return useQuery({
    queryKey: ['total-clientes'],
    queryFn: fetchTotalClientes
  })
}
export function useTotalProdutos() {
  return useQuery({
    queryKey: ['total-produtos'],
    queryFn: fetchTotalProdutos
  })
}

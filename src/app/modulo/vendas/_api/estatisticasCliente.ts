import { axiosInstance } from "@/lib/AxiosLib";

export async function fetchTopCliente() {
  const { data } = await axiosInstance.get('/estatisticas/vendas/cliente-top')
  return data.dados as { totalVendas: number; cliente: string } | null
}

export async function fetchTopProduto() {
  const { data } = await axiosInstance.get('/estatisticas/vendas/produto-top')
  return data.dados as { totalVendido: number; nome: string } | null
}

export async function fetchTotalClientes() {
  const { data } = await axiosInstance.get('/estatisticas/empresa/clientes')
  return data.dados.totalClientes as number
}

export async function fetchTotalProdutos() {
  const { data } = await axiosInstance.get('/estatisticas/empresa/produtos')
  return data.dados.totalProdutos as number
}
import { axiosInstance } from '@/lib/AxiosLib'
import type { ProdutoServicoFormType } from '../_schemas/produtoServico.schema'

export async function fetchProdutosServicos() {
  const { data } = await axiosInstance.get('/produtos-servicos')
  return data.dados
}

export async function fetchProdutoServico(id: string) {
  const { data } = await axiosInstance.get(`/produtos-servicos/${id}`)
  return data.dados
}

export async function criarProdutoServico(body: ProdutoServicoFormType) {
  const { data } = await axiosInstance.post('/produtos-servicos', body)
  return data
}

export async function editarProdutoServico(
  id: string,
  body: ProdutoServicoFormType
) {
  const { data } = await axiosInstance.put(`/produtos-servicos/${id}`, body)
  return data
}

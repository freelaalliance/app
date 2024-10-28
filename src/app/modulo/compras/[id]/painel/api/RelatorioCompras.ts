import { axiosInstance } from '@/lib/AxiosLib'

export type ResumoComprasType = {
  totalPedidos: number
  totalCancelados: number
  totalRecebidos: number
  totalNaoRecebidos: number
}

export type ResumoFornecedoresType = {
  totalFornecedores: number
  mediaDesempenho: number
  fornecedoresCriticos: {
    critico: boolean
    total: number
  }[]
  fornecedoresAprovados: {
    aprovado: boolean
    total: number
  }[]
  avaliacoes: {
    total: number
    media: number
    maxima: number
    minima: number
  }
}

export async function buscarResumoCompras() {
  const response = await axiosInstance.get<ResumoComprasType>(
    `relatorio/compras/resumo`,
  )

  return response.data
}

export async function buscarResumoFornecedor() {
  const response = await axiosInstance.get<ResumoFornecedoresType>(
    `relatorio/fornecedor/resumo`,
  )

  return response.data
}

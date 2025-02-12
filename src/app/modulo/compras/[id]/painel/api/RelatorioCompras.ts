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

export type PedidosEmpresaType = {
  id: string
  numPedido: string
  codigo: string
  permiteEntregaParcial: boolean
  prazoEntrega: Date
  condicoesEntrega: string
  recebido: boolean
  cancelado: boolean
  cadastro: {
    usuario: string
    dataCadastro: Date
  }
  fornecedor: {
    id: string
    nome: string
    documento: string
  }
}

export type EstatisticasDadosRecebimentoType = {
  avaliacao: number | null
  totalRecebimentos: number
  recebimentos: {
    data: Date
    quantidade: number
    mediaAvaliacaoEntrega: number | null
    minimaAvaliacaoEntrega: number | null
    maximaAvaliacaoEntrega: number | null
  }[]
}

export type ListaDadosRecebimentosType = {
  id: string
  compra: {
    numPedido: number
  }
  recebidoEm: Date
  avaliacaoEntrega: number
  usuario: {
    id: string
    pessoa: {
      nome: string
    }
  }
  numeroNota: string | null
  numeroCertificado: string | null
}

interface FiltroRelatorioProps {
  dataInicial?: Date
  dataFinal?: Date
}

export async function buscarResumoCompras() {
  const response = await axiosInstance.get<ResumoComprasType>(
    "relatorio/compras/resumo"
  )

  return response.data
}

export async function buscarResumoFornecedor() {
  const response = await axiosInstance.get<ResumoFornecedoresType>(
    "relatorio/fornecedor/resumo"
  )

  return response.data
}

export async function buscarListaPedidosEmpresa({
  dataInicial,
  dataFinal,
}: FiltroRelatorioProps) {
  const response = await axiosInstance.get<Array<PedidosEmpresaType>>(
    "relatorio/compras",
    {
      params: {
        dataInicial,
        dataFinal,
      },
    }
  )

  return response.data
}

export async function buscarDadosRelatorioRecebimento({
  dataInicial,
  dataFinal,
}: FiltroRelatorioProps) {
  const response = await axiosInstance.get<{
    estatisticasRecebimentos: EstatisticasDadosRecebimentoType
    recebimentos: Array<ListaDadosRecebimentosType>
  }>('relatorio/recebimentos', {
    params: { dataInicial, dataFinal },
  })

  return response.data
}

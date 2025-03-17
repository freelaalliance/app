import { axiosInstance } from '@/lib/AxiosLib'
import type { FormVerificacaoEntregaType } from '../[id]/recebimento/(view)/VerificacaoEntregaPedido'

interface FiltroRelatorioProps {
  dataInicial?: Date
  dataFinal?: Date
}

interface InsereRecebimentoProps {
  compraId: string
  data: FormVerificacaoEntregaType
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
  observacao: string | null
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

export async function inserirRecebimento({
  compraId,
  data,
}: InsereRecebimentoProps) {
  return await axiosInstance
    .post<{
      status: boolean
      msg: string
      error?: unknown
    }>(`pedido/${compraId}/recebimento`, {
      dataRecebimento: data.dataRecebimento,
      numeroNotaFiscal: data.numeroNotaFiscal,
      numeroCertificado: data.numeroCertificado,
      pedidoRecebidoCompleto: data.pedidoRecebidoCompleto,
      avaliacoes: data.avaliacao,
      observacao: data.observacao
    })
    .then(resp => {
      return resp.data
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao inserir o recebimento.',
        error,
      }
    })
}

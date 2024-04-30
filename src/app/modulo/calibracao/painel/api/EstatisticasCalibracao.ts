import { axiosInstance } from '@/lib/AxiosLib'

export type EstatisticasCalibracaoInstrumentoGeral = {
  quantidadeCalibracoesAprovadas: number
  quantidadeCalibracoesReprovadas: number
  quantidadeInstrumentosEmpresa: number
  quantidadeInstrumentosCadastradoAtual: number
  calibracoesVencido: number
  calibracoesVencendo: number
  calibracoesDentroPrazo: number
}

export type HistoricoInstrumentoType = {
  id: string
  codigo: string
  nome: string
  resolucao: string
  marca: string
  localizacao: string
  frequencia: number
  repeticao: number
  calibracoes: Array<{
    id: string
    numeroCertificado: string
    erroEncontrado: number
    incertezaTendenciaEncontrado: number
    toleranciaEstabelicida: number
    certificado: string
    observacao: string
    status: string | 'aprovado' | 'reprovado'
    realizadoEm: Date
    criadoEm: Date
    atualizadoEm: Date
    excluido: boolean
    ultimaAlteracao: Date
  }>
}

export async function buscarEstatisticasCalibracoesEmpresa() {
  const response =
    await axiosInstance.get<EstatisticasCalibracaoInstrumentoGeral>(
      `instrumentos/estatisticas`,
    )

  return response.data
}

export async function recuperarHistoricoInstrumento(
  id: string,
): Promise<HistoricoInstrumentoType> {
  const response = await axiosInstance.get<HistoricoInstrumentoType>(
    `instrumentos/historico/${id}`,
  )

  return response.data
}

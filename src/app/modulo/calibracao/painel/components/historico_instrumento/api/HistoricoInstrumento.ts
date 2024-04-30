import { axiosInstance } from '@/lib/AxiosLib'

export type HistoricoCalibracoesInstrumentoType = {
  id: string
  numeroCertificado: string
  erroEncontrado: number
  incertezaTendenciaEncontrado: number
  toleranciaEstabelicida: number
  certificado: string
  observacao: string | null
  status: string
  realizadoEm: Date
  usuarioUltimaAlteracao: string
}

export type HistoricoInstrumentoType = {
  id: string
  codigo: string
  nome: string
  marca: string
  localizacao: string
  frequencia: number
  repeticao: number
  calibracoes: Array<HistoricoCalibracoesInstrumentoType>
}

export async function buscarDadosHistoricoInstrumento(
  idInstrumento: string,
): Promise<HistoricoInstrumentoType> {
  const response = await axiosInstance.get<HistoricoInstrumentoType>(
    `instrumentos/historico/${idInstrumento}`,
  )

  return response.data
}

import { axiosInstance, RespostaType } from '@/lib/AxiosLib'

export type CalibracoesInstrumentosEmpresaType = Array<{
  calibracao: {
    id: string
    numeroCertificado: string
    erroEncontrado: string
    incertezaTendenciaEncontrado: string
    toleranciaEstabelicida: string
    observacao?: string
    certificado: string
    status: string
    realizadoEm: Date
    usuarioId: string
    usuarioNome: string
  }
  instrumento: {
    id: string
    codigo: string
    nome: string
    localizacao: string
    marca: string
    resolucao: string
    frequencia: number
    repeticao: number
  }
}>

export interface EdicaoCalibracaoPropsInterface {
  id: string
  numeroCertificado: string
  erroEncontrado: string
  incertezaTendenciaEncontrado: string
  toleranciaEstabelicida: string
  observacao?: string
  certificado: string
  realizadoEm: Date
}

export async function recuperarCalibracoesInstrumentosEmpresa() {
  const response = await axiosInstance.get<CalibracoesInstrumentosEmpresaType>(
    `instrumentos/calibracao/all`,
  )

  return response.data
}

export async function excluirCalibracao(id: string) {
  const response = await axiosInstance.delete<RespostaType>(
    `instrumentos/calibracao/${id}`,
  )

  return response.data
}

export async function excluirInstrumento(id: string) {
  const response = await axiosInstance.delete<RespostaType>(
    `instrumentos/${id}`,
  )

  return response.data
}

export async function salvarEdicaoCalibracao({
  id,
  numeroCertificado,
  erroEncontrado,
  incertezaTendenciaEncontrado,
  toleranciaEstabelicida,
  observacao,
  certificado,
  realizadoEm,
}: EdicaoCalibracaoPropsInterface) {
  const response = await axiosInstance.put<RespostaType>(
    `instrumentos/calibracao/${id}`,
    {
      numeroCertificado,
      erroEncontrado,
      incertezaTendenciaEncontrado,
      toleranciaEstabelicida,
      observacao,
      certificado,
      realizadoEm: new Date(realizadoEm),
    },
  )

  return response.data
}

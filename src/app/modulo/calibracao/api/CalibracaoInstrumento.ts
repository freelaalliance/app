import { axiosInstance, RespostaType } from '@/lib/AxiosLib'
import { encodeFileToBase64 } from '@/lib/utils'
import { CalibracaoInstrumentoValores } from '../schemas/(calibracoes)/SchemaNovaCalibracao'

export type DadosInstrumentoType = {
  id: string
  codigo: string
  nome: string
  resolucao: string
  marca: string
  localizacao: string
  frequencia: string
  repeticao: string
}

export async function salvarCalibracao(
  {
    nomeInstrumento,
    localizacaoInstrumento,
    marcaInstrumento,
    resolucao,
    codigoInstrumento,
    numeroCertificado,
    dataCalibracao,
    frequenciaCalibracao,
    repeticaoCalibracao,
    erroEncontrado,
    incertezaTendenciaEncontrado,
    tolerancia,
    observacaoCalibracao,
  }: CalibracaoInstrumentoValores,
  certificado: File,
): Promise<RespostaType> {
  const certificadoBase64: string = await encodeFileToBase64(certificado)

  if (!certificadoBase64) {
    return {
      status: false,
      msg: 'Falha ao codificar o certificado',
    }
  }

  return await axiosInstance
    .post<RespostaType>(
      'instrumentos/calibracao',
      {
        nome: nomeInstrumento,
        localizacao: localizacaoInstrumento,
        marca: marcaInstrumento,
        resolucao,
        codigo: codigoInstrumento,
        numeroCertificado,
        realizadoEm: dataCalibracao,
        frequencia: frequenciaCalibracao,
        repeticao: repeticaoCalibracao,
        erroEncontrado: String(erroEncontrado),
        incertezaTendenciaEncontrado: String(incertezaTendenciaEncontrado),
        toleranciaEstabelecida: String(tolerancia),
        observacao: observacaoCalibracao,
        certificado: certificadoBase64,
      },
      {
        responseType: 'json',
      },
    )
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
      if (error.response) {
        return error.response.data as RespostaType
      } else if (error.request) {
        return {
          status: false,
          msg: error.request || 'Não foi possível salvar calibração!',
        }
      } else {
        return {
          status: false,
          msg: error.message || 'Falha ao processar, tente novamente',
        }
      }
    })
}

export function consultarCodigoInstrumento(
  codigo: string,
): Promise<DadosInstrumentoType | null> {
  return axiosInstance
    .get<DadosInstrumentoType | null>(`instrumentos`, {
      params: {
        codigo,
      },
      responseType: 'json',
    })
    .then((resp) => {
      return resp.data
    })
    .catch(() => {
      return null
    })
}

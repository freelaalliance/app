import { axiosInstance } from '@/lib/AxiosLib'
import { ExcelLib } from '@/lib/ExcelLib'
import { formatarDataBrasil } from '@/lib/utils'

interface ConsultarDadosCalibracaoProps {
  status?: string | null
  calibradoDe?: Date | null
  calibradoAte?: Date | null
  codigoInstrumento?: string | null
  localizacaoInstrumento?: string | null
}

export type DadosRelatorioCalibracaoType = Array<{
  id: string
  codigo: string
  nome: string
  localizacao: string
  marca: string
  resolucao: string
  frequencia: number
  numeroCertificado: string
  erroEncontrado: string
  incertezaTendenciaEncontrado: string
  toleranciaEstabelicida: string
  observacao: string | null
  certificado: string
  status: string
  realizadoEm: Date
  atualizadoEm: Date
}>

export async function consultarDadosRelatorioCalibracao({
  status,
  calibradoDe,
  calibradoAte,
  codigoInstrumento,
  localizacaoInstrumento,
}: ConsultarDadosCalibracaoProps): Promise<DadosRelatorioCalibracaoType> {
  const response = await axiosInstance.get<DadosRelatorioCalibracaoType>(
    `relatorio/calibracoes`,
    {
      params: {
        status,
        calibradoDe,
        calibradoAte,
        codigoInstrumento,
        localizacaoInstrumento,
      },
    },
  )
  return response.data
}

export async function gerarRelatorioCalibracaoExcel({
  status,
  calibradoDe,
  calibradoAte,
  codigoInstrumento,
  localizacaoInstrumento,
}: ConsultarDadosCalibracaoProps) {
  const excelLib = new ExcelLib('Relatorio de calibrações')

  excelLib.addTitleRow([`Gerado em ${formatarDataBrasil(new Date())}`])
  excelLib.addSubtitleRow([
    'Nome do instrumento',
    'Maquina/Localização',
    'Resolução',
    'Marca',
    'Codigo',
    'Nº do certificado',
    'Calibrado Em',
    'Frequencia de calibração (Mêses)',
    'Erro encontrado',
    'Incerteza ou tendência encontrado',
    'Tolerancia de processo',
    'Status',
    'Observações',
  ])

  const listaCalibracao: DadosRelatorioCalibracaoType =
    await consultarDadosRelatorioCalibracao({
      status,
      calibradoDe,
      calibradoAte,
      codigoInstrumento,
      localizacaoInstrumento,
    })

  const calibracoes = listaCalibracao.map(
    ({
      nome,
      localizacao,
      marca,
      resolucao,
      codigo,
      numeroCertificado,
      realizadoEm,
      frequencia,
      erroEncontrado,
      incertezaTendenciaEncontrado,
      toleranciaEstabelicida,
      status,
      observacao,
    }) => {
      return [
        nome,
        localizacao,
        resolucao,
        marca,
        codigo,
        numeroCertificado,
        formatarDataBrasil(new Date(realizadoEm)),
        frequencia,
        erroEncontrado,
        incertezaTendenciaEncontrado,
        toleranciaEstabelicida,
        status.toUpperCase(),
        observacao,
      ]
    },
  )

  excelLib.addRows(calibracoes)
  const buffer = await excelLib.finishSheet()

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

  return new Blob([buffer], { type: fileType })
}

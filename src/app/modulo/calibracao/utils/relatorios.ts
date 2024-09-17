import { ExcelLib } from '@/lib/ExcelLib'
import { formatarDataBrasil } from '@/lib/utils'

interface RelatorioCalibracoesProps {
  dados: Array<{
    codigo: string
    nome: string
    marca: string
    localizacao: string
    resolucao: number
    frequencia: number
    data: Date
    usuario: string
    numeroCertificado: string
    tolerancia: number
    incertezaTendencia: number
    erroEncontrado: number
    observacao: number
    status: string
  }>
}

export async function gerarRelatorioCalibracoes({
  dados,
}: RelatorioCalibracoesProps) {
  const excelLib = new ExcelLib('Relatório de calibrações')

  excelLib.addTitleRow([`Gerado em ${formatarDataBrasil(new Date())}`])
  excelLib.addSubtitleRow([
    'Codigo',
    'Nome do instrumento',
    'Marca',
    'Maquina/Localização',
    'Resolução',
    'Frequencia de calibração (Mês)',
    'Calibrado em',
    'Realizado por',
    'Nº do certificado',
    'Tolerancia de processo',
    'Incerteza ou tendência encontrado',
    'Erro encontrado',
    'Observações',
    'Status',
  ])

  const linhas = dados.map((calibracao) => {
    return [
      calibracao.codigo,
      calibracao.nome,
      calibracao.marca,
      calibracao.localizacao,
      calibracao.resolucao,
      calibracao.frequencia,
      calibracao.data ? formatarDataBrasil(new Date(calibracao.data)) : '--',
      calibracao.usuario,
      calibracao.numeroCertificado,
      calibracao.tolerancia,
      calibracao.incertezaTendencia,
      calibracao.erroEncontrado,
      calibracao.observacao,
      calibracao.status.toUpperCase(),
    ]
  })

  excelLib.addRows(linhas)

  const buffer = await excelLib.finishSheet()
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

  return new Blob([buffer], { type: fileType })
}

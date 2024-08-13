import { ExcelLib } from "@/lib/ExcelLib";
import { formatarDataBrasil } from "@/lib/utils";

interface RelatorioCalibracoesProps{
  dados: Array<{
    codigo: string;
    nome: string;
    localizacao: string;
    marca: string;
    data: Date;
    status: string;
  }>
}

export async function gerarRelatorioCalibracoes({ dados }: RelatorioCalibracoesProps) {

  const excelLib = new ExcelLib('Relatório de calibrações')

  excelLib.addTitleRow([`Gerado em ${formatarDataBrasil(new Date())}`])
  excelLib.addSubtitleRow([
    'Cod.',
    'Nome',
    'Localização',
    'Marca',
    'Calibrado em',
    'Status'
  ])

  const linhas = dados.map((equipamento) => {
    return [
      equipamento.codigo,
      equipamento.nome,
      equipamento.localizacao,
      equipamento.marca,
      equipamento.data? formatarDataBrasil(new Date(equipamento.data)) : '--',
      equipamento.status.toUpperCase(),
    ]
  })

  excelLib.addRows(linhas)

  const buffer = await excelLib.finishSheet()
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

  return new Blob([buffer], { type: fileType })
}
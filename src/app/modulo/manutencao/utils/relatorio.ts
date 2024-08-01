import { ExcelLib } from '@/lib/ExcelLib'
import { formatarDataBrasil } from '@/lib/utils'
import { indicadoresFalhasEquipamentoType } from '../schemas/ManutencaoSchema';

interface RelatorioEquipamentoProps {
  dados: Array<{
    codigo: string;
    nome: string;
    frequencia: number;
    inspecionadoEm: Date | null;
    concertadoEm: Date | null;
    status: "operando" | "parado";
  }>
}

export async function gerarRelatorioEquipamentos({ dados }: RelatorioEquipamentoProps) {

  const excelLib = new ExcelLib('Relatorio de equipamentos')

  excelLib.addTitleRow([`Gerado em ${formatarDataBrasil(new Date())}`])
  excelLib.addSubtitleRow([
    'Cod.',
    'Nome',
    'Frequencia',
    'Última preventiva',
    'Última corretiva',
    'Status'
  ])

  const linhas = dados.map((equipamento) => {
    return [
      equipamento.codigo,
      equipamento.nome,
      equipamento.frequencia,
      equipamento.inspecionadoEm? formatarDataBrasil(new Date(equipamento.inspecionadoEm)) : '--',
      equipamento.concertadoEm? formatarDataBrasil(new Date(equipamento.concertadoEm)) : '--',
      equipamento.status.toUpperCase(),
    ]
  })

  excelLib.addRows(linhas)

  const buffer = await excelLib.finishSheet()
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

  return new Blob([buffer], { type: fileType })
}


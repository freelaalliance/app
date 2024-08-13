interface DadosManutencoesProps {
  tempoTotalParada: number
  qtdParada: number
  tempoTotalOperacao?: number
}

interface DadosDisponibilidadeProps{
  mttr: number
  mtbf: number
}

export function calculaMttr({tempoTotalParada, qtdParada}: DadosManutencoesProps):number{
  return (Number(tempoTotalParada) / Number(qtdParada))
}

export function calculaMtbf({tempoTotalParada, qtdParada, tempoTotalOperacao}: DadosManutencoesProps):number{
 return ((Number(tempoTotalOperacao) - Number(tempoTotalParada)) / Number(qtdParada))
}

export function calculaDisponibilidadeEquipamento({mttr, mtbf}: DadosDisponibilidadeProps):number{
  return (mtbf / (mtbf + mttr)) * 100
}
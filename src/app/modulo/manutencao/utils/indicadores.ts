interface DadosManutencoesProps {
  tempoTotalParada: number
  qtdParada: number
}

interface DadosDisponibilidadeProps{
  mttr: number
  mtbf: number
}

const HORA_OPERACAO = 8
const TEMPO_DISPONIBILIDADE_EM_MINUTOS = (HORA_OPERACAO * 60)

export function calculaMttr({tempoTotalParada, qtdParada}: DadosManutencoesProps):number{
  return (tempoTotalParada / qtdParada)
}

export function calculaMtbf({tempoTotalParada, qtdParada}: DadosManutencoesProps):number{
 return ((TEMPO_DISPONIBILIDADE_EM_MINUTOS - tempoTotalParada) / qtdParada)
}

export function calculaDisponibilidadeEquipamento({mttr, mtbf}: DadosDisponibilidadeProps):number{
  return (mtbf / (mtbf - mttr))
}
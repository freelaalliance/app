export type AnalyticsColaboradores = {
  colaboradoresAtivos: number
  colaboradoresInativos: number
  colaboradoresContratacosMesAtual: number
  colaboradoresContratacosMesAnterior: number
  percentualVariacao: number
}

export type AnalyticsRotatividade = {
  admissoes: number
  demissoes: number
  totalColaboradores: number
  indiceRotatividade: number
  periodo: 'mes' | 'trimestre' | 'semestre' | 'anual'
  dataInicio: string
  dataFim: string
}

export type AnalyticsTreinamentos = {
  treinamentosIntegracao: {
    emAndamento: number
    finalizados: number
    total: number
  }
  treinamentosCapacitacao: {
    emAndamento: number
    finalizados: number
    total: number
  }
}

export type AnalyticsCargoColaboradores = {
  cargoId: string
  nomeCargo: string
  totalColaboradores: number
}

export type ColaboradorListagem = {
  id: string
  admitidoEm: string
  demitidoEm?: string | null
  colaborador: {
    id: string
    documento: string
    nome: string
    email?: string | null
    telefone?: string | null
  }
  cargo: {
    nome: string
  }
}

export type ColaboradorEmTreinamento = {
  id: string
  iniciadoEm: string
  colaborador: {
    nome: string
    documento: string
  }
  cargo: {
    nome: string
  }
  treinamento: {
    id: string
    nome: string
    tipo: 'integracao' | 'capacitacao'
  }
}

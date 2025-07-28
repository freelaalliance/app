export interface Cargo {
  id: string
  nome: string
  atribuicoes: string
  superior: boolean
  experienciaMinima: string
  escolaridadeMinima: string
  treinamentos?: Array<{ id: string; nome?: string; tipo?: string }>
}

export interface CriarCargoRequest {
  nome: string
  atribuicoes: string
  superior?: boolean
  experienciaMinima: string
  escolaridadeMinima: string
  treinamentos?: Array<{ id: string }>
}

export interface AtualizarCargoRequest {
  nome?: string
  atribuicoes?: string
  superior?: boolean
  experienciaMinima?: string
  escolaridadeMinima?: string
  treinamentos?: Array<{ id: string }>
}

export interface AdicionarTreinamentoCargoRequest {
  treinamentoId: string
}
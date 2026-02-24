export interface Cargo {
  id: string
  nome: string
  atribuicoes: string
  experienciaMinima: string
  escolaridadeMinima: string
  treinamentos?: Array<{ id: string; nome?: string; tipo?: string }>
}

export interface CriarCargoRequest {
  nome: string
  atribuicoes: string
  experienciaMinima: string
  escolaridadeMinima: string
  treinamentos?: Array<{ id: string }>
}

export interface AtualizarCargoRequest {
  nome?: string
  atribuicoes?: string
  experienciaMinima?: string
  escolaridadeMinima?: string
  treinamentos?: Array<{ id: string }>
}

export interface AdicionarTreinamentoCargoRequest {
  treinamentoId: string
}

export interface TelefoneColaboradorCargo {
  id: string
  numero: string
  cadastradoEm: string
  atualizadoEm: string
  excluido: boolean
  pessoaId: string
}

export interface EmailColaboradorCargo {
  id: string
  email: string
  cadastradoEm: string
  atualizadoEm: string
  excluido: boolean
  pessoaId: string
}

export interface EnderecoColaboradorCargo {
  id: string
  logradouro: string
  bairro: string
  cidade: string
  estado: string
  numero: string
  complemento: string
  cep: string
  criadoEm: string
  atualizadoEm: string
  excluido: boolean
  pessoaId: string
}

export interface ColaboradorCargo {
  id: string
  admitidoEm: string
  colaborador: {
    id: string
    documento: string
    nome: string
    telefones: TelefoneColaboradorCargo[]
    emails: EmailColaboradorCargo[]
    endereco: EnderecoColaboradorCargo
  }
}
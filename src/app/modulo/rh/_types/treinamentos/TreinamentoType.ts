export type PlanosTreinamentoType = {
  id: string
  nome: string
}

export type TreinamentosType = {
  id: string
  nome: string
  tipo: 'integracao' | 'capacitacao' | 'reciclagem'
  grupo: 'interno' | 'externo'
  planos: PlanosTreinamentoType[]
}

export type TreinamentoCargoType = {
  id: string
  nome: string
  tipo: 'integracao' | 'capacitacao' | 'reciclagem'
  grupo: 'interno' | 'externo'
}

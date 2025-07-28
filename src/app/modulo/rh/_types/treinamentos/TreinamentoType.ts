export type PlanosTreinamentoType = {
  id: string
  nome: string
}

export type TreinamentosType = {
  id: string
  nome: string
  tipo: 'integracao'|'capacitacao'
  planos: PlanosTreinamentoType[]
}

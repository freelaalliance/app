export type ProdutoServicoType = {
  id: string
  nome: string
  descricao?: string
  tipo: 'PRODUTO' | 'SERVICO'
  preco: number
  empresaId: string
}

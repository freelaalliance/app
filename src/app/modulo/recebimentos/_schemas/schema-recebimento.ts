export type RecebimentosPedidosFornecedorType = {
  id: string
  usuario: string
  dataRecebimento: string
  avaliacaoEntrega: number
  quantidadeIncorreta: number
  avaria: boolean
  numeroNota?: string
  observacao?: string
  numeroCertificado?: string
}

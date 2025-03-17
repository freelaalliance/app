export type PedidosFornecedorType = {
  id: string
  numPedido: string
  codigo: string
  permiteEntregaParcial: boolean
  prazoEntrega: Date
  condicoesEntrega: string
  recebido: boolean
  cancelado: boolean
  empresa?: {
    nome: string
    documento: string
    endereco: {
      logradouro: string
      numero: string
      complemento: string
      bairro: string
      cidade: string
      estado: string
      cep: string
    }
  }
  itens: Array<{
    id: string
    descricao: string
    quantidade: number
  }>
  cadastro: {
    usuario: string
    dataCadastro: Date
  }
  fornecedor: {
    id: string
    nome: string
    documento: string
  }
  recebimento?: Array<{
    id: string
    usuario: string
    dataRecebimento: string
    avaliacaoEntrega: number
    numeroNota?: string
    numeroCertificado?: string
  }>
}

export type PedidosFornecedorEmpresaType = {
  id: string
  numPedido: string
  codigo: string
  permiteEntregaParcial: boolean
  prazoEntrega: Date
  condicoesEntrega: string
  recebido: boolean
  cancelado: boolean
  empresa?: {
    nome: string
    documento: string
    endereco: {
      logradouro: string
      numero: string
      complemento: string
      bairro: string
      cidade: string
      estado: string
      cep: string
    }
  }
  itens: Array<{
    id: string
    descricao: string
    quantidade: number
  }>
  cadastro: {
    usuario: string
    dataCadastro: Date
  }
  fornecedor: {
    id: string
    nome: string
    documento: string
  }
}


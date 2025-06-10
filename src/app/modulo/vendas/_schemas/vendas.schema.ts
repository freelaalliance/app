export type ProdutoServico = {
  id: string
  nome: string
  preco: number
}

export type ItemVenda = {
  quantidade: number
  produtoServico: ProdutoServico
}

export type Pessoa = {
  id: string
  nome: string
  Endereco?: {
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  TelefonePessoa: { numero: string }[]
  EmailPessoa: { email: string }[]
}

export type Cliente = {
  id: string
  documento: string
  pessoa: Pessoa
}

export type VendaDetalhada = {
  id: string
  numPedido: number
  codigo: string | null
  condicoes: string | null
  permiteEntregaParcial: boolean
  prazoEntrega: Date
  cliente: Cliente
  itensVenda: ItemVenda[],
  cadastradoEm: Date
}

export type VendasCliente = {
  id: string
  numeroPedido: number
  codigo: string | null
  condicoes: string | null
  permiteEntregaParcial: boolean
  prazoEntrega: Date
  usuario: string
  dataCadastro: Date
  expedido: boolean,
  qtdExpedicoes: number
}


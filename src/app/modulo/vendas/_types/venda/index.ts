import type { ProdutoServicoType } from '../produtoServico'

export interface ItemCarrinhoType extends ProdutoServicoType {
  quantidade: number
}

export interface VendaType {
  clienteId?: string
  itens: ItemCarrinhoType[]
  permiteEntregaParcial: boolean
  observacao?: string
  prazoEntrega: Date
  codigo: string
}
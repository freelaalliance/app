import { axiosInstance } from '@/lib/AxiosLib'

import type { ItemAvaliacaoType } from '@/app/modulo/administrativo/modulos/_api/AdmCompras'
import type { formNovoPedidoType } from '../(views)/NovoPedido'
import type { PedidosFornecedorType } from '../../../(schemas)/compras/schema-compras'

interface ConsultaPedidoProps {
  idPedido?: string
  codigoPedido: string
}

interface ConsultaPedidosFornecedorProps {
  fornecedorId: string
}

export interface AlteraPedidoProps {
  idPedido: string
  idFornecedor: string
}

export async function salvarNovoPedido(form: formNovoPedidoType) {
  return await axiosInstance
    .post<{
      status: boolean
      msg: string
      dados: {
        id: string
        codigo: string
      } | null
      error?: unknown
    }>(`pedido/fornecedor/${form.fornecedorId}`, {
      permiteEntregaParcial: form.permiteEntregaParcial,
      condicoesEntrega: form.condicoesEntrega,
      prazoEntrega: form.prazoEntrega,
      codigo: form.codigo,
      itens: form.itens,
      frete: form.frete,
      armazenamento: form.armazenamento,
      localEntrega: form.localEntrega,
      formaPagamento: form.formaPagamento,
      imposto: form.imposto,
    })
    .then(resp => {
      return resp.data
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao salvar o novo pedido.',
        dados: null,
        error,
      }
    })
}

export async function consultarPedido({
  idPedido,
  codigoPedido,
}: ConsultaPedidoProps) {
  return await axiosInstance
    .get<{
      status: boolean
      msg: string
      dados: null | PedidosFornecedorType
      error?: unknown
    }>('pedido', {
      params: {
        id: idPedido,
        codigo: codigoPedido,
      },
    })
    .then(resp => {
      return resp.data
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao consultar o pedido.',
        dados: null,
        error,
      }
    })
}

export async function buscarPedidosFornecedor({
  fornecedorId,
}: ConsultaPedidosFornecedorProps) {
  return await axiosInstance
    .get<{
      status: boolean
      msg: string
      dados: Array<PedidosFornecedorType>
      error?: unknown
    }>(`pedido/${fornecedorId}/all`)
    .then(resp => {
      return resp.data
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao consultar os pedidos.',
        dados: null,
        error,
      }
    })
}

export async function buscarPedidosPorStatusEmpresa(status: string) {
  return await axiosInstance
    .get<{
      status: boolean
      msg: string
      dados: Array<PedidosFornecedorType>
      error?: unknown
    }>(`pedido/${status}`)
    .then(resp => {
      return resp.data
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao consultar os pedidos.',
        dados: null,
        error,
      }
    })
}

export async function cancelarPedido({ idPedido }: AlteraPedidoProps) {
  return await axiosInstance
    .patch<{
      status: boolean
      msg: string
      dados: {
        id: string
      } | null
      error?: unknown
    }>(`pedido/${idPedido}/cancelar`)
    .then(resp => {
      return resp.data
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao cancelar o pedido.',
        dados: null,
        error,
      }
    })
}

export async function excluirPedido({ idPedido }: AlteraPedidoProps) {
  return await axiosInstance
    .delete<{
      status: boolean
      msg: string
      dados: {
        id: string
      } | null
      error?: unknown
    }>(`pedido/${idPedido}/excluir`)
    .then(resp => {
      return resp.data
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao excluir o pedido.',
        dados: null,
        error,
      }
    })
}

export async function buscarPedidosEmpresa() {
  return await axiosInstance
    .get<{
      status: boolean
      msg: string
      dados: Array<PedidosFornecedorType>
      error?: unknown
    }>('pedido/pendentes')
    .then(resp => {
      return resp.data
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao consultar os pedidos.',
        dados: null,
        error,
      }
    })
}

export async function baixarPdfPedido(idPedido: string) {
  return await axiosInstance
    .get<Blob>(`pedido/${idPedido}/pdf`, {
      responseType: 'blob',
    })
    .then(resp => {
      const blob = new Blob([resp.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `pedido_${idPedido}.pdf`
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return {
        status: true,
        msg: 'PDF baixado com sucesso!',
      }
    })
    .catch(error => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao baixar o PDF do pedido.',
        error,
      }
    })
}

export async function buscarItensAvaliativosRecebimento() {
  return await axiosInstance
    .get<Array<ItemAvaliacaoType>>('pedido/recebimento/avaliacao/itens')
    .then(({ data }) => {
      return data
    })
}

import { axiosInstance } from '@/lib/AxiosLib'

import { formNovoPedidoType } from '../(views)/NovoPedido'
import { PedidosFornecedorType } from '../../../(schemas)/compras/schema-compras'
import { FormVerificacaoEntregaType } from '../../recebimento/(view)/VerificacaoEntregaPedido'

interface ConsultaPedidoProps {
  idPedido?: string
  codigoPedido: string
}

interface ConsultaPedidosFornecedorProps {
  fornecedorId: string
}

interface InsereRecebimentoProps {
  compraId: string
  data: FormVerificacaoEntregaType
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
    })
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
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
    }>(`pedido`, {
      params: {
        id: idPedido,
        codigo: codigoPedido,
      },
    })
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
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
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao consultar os pedidos.',
        dados: null,
        error,
      }
    })
}

export async function buscarPedidosPendentesEmpresa() {
  return await axiosInstance
    .get<{
      status: boolean
      msg: string
      dados: Array<PedidosFornecedorType>
      error?: unknown
    }>(`pedido/pendentes`)
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao consultar os pedidos.',
        dados: null,
        error,
      }
    })
}

export async function inserirRecebimento({
  compraId,
  data,
}: InsereRecebimentoProps) {
  return await axiosInstance
    .post<{
      status: boolean
      msg: string
      error?: unknown
    }>(`pedido/${compraId}/recebimento`, {
      dataRecebimento: data.dataRecebimento,
      notaRecebimento: data.notaRecebimento,
      qtdIncorreta: data.qtdIncorreta,
      entregaAvarias: data.entregaAvarias,
      numeroNotaFiscal: data.numeroNotaFiscal,
      numeroCertificado: data.numeroCertificado,
      pedidoRecebidoCompleto: data.pedidoRecebidoCompleto,
    })
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao inserir o recebimento.',
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
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
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
    .patch<{
      status: boolean
      msg: string
      dados: {
        id: string
      } | null
      error?: unknown
    }>(`pedido/${idPedido}/excluir`)
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
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
    }>(`pedido/pendentes`)
    .then((resp) => {
      return resp.data
    })
    .catch((error) => {
      return {
        status: false,
        msg: 'Ocorreu um erro ao consultar os pedidos.',
        dados: null,
        error,
      }
    })
}

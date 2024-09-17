import { z } from 'zod'

import { axiosInstance } from '@/lib/AxiosLib'

import { FormularioCadastroFornecedor } from '../(views)/CadastroFornecedor'
import { FormularioNovaAvaliacao } from '../(views)/NovaAvaliacao'
import { FormularioNovoEmail } from '../(views)/NovoEmail'
import { FormularioNovoTelefone } from '../(views)/NovoTelefone'
import { FormularioAnexoType } from '../(views)/VisualizarDadosFornecedores'
import {
  EnderecoFornecedorType,
  schemaDocumentoForm,
  schemaEmailForm,
  schemaEnderecoForm,
  schemaTelefoneForm,
} from '../../../(schemas)/fornecedores/schema-fornecedor'

interface FornecedorProps {
  id?: string
}

interface EdicaoEnderecoProps {
  endereco: EnderecoFornecedorType
  idFornecedor: string
}

interface NovoTelefoneProps {
  telefone: FormularioNovoTelefone
  idFornecedor: string
}

interface NovoEmailProps {
  email: FormularioNovoEmail
  idFornecedor: string
}

interface NovoAnexoProps {
  anexo: FormularioAnexoType
  idFornecedor: string
}

interface ExclusaoDadosProps {
  id: string
}

export type FornecedoresEmpresaType = {
  id: string
  nome: string
  documento: string
  aprovado: boolean
  desempenho: boolean
  critico: boolean
}

export type FornecedorDadosType = {
  id: string
  nome: string
  documento: string
  desempenho: number
  ultimaAvaliacao: Date | null
  critico: boolean
  aprovado: boolean
  endereco: z.infer<typeof schemaEnderecoForm>
  telefones: z.infer<typeof schemaTelefoneForm>[]
  emails: z.infer<typeof schemaEmailForm>[]
}

export type AvaliacaoFornecedorType = {
  id: string
  usuario: string
  nota: number
  validade: Date
  aprovado: boolean
  avaliadoEm: Date
}

export type AvaliacaoFornecedorRecebimentoType = {
  id: number
  nota: number
  avaliadoEm: Date
}

export type AnexoFornecedor = {
  id: string
  nome: string
  arquivo: string
}

type ResponseNovoFornecedorType = {
  status: boolean
  msg: string
  dados: FornecedoresEmpresaType | null
  erro: string | null
}

export type ResponseFornecedorType = {
  status: boolean
  msg: string
  dados: FornecedorDadosType | null
  erro: string | null
}

type ResponseAvaliacoesFornecedorType = {
  status: boolean
  msg: string
  dados: AvaliacaoFornecedorType[] | null
  erro?: string | null
}

type ResponseAvaliacoesRecebimentoFornecedorType = {
  status: boolean
  msg: string
  dados: AvaliacaoFornecedorRecebimentoType[] | null
  erro?: string | null
}

export type ResponseAnexosFornecedorType = {
  status: boolean
  msg: string
  dados: AnexoFornecedor[] | null
  erro?: string | null
}

type ResponseNovaAvaliacaoType = {
  status: boolean
  msg: string
}

type ResponseEnderecoFornecedor = {
  status: boolean
  msg: string
  dados: EnderecoFornecedorType | null
  erro?: string | null
}

type ResponseTelefoneFornecedor = {
  status: boolean
  msg: string
  dados: z.infer<typeof schemaTelefoneForm> | null
  error?: string | null
}

type ResponseEmailFornecedor = {
  status: boolean
  msg: string
  dados: z.infer<typeof schemaEmailForm> | null
  error?: string | null
}

type ResponseAnexoFornecedor = {
  status: boolean
  msg: string
  dados: z.infer<typeof schemaDocumentoForm> | null
  error?: string | null
}

export async function buscarFornecedores() {
  const response =
    await axiosInstance.get<FornecedoresEmpresaType[]>(`fornecedor`)

  return response.data
}

export async function salvarNovoFornecedor(data: FormularioCadastroFornecedor) {
  const response = await axiosInstance
    .post<ResponseNovoFornecedorType>(`fornecedor`, data)
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
        dados: response.data.dados,
        erro: null,
      }
    })
    .catch((err) => {
      return {
        status: false,
        msg: err?.response.data.msg,
        dados: null,
        erro: err,
      }
    })

  return response
}

export async function consultarDadosFornecedor({ id }: FornecedorProps) {
  return await axiosInstance
    .get<ResponseFornecedorType>(`fornecedor/${id}`)
    .then((resp) => {
      return {
        status: resp.data.status,
        msg: resp.data.msg,
        dados: resp.data.dados,
        erro: null,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
        dados: null,
        erro: error,
      }
    })
}

export async function consultarAvaliacoesFornecedor({ id }: FornecedorProps) {
  return await axiosInstance
    .get<ResponseAvaliacoesFornecedorType>(`fornecedor/${id}/avaliacoes`)
    .then((resp) => {
      return {
        status: resp.data.status,
        msg: resp.data.msg,
        dados: resp.data.dados,
        erro: null,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
        dados: null,
        erro: error,
      }
    })
}

export async function consultarAvaliacoesRecebimentoFornecedor({
  id,
}: FornecedorProps) {
  return await axiosInstance
    .get<ResponseAvaliacoesRecebimentoFornecedorType>(
      `fornecedor/${id}/avaliacoes-entrega`,
    )
    .then((resp) => {
      return {
        status: resp.data.status,
        msg: resp.data.msg,
        dados: resp.data.dados,
        erro: null,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
        dados: null,
        erro: error,
      }
    })
}

export async function consultarAnexosFornecedor({ id }: FornecedorProps) {
  return await axiosInstance
    .get<ResponseAnexosFornecedorType>(`fornecedor/${id}/documentos`)
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
        dados: response.data.dados,
        erro: null,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
        dados: null,
        erro: error,
      }
    })
}

export async function salvarNovaAvaliacao(data: FormularioNovaAvaliacao) {
  return await axiosInstance
    .post<ResponseNovaAvaliacaoType>(
      `fornecedor/${data.idFornecedor}/avaliacao`,
      {
        aprovado: data.aprovado,
        nota: data.nota,
        validade: data.validade,
      },
    )
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
      }
    })
}

export async function salvarModificacaoEndereco({
  idFornecedor,
  endereco,
}: EdicaoEnderecoProps) {
  return await axiosInstance
    .put<ResponseEnderecoFornecedor>(
      `fornecedor/${idFornecedor}/endereco/${endereco.id}`,
      endereco,
    )
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
        dados: response.data.dados,
        erro: null,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
        dados: null,
        erro: error,
      }
    })
}

export async function excluirTelefone({ id }: ExclusaoDadosProps): Promise<{
  status: boolean
  msg: string
}> {
  return await axiosInstance
    .delete<{
      status: boolean
      msg: string
    }>(`fornecedor/telefone/${id}`)
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
      }
    })
}

export async function excluirEmail({ id }: ExclusaoDadosProps): Promise<{
  status: boolean
  msg: string
}> {
  return await axiosInstance
    .delete<{
      status: boolean
      msg: string
    }>(`fornecedor/email/${id}`)
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
      }
    })
}

export async function excluirAnexo({ id }: ExclusaoDadosProps): Promise<{
  status: boolean
  msg: string
}> {
  return await axiosInstance
    .delete<{
      status: boolean
      msg: string
    }>(`fornecedor/anexo/${id}`)
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
      }
    })
}

export async function excluirFornecedor({ id }: ExclusaoDadosProps): Promise<{
  status: boolean
  msg: string
}> {
  return await axiosInstance
    .delete<{
      status: boolean
      msg: string
    }>(`fornecedor/${id}`)
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: error.response.data.msg,
      }
    })
}

export async function salvarNovoTelefone({
  idFornecedor,
  telefone,
}: NovoTelefoneProps) {
  return await axiosInstance
    .post<ResponseTelefoneFornecedor>(
      `fornecedor/${idFornecedor}/telefone`,
      telefone,
    )
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
        dados: response.data.dados,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: String(error.response.data.msg),
        dados: null,
        error: error.response.data.error,
      }
    })
}

export async function salvarNovoEmail({ idFornecedor, email }: NovoEmailProps) {
  return await axiosInstance
    .post<ResponseEmailFornecedor>(`fornecedor/${idFornecedor}/email`, email)
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
        dados: response.data.dados,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: String(error.response.data.msg),
        dados: null,
        error: error.response.data.error,
      }
    })
}

export async function salvarAnexoFornecedor({
  anexo,
  idFornecedor,
}: NovoAnexoProps) {
  return await axiosInstance
    .post<ResponseAnexoFornecedor>(`fornecedor/${idFornecedor}/anexo`, anexo)
    .then((response) => {
      return {
        status: response.data.status,
        msg: response.data.msg,
        dados: response.data.dados,
      }
    })
    .catch((error) => {
      return {
        status: false,
        msg: String(error.response.data.msg),
        dados: null,
        error: error.response.data.error,
      }
    })
}

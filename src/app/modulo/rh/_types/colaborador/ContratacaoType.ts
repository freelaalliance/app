import type { Pessoa } from '@/types/PessoaType'
import type { Cargo } from '../cargos/CargoType'
import type { TreinamentosType } from '../treinamentos/TreinamentoType'

export interface DocumentoContrato {
  id?: number
  documento: string
  chaveArquivo?: string
}

export interface Colaborador {
  id?: string
  documento: string
  pessoa: Pessoa
}

export interface TreinamentoRealizado {
  id: string
  iniciadoEm: string
  finalizadoEm?: string
  certificado?: string
  treinamento: TreinamentosType
  contratacao?: Contratacao
  colaborador?: string
  cargo?: string
  diasPendente?: number
  duracaoDias?: number
}

export interface Contratacao {
  id: string
  admitidoEm: string
  demitidoEm?: string
  colaborador: Colaborador
  cargo: Cargo
  responsavel?: {
    id: string
    nome: string
  }
  treinamentosRealizados?: TreinamentoRealizado[]
  documentosContrato?: DocumentoContrato[]
}

export interface CriarContratacaoRequest {
  admitidoEm: Date
  cargoId: string
  colaborador: {
    documento: string
    pessoa: Pessoa
  }
  documentosContrato?: DocumentoContrato[]
}

export interface AtualizarContratacaoRequest {
  admitidoEm?: string
  demitidoEm?: string
  cargoId?: string
  documentosContrato?: DocumentoContrato[]
}

export interface DemitirColaboradorRequest {
  dataDemissao: string
}

export interface TransferirColaboradorRequest {
  novoCargoId: string
}

export interface IniciarTreinamentoRequest {
  iniciadoEm: string
  treinamentosId: string
  contratacaoColaboradorId: string
}

export interface FinalizarTreinamentoRequest {
  finalizadoEm: string
  certificado?: string
}

export interface AtualizarTreinamentoRealizadoRequest {
  iniciadoEm?: string
  finalizadoEm?: string
  certificado?: string
}

export interface HistoricoContratacao {
  id: string
  data: string
  descricao: string
}
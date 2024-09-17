import { axiosInstance } from '@/lib/AxiosLib'

import { ExcluirEquipamentoDialogProps } from '../components/dialogs/(equipamento)/ExclusaoEquipamentoDialog'
import { ExclusaoPecaEquipamentoProps } from '../components/dialogs/(equipamento)/ExclusaoPecaEquipamentoDialog'
import { FormEdicaoEquipamentoType } from '../components/forms/(equipamento)/FormularioEdicaoEquipamento'
import { TabelaPecasEquipamentoProps } from '../components/tables/pecas_equipamento/tabela-pecas-equipamento'
import {
  DadosAgendaEquipamentoType,
  DadosEquipamentoType,
  DadosPecasEquipamentoType,
  FormularioNovoEquipamentoType,
} from '../schemas/EquipamentoSchema'

export interface EquipamentoApiProps {
  equipamentoId: string
}

interface AdicionaPecasEquipamentoProps {
  pecas: Array<{
    nome: string
    descricao?: string
    equipamentoId: string
  }>
}

interface EdicaoPecaEquipamentoProps {
  id: string
  nome: string
  descricao?: string
  equipamentoId: string
}

export async function listarEquipamentos() {
  const response =
    await axiosInstance.get<Array<DadosEquipamentoType>>('equipamento/todos')

  return response.data
}

export async function criarEquipamento(
  dadosEquipamento: FormularioNovoEquipamentoType,
) {
  const response = await axiosInstance.post<DadosEquipamentoType>(
    'equipamento/',
    dadosEquipamento,
  )

  return response.data
}

export async function excluirEquipamento({
  id,
}: ExcluirEquipamentoDialogProps) {
  const response = await axiosInstance.delete(`equipamento/${id}`)

  return response.data
}

export async function listarPecasEquipamento({
  idEquipamento,
}: TabelaPecasEquipamentoProps) {
  const response = await axiosInstance.get<Array<DadosPecasEquipamentoType>>(
    `equipamento/${idEquipamento}/pecas`,
  )

  return response.data
}

export async function excluirPecaEquipamento({
  idPeca,
}: ExclusaoPecaEquipamentoProps) {
  const response = await axiosInstance.delete(`equipamento/peca/${idPeca}`)

  return response.data
}

export async function salvarNovasPecas(data: AdicionaPecasEquipamentoProps) {
  const response = await axiosInstance.post('equipamento/pecas', data)

  return response.data
}

export async function atualizarPecaEquipamento({
  id,
  equipamentoId,
  nome,
  descricao,
}: EdicaoPecaEquipamentoProps) {
  const response = await axiosInstance.put<DadosPecasEquipamentoType>(
    `equipamento/${equipamentoId}/peca/${id}`,
    { nome, descricao },
  )

  return response.data
}

export async function atualizarEquipamento({
  id,
  codigo,
  nome,
  especificacao,
  frequencia,
  tempoOperacao,
}: FormEdicaoEquipamentoType) {
  const response = await axiosInstance.put<DadosEquipamentoType>(
    `equipamento/${id}`,
    { codigo, nome, especificacao, frequencia, tempoOperacao },
  )

  return response.data
}

export async function buscarAgendamentosEquipamento({
  idEquipamento,
}: TabelaPecasEquipamentoProps) {
  const response = await axiosInstance.get<Array<DadosAgendaEquipamentoType>>(
    `equipamento/${idEquipamento}/agenda`,
  )

  return response.data
}

export async function buscarDadosEquipamento({
  equipamentoId,
}: EquipamentoApiProps) {
  const response = await axiosInstance.get<DadosEquipamentoType>(
    `equipamento/${equipamentoId}`,
  )

  return response.data
}

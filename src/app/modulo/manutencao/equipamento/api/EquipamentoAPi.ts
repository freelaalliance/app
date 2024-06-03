import { axiosInstance } from "@/lib/AxiosLib"
import { DadosAgendaEquipamentoType, DadosEquipamentoType, DadosPecasEquipamentoType, FormularioNovoEquipamentoType } from "../schemas/EquipamentoSchema"
import { ExcluirEquipamentoDialogProps } from "../components/dialogs/ExclusaoEquipamentoDialog"
import { TabelaPecasEquipamentoProps } from "../components/tables/pecas_equipamento/tabela-pecas-equipamento"
import { ExclusaoPecaEquipamentoProps } from "../components/dialogs/ExclusaoPecaEquipamentoDialog"
import { FormEdicaoEquipamentoType } from "../components/forms/FormularioEdicaoEquipamento"

interface AdicionaPecasEquipamentoProps {
  pecas: Array<{
    nome: string,
    descricao?: string,
    equipamentoId: string
  }>
}

interface EdicaoPecaEquipamentoProps {
  id: string,
  nome: string,
  descricao?: string,
  equipamentoId: string
}

export async function listarEquipamentos() {
  const response = await axiosInstance.get<Array<DadosEquipamentoType>>('equipamento/todos')

  return response.data
}

export async function criarEquipamento(dadosEquipamento: FormularioNovoEquipamentoType) {
  const response = await axiosInstance.post<DadosEquipamentoType>('equipamento/', dadosEquipamento)

  return response.data
}

export async function excluirEquipamento({ id }: ExcluirEquipamentoDialogProps) {
  const response = await axiosInstance.delete(`equipamento/${id}`)

  return response.data
}

export async function listarPecasEquipamento({ idEquipamento }: TabelaPecasEquipamentoProps) {
  const response = await axiosInstance.get<Array<DadosPecasEquipamentoType>>(`equipamento/${idEquipamento}/pecas`)

  return response.data
}

export async function excluirPecaEquipamento({ idPeca }: ExclusaoPecaEquipamentoProps) {
  const response = await axiosInstance.delete(`equipamento/peca/${idPeca}`)

  return response.data
}

export async function salvarNovasPecas(data: AdicionaPecasEquipamentoProps) {
  const response = await axiosInstance.post('equipamento/pecas', data)

  return response.data
}

export async function atualizarPecaEquipamento({id, equipamentoId, nome, descricao}: EdicaoPecaEquipamentoProps){
  const response = await axiosInstance.put<DadosPecasEquipamentoType>(`equipamento/${equipamentoId}/peca/${id}`, {nome, descricao})

  return response.data
}

export async function atualizarEquipamento({id, codigo, nome, especificacao, frequencia}: FormEdicaoEquipamentoType){
  const response = await axiosInstance.put<DadosEquipamentoType>(`equipamento/${id}`, {codigo, nome, especificacao, frequencia})

  return response.data
}

export async function buscarAgendamentosEquipamento({ idEquipamento }: TabelaPecasEquipamentoProps){
  const response = await axiosInstance.get<Array<DadosAgendaEquipamentoType>>(`equipamento/${idEquipamento}/agenda`)

  return response.data
}
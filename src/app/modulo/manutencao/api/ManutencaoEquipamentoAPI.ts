import { axiosInstance } from "@/lib/AxiosLib";
import { EquipamentoApiProps } from "./EquipamentoAPi";
import { 
  dadosIndicadoresManutencaoType,
  DadosManutencaoEquipamentoType, 
  DadosNovaOrdemManutencaoType, 
  DuracaoManutencoesEquipamentoType, 
  estatisticasEquipamentoType, 
  estatisticasManutencaoType 
} from "../schemas/ManutencaoSchema";

interface ManutencaoEquipamentoProps {
  idManutencao: string
  equipamentoId: string
}

interface EquipamentoProps {
  equipamentoId?: string|null
}

interface FinalizacaoManutencaoEquipamentoProps {
  idManutencao: string
  equipamentoId: string 
  finalizadoEm: Date,
}

export async function buscarManutencoesEquipamento({equipamentoId}: EquipamentoApiProps){
  const response = await axiosInstance.get<Array<DadosManutencaoEquipamentoType>>(`manutencao/equipamento/${equipamentoId}`)

  return response.data
}

export async function cancelarManutencao({idManutencao, equipamentoId}: ManutencaoEquipamentoProps){
  const response = await axiosInstance.patch<DadosManutencaoEquipamentoType>(`manutencao/cancelar/${idManutencao}`, {
    equipamentoId
  })

  return response.data
}

export async function iniciarManutencao({idManutencao, equipamentoId}: ManutencaoEquipamentoProps){
  const response = await axiosInstance.patch<DadosManutencaoEquipamentoType>(`manutencao/iniciar/${idManutencao}`, {
    equipamentoId
  })

  return response.data
}

export async function finalizarManutencao({idManutencao, equipamentoId, finalizadoEm}: FinalizacaoManutencaoEquipamentoProps){
  const response = await axiosInstance.patch<DadosManutencaoEquipamentoType>(`manutencao/finalizar/${idManutencao}`, {
    equipamentoId,
    finalizadoEm,
  })

  return response.data
}

export async function buscarDuracaoManutencoesEquipamento({equipamentoId}: EquipamentoApiProps){
  const response = await axiosInstance.get<Array<DuracaoManutencoesEquipamentoType>>(
    `manutencao/equipamento/${equipamentoId}/duracao`
  )

  return response.data
}

export async function criarNovaManutencaoEquipamento({observacao, equipamentoId}: DadosNovaOrdemManutencaoType){
  const response = await axiosInstance.post<DadosManutencaoEquipamentoType>(`manutencao/equipamento/${equipamentoId}`, {
    observacao,
  })

  return response.data
}

export async function consultaEstatatisticaEquipamento(){
  const response = await axiosInstance.get<estatisticasEquipamentoType>(`manutencao/equipamento/estatatisticas/status`)

  return response.data
}

export async function consultaEstatatisticaManutencao(){
  const response = await axiosInstance.get<estatisticasManutencaoType>(`manutencao/estatisticas`)

  return response.data
}

export async function consultaIndicadoresManutencaoEmpresa({ equipamentoId }: EquipamentoProps){
  const response = await axiosInstance.get<dadosIndicadoresManutencaoType>(`manutencao/indicadores`, {
    params: {
      equipamentoId
    }
  })

  return response.data
}

import { axiosInstance } from "@/lib/AxiosLib"
import { DadosInspecoesEquipamentoType } from "../schemas/EquipamentoSchema"
import { DadosFinalizacaoInspecaoType, DadosInspecaoType, PontosInspecaoType } from "../schemas/InspecaoSchema"
import { EquipamentoApiProps } from "./EquipamentoAPi"

export async function buscarInspecoesEquipamento({equipamentoId}: EquipamentoApiProps){
  const response = await axiosInstance.get<Array<DadosInspecoesEquipamentoType>>(`inspecao/equipamento/${equipamentoId}`)

  return response.data
}

export async function salvarInspecaoEquipamento({iniciadoEm, finalizadoEm, equipamentoId, inspecaoPeca, observacao}: DadosInspecaoType){
  const response = await axiosInstance.post<DadosInspecoesEquipamentoType>(`inspecao/equipamento/${equipamentoId}`, {
    iniciadoEm,
    finalizadoEm,
    inspecaoPeca,
    observacao
  })

  return response.data
}

export async function buscarItensInspecoes(idInspecao: string){
  const response = await axiosInstance.get<PontosInspecaoType>(`inspecao/${idInspecao}`)

  return response.data
}

export async function salvarFinalizacaoInspecaoEquipamento({id, iniciadoEm, finalizadoEm, equipamentoId, inspecaoPeca, observacao}: DadosFinalizacaoInspecaoType){
  const response = await axiosInstance.put<DadosInspecoesEquipamentoType>(`inspecao/${id}`, {
    equipamentoId,
    iniciadoEm,
    finalizadoEm,
    inspecaoPeca,
    observacao
  })

  return response.data
}
'use client'

import {DialogTitle, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { DadosInspecoesEquipamentoType } from "../../../schemas/EquipamentoSchema"
import { formatarDataBrasil } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { RetomadaInspecaoForm } from "../../forms/(inspecoes)/FormularioRetomadaInspecao"
import { buscarItensInspecoes } from "@/app/modulo/manutencao/api/InspecaoEquipamentoAPI"

interface RetomadaInspecaoEquipamentoProps {
  dadosInspecao: DadosInspecoesEquipamentoType
}

export function RetomadaInspecaoEquipamentoDialog({
  dadosInspecao
}: RetomadaInspecaoEquipamentoProps) {
  const { data: listaPontosInspecao, isLoading: carregandoPontos } = useQuery({
    queryKey: ['listaPontosInspecao', dadosInspecao.id],
    queryFn: () => buscarItensInspecoes(dadosInspecao.id)
  })

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{`Inspeção realizado por `}<b className="capitalize">{dadosInspecao.usuario.pessoa.nome}</b></DialogTitle>
        <DialogDescription className="text-base">{`Iniciado em: `}<b>{formatarDataBrasil(new Date(dadosInspecao.iniciadoEm))}</b></DialogDescription>
      </DialogHeader>
      {
        carregandoPontos ? (
          <div className="grid">
            <div className="flex-1 flex-row space-y-2">
              <Skeleton className="h-10 w-full rounded shadow" />
              <Skeleton className="h-10 w-full rounded shadow" />
              <Skeleton className="h-10 w-full rounded shadow" />
            </div>
          </div>
        ) : listaPontosInspecao && listaPontosInspecao?.length > 0 ? (
          <RetomadaInspecaoForm dadosInspecao={dadosInspecao} pontosInspecao={listaPontosInspecao ?? []}/>
        ):(
          <p className="text-base w-full text-center">Nenhum ponto foi inspecionado anteriormente, inicie novamente a inspeção.</p>
        )  
      }
    </DialogContent>
  )
}
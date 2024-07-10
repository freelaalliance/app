'use client'

import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { buscarDadosEquipamento, listarPecasEquipamento } from "@/app/modulo/manutencao/api/EquipamentoAPi";
import { NovaInspecaoForm } from "../../forms/(inspecoes)/FormularioInspecaoEquimento";
import { InformacaoEquipamento } from "../../InfoEquipamento";

export interface NovaInspecaoEquipamentoProps {
  idEquipamento: string,
  fecharModalInspecao: () => void
}

export function NovaInspecaoEquipamentoDialog({ idEquipamento, fecharModalInspecao }: NovaInspecaoEquipamentoProps) {

  const { data: dadosEquipamento, isLoading: carregandoInfoEquipamento } = useQuery({
    queryKey: ['dadosEquipamentoInspecao', idEquipamento],
    queryFn: () => buscarDadosEquipamento({ equipamentoId: idEquipamento })
  })

  const { data: listaPecasEquipamanto, isLoading: carregandoPecas } = useQuery({
    queryKey: ['listaPecasEquipamentoInspecao', idEquipamento],
    queryFn: () => listarPecasEquipamento({ idEquipamento })
  })

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Nova Inspeção</DialogTitle>
        <DialogDescription>Área de inspeção do equipamento e seus itens</DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <InformacaoEquipamento carregandoDados={carregandoInfoEquipamento} dadosEquipamento={dadosEquipamento} />
        {
          carregandoPecas ? (
            <div className="flex-1 flex-row justify-center gap-2">
              <Loader className="size-4" />
              <span>Carregando itens do equipamento...</span>
            </div>
          ) : (
            <NovaInspecaoForm idEquipamento={idEquipamento} pecasEquipamento={listaPecasEquipamanto ?? []} fecharModalInspecao={fecharModalInspecao} />
          )
        }
      </div>
    </DialogContent>
  )
}
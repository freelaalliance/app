'use client'

import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { iniciarManutencao } from "../../../api/ManutencaoEquipamentoAPI";
import { toast } from "sonner";
import { DadosManutencaoEquipamentoType } from "../../../schemas/ManutencaoSchema";

interface AlertIniciaManutencaoProps {
  idManutencao: string
  equipamentoId: string
}

export function AlertIniciarManutencaoEquipamento({idManutencao, equipamentoId}: AlertIniciaManutencaoProps) {

  const queryClient = useQueryClient()

  const { mutateAsync: iniciarManutencaoEquipamento } = useMutation({
    mutationFn: iniciarManutencao,
    onError: () => {
      toast.error('Erro ao iniciar manutenção do equipamento')
    },
    onSuccess: (dados) => {
      const listaManutencoesEquipamento: Array<DadosManutencaoEquipamentoType> | undefined = queryClient.getQueryData(['manutencoesEquipamento', equipamentoId])

      queryClient.setQueryData(
        ['manutencoesEquipamento', equipamentoId],
        listaManutencoesEquipamento?.map((manutencao) => {
          if (dados.id === manutencao.id) {
            return { ...manutencao, iniciadoEm: dados.iniciadoEm }
          }
          return manutencao
        })
      )

      toast.success('Manutenção iniciada com sucesso')
    }
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Deseja realmente iniciar a manutenção?
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-200 text-red-700 hover:bg-red-300 shadow border-0">
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction 
          className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow border-0" 
          onClick={async () => {
            await iniciarManutencaoEquipamento({
              equipamentoId,
              idManutencao
            })
          }}
        >
          Confirmar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
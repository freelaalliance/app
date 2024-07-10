'use client'

import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DadosPecasEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { excluirPecaEquipamento } from "@/app/modulo/manutencao/api/EquipamentoAPi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface ExclusaoPecaEquipamentoProps {
  idPeca: string
  idEquipamento?: string
}

export function ExclusaoPecaEquipamentoDialog({ idPeca, idEquipamento }: ExclusaoPecaEquipamentoProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: removerPecaEquipamento, isPending } = useMutation({
    mutationFn: ({ idPeca }: ExclusaoPecaEquipamentoProps) => excluirPecaEquipamento({ idPeca }),
    onError: (error) => {
      toast.error('Erro ao excluir a peça', {
        description: error.message,
      })
    },
    onSuccess: () => {
      const listaPecasEquipamento: Array<DadosPecasEquipamentoType> | undefined = queryClient.getQueryData(['listaPecasEquipamento', idEquipamento])

      queryClient.setQueryData(
        ['listaPecasEquipamento', idEquipamento],
        listaPecasEquipamento?.filter((pecaEquipamento) => pecaEquipamento.id !== idPeca),
      )

      toast.success('Peça excluída com sucesso!')
    }
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir peça</AlertDialogTitle>
        <AlertDialogDescription>Tem certeza que deseja excluir esta peça?</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-200 text-red-700 hover:bg-red-300 shadow border-0">Cancelar</AlertDialogCancel>
        {
          isPending ? (
            <Button className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow gap-2" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Excluindo...
            </Button>
          ) : (
            <AlertDialogAction className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow" onClick={async () => await removerPecaEquipamento({ idPeca })}>
              Excluir
            </AlertDialogAction>
          )
        }
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
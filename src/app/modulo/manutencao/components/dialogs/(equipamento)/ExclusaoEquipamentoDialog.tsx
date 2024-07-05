'use client'

import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { excluirEquipamento } from "@/app/modulo/manutencao/api/EquipamentoAPi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DadosEquipamentoType } from "../../../schemas/EquipamentoSchema";

export interface ExcluirEquipamentoDialogProps {
  id: string;
}
export function ExclusaoEquipamentoDialog({ id }: ExcluirEquipamentoDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: removerEquipamento, isPending } = useMutation({
    mutationFn: ({ id }: ExcluirEquipamentoDialogProps) => excluirEquipamento({ id }),
    onError: (error) => {
      toast.error('Erro ao excluir o equipamento', {
        description: error.message,
      })
    },
    onSuccess: () => {
      const listaEquipamentos: Array<DadosEquipamentoType> | undefined = queryClient.getQueryData(['listaEquipamentosEmpresa'])

      queryClient.setQueryData(
        ['listaEquipamentosEmpresa'],
        listaEquipamentos?.filter((equipamento) => equipamento.id !== id),
      )

      toast.success('Equipamento excluído com sucesso!')
    }
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir equipamento</AlertDialogTitle>
        <AlertDialogDescription>Tem certeza que deseja excluir este equipamento?</AlertDialogDescription>
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
            <AlertDialogAction className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow" onClick={async () => await removerEquipamento({ id })}>
              Excluir
            </AlertDialogAction>
          )
        }
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
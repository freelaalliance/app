'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { finalizarManutencao } from '../../../api/ManutencaoEquipamentoAPI'
import { DadosManutencaoEquipamentoType } from '../../../schemas/ManutencaoSchema'

interface AlertEncerraManutencaoProps {
  idManutencao: string
  equipamentoId: string
}

export function AlertEncerrarManutencaoEquipamento({
  idManutencao,
  equipamentoId,
}: AlertEncerraManutencaoProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: encerrarManutencaoEquipamento } = useMutation({
    mutationFn: finalizarManutencao,
    onError: () => {
      toast.error('Erro ao encerrar a manutenção do equipamento')
    },
    onSuccess: (dados) => {
      const listaManutencoesEquipamento:
        | Array<DadosManutencaoEquipamentoType>
        | undefined = queryClient.getQueryData([
        'manutencoesEquipamento',
        equipamentoId,
      ])

      queryClient.setQueryData(
        ['manutencoesEquipamento', equipamentoId],
        listaManutencoesEquipamento?.map((manutencao) => {
          if (dados.id === manutencao.id) {
            return {
              ...manutencao,
              finalizadoEm: dados.finalizadoEm,
              duracao: dados.duracao,
            }
          }
          return manutencao
        }),
      )

      toast.success('Manutenção encerrada com sucesso')
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Deseja realmente encerrar a manutenção?
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-200 text-red-700 hover:bg-red-300 shadow border-0">
          Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
          className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow border-0"
          onClick={async () => {
            await encerrarManutencaoEquipamento({
              equipamentoId,
              idManutencao,
              finalizadoEm: new Date(),
            })
          }}
        >
          Confirmar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

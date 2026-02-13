'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import {
  type AvaliacaoFornecedorType,
  excluirAvaliacaoFornecedor,
} from '../../(api)/FornecedorApi'

interface ExcluirAvaliacaoDialogProps {
  avaliacaoId: string
  idFornecedor: string
}

export function ExcluirAvaliacaoDialog({
  avaliacaoId,
  idFornecedor,
}: ExcluirAvaliacaoDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: removerAvaliacao, isPending } = useMutation({
    mutationFn: excluirAvaliacaoFornecedor,
    onError: error => {
      toast.error('Erro ao excluir a avaliação', {
        description: error.message,
      })
    },
    onSuccess: resp => {
      if (resp.status) {
        const avaliacoesFornecedor:
          | {
            status: boolean
            msg: string
            dados: AvaliacaoFornecedorType[] | null
            erro?: string | null
          }
          | undefined = queryClient.getQueryData([
            'estatisticasAvaliacoesCritico',
            idFornecedor,
          ])

        queryClient.setQueryData(
          ['estatisticasAvaliacoesCritico', idFornecedor],
          avaliacoesFornecedor && {
            ...avaliacoesFornecedor,
            dados: avaliacoesFornecedor.dados?.filter(
              avaliacao => avaliacao.id !== avaliacaoId
            ),
          }
        )

        toast.success(resp.msg)
      } else {
        toast.warning(resp.msg)
      }
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir avaliação</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser
          desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-200 text-red-700 hover:bg-red-300 shadow border-0">
          Cancelar
        </AlertDialogCancel>
        {isPending ? (
          <Button
            className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow gap-2"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Excluindo...
          </Button>
        ) : (
          <AlertDialogAction
            className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow"
            onClick={async () =>
              await removerAvaliacao({ idFornecedor, avaliacaoId })
            }
          >
            Excluir avaliação
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

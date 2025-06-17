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
import { useEmpresa } from '@/lib/CaseAtom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  type AtualizarStatusItemAvaliacaoExpedicaoType,
  removerItemAvaliativosExpedicao,
} from '../../../_api/AdmVendas'

export function RemoverItemAvaliativoExpedicaoAlertDialog({
  id,
}: AtualizarStatusItemAvaliacaoExpedicaoType) {
  const [empresaSelecionada] = useEmpresa()
  const queryClient = useQueryClient()

  const { mutateAsync: removerItemAvaliacao, isPending } = useMutation({
    mutationFn: removerItemAvaliativosExpedicao,
    onError: error => {
      toast.error(
        'Erro ao remover o item de avaliação do expedição, tente novamente!',
        {
          description: error.message,
        }
      )
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [
          'itensAvaliativoExpedicaoEmpresa',
          empresaSelecionada.selected,
        ],
        exact: true,
      })
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Remover item</AlertDialogTitle>
        <AlertDialogDescription>
          {'Deseja remover este item avaliativo?'}
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
            Removendo...
          </Button>
        ) : (
          <AlertDialogAction
            className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow"
            onClick={async () => {
              await removerItemAvaliacao({
                id,
              })
            }}
          >
            Remover
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

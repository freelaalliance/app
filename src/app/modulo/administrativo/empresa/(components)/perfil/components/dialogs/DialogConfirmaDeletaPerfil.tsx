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
import { useEmpresa } from '@/lib/CaseAtom'

import { excluirPerfil } from '../../../../api/Perfil'
import type { PerfilType } from '../../../../schemas/SchemaPerfil'

interface DialogDeletaPerfilProps {
  id: string
}

export function DialogConfirmaDeletaPerfil({ id }: DialogDeletaPerfilProps) {
  const queryClient = useQueryClient()
  const [empresaSelecionada] = useEmpresa()

  const { mutateAsync: excluirPerfilMutate, isPending } = useMutation({
    mutationFn: excluirPerfil,
    onMutate(idPerfil: string) {
      const { listaPerfis } = atualizarListaPerfis({ id: idPerfil })

      return { listaAntigaPerfis: listaPerfis }
    },
    onError(_, __, context) {
      if (context?.listaAntigaPerfis) {
        queryClient.setQueryData(
          ['listaPerfisEmpresa', empresaSelecionada.selected],
          context.listaAntigaPerfis
        )
      }

      toast.error('Houve um problema ao excluir perfil, tente novamente!')
    },
    onSuccess() {
      toast.success('Perfil excluído com sucesso!')
    },
  })

  function atualizarListaPerfis({ id }: DialogDeletaPerfilProps) {
    const listaPerfis: Array<PerfilType> | undefined = queryClient.getQueryData(
      ['listaPerfisEmpresa', empresaSelecionada.selected]
    )

    queryClient.setQueryData(
      ['listaPerfisEmpresa', empresaSelecionada.selected],
      listaPerfis?.filter(perfil => perfil.id !== id)
    )

    return { listaPerfis }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirma esta ação?</AlertDialogTitle>
        <AlertDialogDescription>
          {'Deseja realmente excluir este perfil?'}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-200 text-red-700 hover:bg-red-300 shadow border-0">
          Cancelar
        </AlertDialogCancel>
        {isPending ? (
          <Button
            className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow "
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Excluindo...
          </Button>
        ) : (
          <AlertDialogAction
            onClick={async () => {
              await excluirPerfilMutate(id)
            }}
            className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow "
          >
            Confirmar
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { type CategoriaDocumentoType, removerCategoriaDocumento } from '../../../_api/AdmDocumentos'

export function RemoverCategoriaDocumentoAlertDialog({
  id,
  nome,
  empresaId
}: Pick<CategoriaDocumentoType, 'id'|'empresaId'|'nome'>) {
  const queryClient = useQueryClient()

  const { mutateAsync: excluirCategoriaDocumento, isPending } =
    useMutation({
      mutationFn: removerCategoriaDocumento,
      onError: error => {
        toast.error(
          'Erro ao remover categoria, tente novamente!',
          {
            description: error.message,
          }
        )
      },
      onSuccess: (data) => {
        if(!data?.status) {
          toast.error(data?.msg)
          return
        }
        queryClient.refetchQueries({
          queryKey: [
            'categoriasDocumento',
            empresaId,
          ],
          exact: true,
        })
        toast.success(data.msg)
      },
    })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{`Remover ${nome}`}</AlertDialogTitle>
        <AlertDialogDescription>
          Deseja realmente remover essa categoria?
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
              await excluirCategoriaDocumento({id})
            }}
          >
            Remover
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

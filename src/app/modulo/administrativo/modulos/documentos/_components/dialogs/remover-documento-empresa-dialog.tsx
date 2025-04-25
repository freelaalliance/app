import { type DocumentoType, removerDocumento } from '@/app/modulo/documentos/_api/documentos'
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

interface RemoverDocumentoAlertDialogProps {
  documento: DocumentoType
}

export function RemoverDocumentoAlertDialog({ documento }: RemoverDocumentoAlertDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: excluirDocumento, isPending } = useMutation({
    mutationFn: removerDocumento,
    onError: error => {
      toast.error('Erro ao remover documento, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: data => {
      if (!data?.status) {
        toast.error(data?.msg)
        return
      }
      queryClient.refetchQueries({
        queryKey: ['documentosEmpresaAdmin', documento.empresaId],
        exact: true,
      })
      toast.success(data.msg)
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{`Remover o documento ${documento.nome}`}</AlertDialogTitle>
        <AlertDialogDescription>
          Deseja realmente remover esse documento?
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
              await excluirDocumento({
                id: documento.id,
                empresaId: documento.empresaId
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

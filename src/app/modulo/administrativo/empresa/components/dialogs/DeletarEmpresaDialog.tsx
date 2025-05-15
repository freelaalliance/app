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

import { excluirEmpresa } from '../../api/Empresa'
import type { empresaType } from '../../schemas/SchemaNovaEmpresa'

export function ExcluirEmpresa({empresaId}: { empresaId: string }) {
  const queryClient = useQueryClient()

  const { mutateAsync: excluirCliente, isPending } = useMutation({
    mutationFn: excluirEmpresa,
    onSuccess: data => {
      if (data.status) {
        const listaEmpresas: Array<empresaType> | undefined = queryClient.getQueryData([
          'empresas',
        ])

        queryClient.setQueryData(['empresas'], listaEmpresas?.filter(empresa => empresa.id !== empresaId))

        toast.success(data.msg)
      } else {
        toast.warning(data.msg)
      }
    },
    onError: error => {
      toast.error('Erro ao excluir a empresa', {
        description: error.message,
      })
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir essa empresa</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir este empresa?
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
            onClick={async () => {excluirCliente(empresaId)}}
          >
            Excluir empresa
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

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
  type ResponseAnexosFornecedorType,
  excluirAnexo,
} from '../../(api)/FornecedorApi'

interface ExcluirAnexoDialogProps {
  id: string
  idFornecedor: string
}
export function ExclusaoAnexoFornecedor({
  id,
  idFornecedor,
}: ExcluirAnexoDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: removerAnexo, isPending } = useMutation({
    mutationFn: excluirAnexo,
    onError: error => {
      toast.error('Erro ao excluir o anexo', {
        description: error.message,
      })
    },
    onSuccess: resp => {
      const anexosFornecedor: ResponseAnexosFornecedorType | undefined =
        queryClient.getQueryData(['anexosFornecedor', idFornecedor])

      queryClient.setQueryData(
        ['anexosFornecedor', idFornecedor],
        anexosFornecedor &&
        resp.status && {
          ...anexosFornecedor,
          dados: anexosFornecedor.dados?.filter(email => email.id !== id),
        }
      )

      toast.success('Anexo excluído com sucesso!')
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir anexo</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir este documento?
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
            onClick={async () => await removerAnexo({ id })}
          >
            Excluir
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

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
  excluirFornecedor,
  FornecedoresEmpresaType,
} from '../../(api)/FornecedorApi'

interface ExcluirFornecedorDialogProps {
  idFornecedor: string
}
export function ExclusaoFornecedor({
  idFornecedor,
}: ExcluirFornecedorDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: removerFornecedor, isPending } = useMutation({
    mutationFn: excluirFornecedor,
    onError: (error) => {
      toast.error('Erro ao excluir o fornecedor', {
        description: error.message,
      })
    },
    onSuccess: (data) => {
      if (data.status) {
        const dadosFornecedor: FornecedoresEmpresaType[] | undefined =
          queryClient.getQueryData(['fornecedoresEmpresa'])

        queryClient.setQueryData(
          ['fornecedoresEmpresa'],
          dadosFornecedor?.filter(
            (fornecedor) => fornecedor.id !== idFornecedor,
          ),
        )

        toast.success(data.msg)
      } else {
        toast.warning(data.msg)
      }
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir fornecedor</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir este fornecedor?
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
            onClick={async () => await removerFornecedor({ id: idFornecedor })}
          >
            Excluir
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

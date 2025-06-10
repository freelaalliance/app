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
  type ResponseFornecedorType,
  excluirEmail,
} from '../../(api)/FornecedorApi'

interface ExcluirEmailDialogProps {
  id: string
  idFornecedor: string
}
export function ExclusaoEmailFornecedor({
  id,
  idFornecedor,
}: ExcluirEmailDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: removerEmail, isPending } = useMutation({
    mutationFn: excluirEmail,
    onError: error => {
      toast.error('Erro ao excluir o email', {
        description: error.message,
      })
    },
    onSuccess: resp => {
      const dadosFornecedor: ResponseFornecedorType | undefined =
        queryClient.getQueryData(['dadosFornecedor', idFornecedor])

      queryClient.setQueryData(
        ['dadosFornecedor', idFornecedor],
        dadosFornecedor &&
          resp.status && {
            ...dadosFornecedor,
            dados: {
              ...dadosFornecedor?.dados,
              emails: dadosFornecedor.dados?.emails.filter(
                email => email.id !== id
              ),
            },
          }
      )

      toast.success('Email excluído com sucesso!')
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir email</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir este email?
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
            onClick={async () => await removerEmail({ id })}
          >
            Excluir
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

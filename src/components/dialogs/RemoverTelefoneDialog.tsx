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
import { excluirTelefonePessoa } from './api/TelefoneApi'
import { useParams } from 'next/navigation'

export interface ExcluirTelefonePessoaDialogProps {
  id: string
}
export function ExcluirTelefonePessoaDialog({
  id
}: ExcluirTelefonePessoaDialogProps) {

  const { idCliente } = useParams<{ idCliente: string }>()
  const queryClient = useQueryClient()

  function atualizaDadosCliente() {
    queryClient.refetchQueries({
      queryKey: ['pessoa-cliente', idCliente],
      type: 'active',
    })
  }

  const { mutateAsync: removerTelefone, isPending } = useMutation({
    mutationFn: excluirTelefonePessoa,
    onError: error => {
      toast.error('Erro ao excluir o telefone', {
        description: error.message,
      })
    },
    onSuccess: () => {
      toast.success('Telefone excluído com sucesso!')

      atualizaDadosCliente()
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir telefone</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir este telefone?
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
            onClick={async () => await removerTelefone({ id })}
          >
            Excluir
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

'use client'

import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { axiosInstance } from '@/lib/AxiosLib'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ExcluirProdutoServicoDialogProps {
  id: string
  nome: string
}

export function ExcluirProdutoServicoDialog({ id, nome }: ExcluirProdutoServicoDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(`/produtos-servicos/${id}`)
      return data
    },
    onSuccess: () => {
      toast.success('Produto/Serviço excluído com sucesso!')
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      queryClient.setQueryData(['produtos-servicos'], (old: any) => {
        if (!old) return []

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        return old.filter((item: any) => item.id !== id)
      })

      queryClient.invalidateQueries({ queryKey: ['produtos-servicos'] })
    },
    onError: () => {
      toast.error('Erro ao excluir o Produto/Serviço.')
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
        <AlertDialogDescription>
          Essa ação irá remover permanentemente o produto/serviço <strong>{nome}</strong> do sistema.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-200 text-red-700 hover:bg-red-300 shadow border-0">
          Cancelar
        </AlertDialogCancel>
        {mutation.isPending ? (
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
            onClick={() => mutation.mutate()}
          >
            Excluir
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

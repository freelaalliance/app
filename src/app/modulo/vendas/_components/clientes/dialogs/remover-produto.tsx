'use client'

import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { axiosInstance } from '@/lib/AxiosLib'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ExcluirClienteDialogProps {
  id: string
  nome: string
}

export function ExcluirClienteDialog({ id, nome }: ExcluirClienteDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(`/vendas/clientes/${id}`)
      return data
    },
    onSuccess: () => {
      toast.success('Cliente excluído com sucesso!')
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      queryClient.setQueryData(['clientes'], (old: any) => {
        if (!old) return []

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        return old.filter((item: any) => item.id !== id)
      })

      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
    onError: () => {
      toast.error('Erro ao excluir o cliente')
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
        <AlertDialogDescription>
          Essa ação irá remover permanentemente o cliente <strong>{nome}</strong> do sistema.
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

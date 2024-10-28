import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { PedidosFornecedorType } from '@/app/modulo/compras/(schemas)/compras/schema-compras'
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

import { AlteraPedidoProps, excluirPedido } from '../../(api)/ComprasApi'

export function ExcluirPedido({ idPedido, idFornecedor }: AlteraPedidoProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: excluirPedidoFornecedor, isPending } = useMutation({
    mutationFn: excluirPedido,
    onSuccess: (data) => {
      if (data.status) {
        const listaPedidosFornecedor:
          | {
              status: boolean
              msg: string
              dados: Array<PedidosFornecedorType>
              error?: unknown
            }
          | undefined = queryClient.getQueryData([
          'pedidosFornecedor',
          idFornecedor,
        ])

        queryClient.setQueryData(
          ['pedidosFornecedor', idFornecedor],
          listaPedidosFornecedor &&
            data.dados && {
              ...listaPedidosFornecedor,
              dados: listaPedidosFornecedor.dados.filter(
                (pedido) => pedido.id !== data.dados?.id,
              ),
            },
        )

        toast.success(data.msg)
      } else {
        toast.warning(data.msg)
      }
    },
    onError: (error) => {
      toast.error('Erro ao excluir o pedido', {
        description: error.message,
      })
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir pedido</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir este pedido?
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
            onClick={async () => {
              await excluirPedidoFornecedor({
                idPedido,
                idFornecedor,
              })
            }}
          >
            Excluir pedido
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

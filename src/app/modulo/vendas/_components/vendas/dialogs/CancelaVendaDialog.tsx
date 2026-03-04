import { Loader2 } from 'lucide-react'

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
import { useCancelarVenda } from '../../../_servicos/useVendas'

export function CancelarVenda({ idVenda }: { idVenda: string }) {

  const { mutateAsync: cancelarVenda, isPending } = useCancelarVenda(idVenda)

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Cancelamento de venda</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja cancelar esta venda?
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
            Cancelando...
          </Button>
        ) : (
          <AlertDialogAction
            className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow"
            onClick={async () => {
              await cancelarVenda()
            }}
          >
            Cancelar venda
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

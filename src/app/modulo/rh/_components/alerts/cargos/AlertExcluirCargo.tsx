'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { useDeletarCargo } from '../../../_hooks/cargos/useCargos'
import type { Cargo } from '../../../_types/cargos/CargoType'

interface AlertExcluirCargoProps {
  cargo: Cargo
  children: React.ReactNode
}

export function AlertExcluirCargo({
  cargo,
  children,
}: AlertExcluirCargoProps) {
  const [open, setOpen] = useState(false)
  const { mutate: excluirCargo, isPending } = useDeletarCargo()

  const handleExcluir = () => {
    excluirCargo(cargo.id, {
      onSuccess: () => {
        toast.success(`Cargo "${cargo.nome}" excluído com sucesso!`)
        setOpen(false)
      },
      onError: (error) => {
        console.error('Erro ao excluir cargo:', error)
        toast.error('Erro ao excluir cargo. Tente novamente.')
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir o cargo{' '}
              <strong className="text-red-600">{cargo.nome}</strong>?
            </p>
            <p className="text-sm text-amber-600 font-medium">
              ⚠️ Esta ação não pode ser desfeita!
            </p>
            <div className="text-sm text-gray-600 mt-3">
              <p className="font-medium mb-1">Ao excluir este cargo:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Todos os treinamentos associados serão desvinculados</li>
                <li>Funcionários com este cargo ficarão sem cargo definido</li>
                <li>Históricos e relatórios que referenciam este cargo podem ser afetados</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            className="shadow-md text-sm uppercase leading-none bg-gray-500 rounded text-white hover:bg-gray-600"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExcluir}
            disabled={isPending}
            className="shadow-md text-sm uppercase leading-none bg-red-600 rounded text-white hover:bg-red-700"
          >
            {isPending ? 'Excluindo...' : 'Excluir Cargo'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

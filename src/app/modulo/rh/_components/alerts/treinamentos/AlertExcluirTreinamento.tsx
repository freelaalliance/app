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
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useDeletarTreinamento } from '../../../_hooks/treinamentos/useTreinamentos'
import type { TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'

interface AlertExcluirTreinamentoProps {
  treinamento: TreinamentosType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlertExcluirTreinamento({
  treinamento,
  open,
  onOpenChange,
}: AlertExcluirTreinamentoProps) {
  const { mutate: deletarTreinamento, isPending } = useDeletarTreinamento()

  const confirmarExclusao = () => {
    deletarTreinamento(treinamento.id, {
      onSuccess: () => {
        toast.success('Treinamento excluído com sucesso!')
        onOpenChange(false)
      },
      onError: (error) => {
        console.error('Erro ao excluir treinamento:', error)
        toast.error('Erro ao excluir treinamento. Tente novamente.')
      },
    })
  }

  const cancelarExclusao = () => {
    onOpenChange(false)
  }

  const temPlanos = treinamento.planos && treinamento.planos.length > 0
  const quantidadePlanos = treinamento.planos?.length || 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Informações do Treinamento */}
          <div className="p-4 bg-red-50 rounded-md border border-red-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <p className="text-sm font-medium text-red-900">
                  {treinamento.nome}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-red-700">
                <span>Tipo:</span>
                <Badge variant="secondary" className="text-xs">
                  {treinamento.tipo === 'integracao' ? 'Integração' : 'Capacitação'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Aviso sobre Planos */}
          {temPlanos && (
            <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Atenção: Este treinamento possui planos associados
                  </p>
                  <p className="text-xs text-yellow-700">
                    {quantidadePlanos} plano{quantidadePlanos !== 1 ? 's' : ''} será
                    {quantidadePlanos !== 1 ? 'ão' : ''} excluído{quantidadePlanos !== 1 ? 's' : ''} junto com o treinamento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmação */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Tem certeza que deseja excluir este treinamento?
            </p>
            {temPlanos && (
              <p className="text-xs text-gray-500">
                Todos os planos associados também serão excluídos permanentemente.
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={cancelarExclusao}
            disabled={isPending}
            className="shadow-md text-sm uppercase leading-none"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmarExclusao}
            disabled={isPending}
            className="shadow-md text-sm uppercase leading-none bg-red-600 hover:bg-red-700"
          >
            {isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

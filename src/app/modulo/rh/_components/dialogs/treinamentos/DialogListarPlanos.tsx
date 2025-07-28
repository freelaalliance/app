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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  useDeletarPlanoTreinamento,
  usePlanosTreinamento
} from '../../../_hooks/treinamentos/useTreinamentos'
import type { PlanosTreinamentoType, TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'

interface DialogListarPlanosProps {
  treinamento: TreinamentosType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DialogListarPlanos({
  treinamento,
  open,
  onOpenChange,
}: DialogListarPlanosProps) {
  const [planoParaExcluir, setPlanoParaExcluir] = useState<PlanosTreinamentoType | null>(null)
  
  const { 
    data: planos = [], 
    isLoading: carregandoPlanos,
    isError: erroCarregamento 
  } = usePlanosTreinamento(treinamento.id)
  
  const { mutate: deletarPlano, isPending: excluindoPlano } = useDeletarPlanoTreinamento()

  const handleExcluirPlano = (plano: PlanosTreinamentoType) => {
    setPlanoParaExcluir(plano)
  }

  const confirmarExclusao = () => {
    if (!planoParaExcluir) return

    deletarPlano(Number(planoParaExcluir.id), {
      onSuccess: () => {
        toast.success('Plano removido com sucesso!')
        setPlanoParaExcluir(null)
      },
      onError: (error) => {
        console.error('Erro ao excluir plano:', error)
        toast.error('Erro ao remover plano. Tente novamente.')
        setPlanoParaExcluir(null)
      },
    })
  }

  const cancelarExclusao = () => {
    setPlanoParaExcluir(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Planos de Treinamento</DialogTitle>
            <DialogDescription>
              Gerencie os planos do treinamento "{treinamento.nome}".
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {/* Informações do Treinamento */}
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {treinamento.nome}
                    </p>
                    <p className="text-xs text-blue-700 capitalize">
                      Tipo: {treinamento.tipo === 'integracao' ? 'Integração' : 'Capacitação'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de Planos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    Planos ({carregandoPlanos ? '...' : planos.length})
                  </h3>
                  {planos.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {planos.length} plano{planos.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {carregandoPlanos ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loading
                      <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ))}
                  </div>
                ) : erroCarregamento ? (
                  <div className="flex items-center justify-center p-8 text-center">
                    <div className="space-y-2">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
                      <p className="text-sm text-gray-600">
                        Erro ao carregar planos
                      </p>
                      <p className="text-xs text-gray-500">
                        Tente fechar e abrir novamente
                      </p>
                    </div>
                  </div>
                ) : planos.length === 0 ? (
                  <div className="flex items-center justify-center p-8 text-center">
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-gray-400 text-xl">📋</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        Nenhum plano cadastrado
                      </p>
                      <p className="text-xs text-gray-500">
                        Use "Adicionar Plano" para criar o primeiro plano
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {planos.map((plano, index) => (
                      <div
                        key={plano.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-medium min-w-[20px]">
                            {index + 1}.
                          </span>
                          <span className="text-sm text-gray-700">
                            {plano.nome}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExcluirPlano(plano)}
                          disabled={excluindoPlano}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
              >
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog 
        open={!!planoParaExcluir}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o plano "{planoParaExcluir?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={cancelarExclusao}
              disabled={excluindoPlano}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              disabled={excluindoPlano}
              className="bg-red-600 hover:bg-red-700"
            >
              {excluindoPlano ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

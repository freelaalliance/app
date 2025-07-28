'use client'

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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Plus, Trash2, Users, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRemoverTreinamentoCargo, useTreinamentosCargo } from '../../../_hooks/cargos/useCargos'
import type { Cargo } from '../../../_types/cargos/CargoType'
import { FormularioAdicionarTreinamentoCargo } from '../../forms/cargos/FormularioAdicionarTreinamentoCargo'

interface DialogListarTreinamentosCargoProps {
  cargo: Cargo
  children: React.ReactNode
}

export function DialogListarTreinamentosCargo({
  cargo,
  children,
}: DialogListarTreinamentosCargoProps) {
  const [open, setOpen] = useState(false)
  const { data: treinamentos = [], isLoading, error } = useTreinamentosCargo(cargo.id)
  const { mutate: removerTreinamento, isPending: removendoTreinamento } = useRemoverTreinamentoCargo()

  const handleRemoverTreinamento = (treinamentoId: string, nometreinamento: string) => {
    removerTreinamento(
      { cargoId: cargo.id, treinamentoId },
      {
        onSuccess: () => {
          toast.success(`Treinamento "${nometreinamento}" removido do cargo com sucesso!`)
        },
        onError: (error) => {
          console.error('Erro ao remover treinamento:', error)
          toast.error('Erro ao remover treinamento. Tente novamente.')
        },
      }
    )
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (error) {
    console.error('Erro ao carregar treinamentos do cargo:', error)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Treinamentos do Cargo</DialogTitle>
          <DialogDescription>
            Treinamentos associados ao cargo: <strong>{cargo.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Lista de Treinamentos</h3>
                <Badge variant="outline" className="text-xs">
                  {treinamentos.length} {treinamentos.length === 1 ? 'treinamento' : 'treinamentos'}
                </Badge>
              </div>

              <FormularioAdicionarTreinamentoCargo cargo={cargo}>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Treinamento
                </Button>
              </FormularioAdicionarTreinamentoCargo>
            </div>

            <Separator />

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Carregando treinamentos...</div>
              </div>
            ) : treinamentos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Nenhum treinamento encontrado</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Este cargo ainda não possui treinamentos associados.
                </p>
                <FormularioAdicionarTreinamentoCargo cargo={cargo}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Treinamento
                  </Button>
                </FormularioAdicionarTreinamentoCargo>
              </div>
            ) : (
              <div className="space-y-3">
                {treinamentos.map((treinamento) => (
                  <div
                    key={treinamento.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {treinamento.nome}
                          </h4>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            Integração
                          </Badge>
                        </div>

                        {treinamento.nome && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {treinamento.nome}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={removendoTreinamento}
                        onClick={() => handleRemoverTreinamento(treinamento.id, treinamento.nome)}
                        className="bg-white text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <DialogClose asChild>
            <Button
              onClick={handleClose}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

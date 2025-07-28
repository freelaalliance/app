'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  BriefcaseIcon,
  Calendar,
  Clock,
  Crown,
  FileText,
  GraduationCap,
  User,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTreinamentosCargo } from '../../../_hooks/cargos/useCargos'
import type { Cargo } from '../../../_types/cargos/CargoType'

interface DialogVisualizarCargoProps {
  cargo: Cargo
  children: React.ReactNode
}

export function DialogVisualizarCargo({
  cargo,
  children,
}: DialogVisualizarCargoProps) {
  const [open, setOpen] = useState(false)
  const { data: treinamentos = [], isLoading: carregandoTreinamentos } = useTreinamentosCargo(cargo.id)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            Informações do Cargo
          </DialogTitle>
          <DialogDescription>
            Visualize todos os detalhes do cargo: <strong>{cargo.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BriefcaseIcon className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Nome do Cargo</div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-900 font-medium">{cargo.nome}</p>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700">Exige ensino superior</div>
                    <p className="text-sm text-gray-900 mt-1">
                      {cargo.superior ? 'Sim' : 'Não'}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Atribuições</div>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {cargo.atribuicoes || 'Não informado'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5" />
                  Requisitos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Experiência Mínima</div>
                    <p className="text-sm text-gray-900 mt-1">
                      {cargo.experienciaMinima || 'Não especificado'}
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700">Escolaridade Mínima</div>
                    <p className="text-sm text-gray-900 mt-1">
                      {cargo.escolaridadeMinima || 'Não especificado'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treinamentos de Integração */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Treinamentos de Integração
                  <Badge variant="outline" className="text-xs">
                    {treinamentos.length} {treinamentos.length === 1 ? 'treinamento' : 'treinamentos'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Treinamentos obrigatórios para este cargo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {carregandoTreinamentos ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="text-sm text-gray-500">Carregando treinamentos...</div>
                  </div>
                ) : treinamentos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-3">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Nenhum treinamento associado a este cargo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {treinamentos.map((treinamento) => (
                      <div
                        key={treinamento.id}
                        className="border rounded-lg p-3 bg-blue-50 border-blue-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm text-blue-900">
                                {treinamento.nome}
                              </h4>
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                Integração
                              </Badge>
                            </div>

                            {treinamento.nome && (
                              <p className="text-xs text-blue-700 line-clamp-2">
                                {`${treinamento.tipo} - ${treinamento.nome}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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

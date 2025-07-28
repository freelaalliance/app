'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { BookOpen, CheckCircle2, Clock, X } from 'lucide-react'
import { usePlanosTreinamento } from '../../../_hooks/treinamentos/useTreinamentos'
import type { TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'

interface DialogPlanosTreinamentoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  treinamento: TreinamentosType | null
}

export function DialogPlanosTreinamento({
  open,
  onOpenChange,
  treinamento,
}: DialogPlanosTreinamentoProps) {
  const { data: planos, isFetching } = usePlanosTreinamento(treinamento?.id || '')

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Planos do Treinamento
          </DialogTitle>
          <DialogDescription>
            Visualize todos os planos relacionados ao treinamento{' '}
            <strong>{treinamento?.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Treinamento */}
          <Card className="bg-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{treinamento?.nome}</span>
                <Badge 
                  variant="outline" 
                  className={
                    treinamento?.tipo === 'integracao' 
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-purple-100 text-purple-800 border-purple-200'
                  }
                >
                  {treinamento?.tipo === 'integracao' ? 'Integração' : 'Capacitação'}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Lista de Planos */}
          {isFetching ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map(() => (
                <div key={`plano-skeleton-${Math.random()}`} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : planos && planos.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">
                Planos do Treinamento ({planos.length})
              </h4>
              {planos.map((plano, index) => (
                <Card key={`plano-${plano.id}-${index}`} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm mb-1">{plano.nome}</h5>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Plano #{index + 1}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>ID: {plano.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="text-center p-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="font-medium mb-2">Nenhum plano cadastrado</h3>
                <p className="text-sm text-muted-foreground">
                  Este treinamento ainda não possui planos configurados.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Botão de Fechar */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

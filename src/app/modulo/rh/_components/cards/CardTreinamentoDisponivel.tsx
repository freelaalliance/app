'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, GraduationCap, Play } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useIniciarTreinamento } from '../../_hooks/colaborador/useTreinamentosColaborador'
import type { TreinamentosType } from '../../_types/treinamentos/TreinamentoType'
import { DialogPlanosTreinamento } from '../dialogs/treinamentos/DialogPlanosTreinamento'

interface CardTreinamentoDisponivelProps {
  treinamento: TreinamentosType
  contratacaoId: string
}

export function CardTreinamentoDisponivel({ 
  treinamento, 
  contratacaoId 
}: CardTreinamentoDisponivelProps) {
  const iniciarTreinamento = useIniciarTreinamento()
  const [planosDialogOpen, setPlanosDialogOpen] = useState(false)

  const handleIniciarTreinamento = () => {
    iniciarTreinamento.mutate(
      {
        treinamentosId: treinamento.id,
        contratacaoColaboradorId: contratacaoId,
        iniciadoEm: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          toast.success('Treinamento iniciado com sucesso!')
        },
        onError: (error) => {
          console.error('Erro ao iniciar treinamento:', error)
          toast.error('Erro ao iniciar treinamento. Tente novamente.')
        },
      }
    )
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'integracao':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'capacitacao':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'integracao':
        return 'Integração'
      case 'capacitacao':
        return 'Capacitação'
      default:
        return 'Outro'
    }
  }

  return (
    <Card className="h-full border-dashed border-2 hover:border-solid hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium line-clamp-1">
            {treinamento.nome}
          </CardTitle>
          <Badge className={getTipoColor(treinamento.tipo)}>
            {getTipoLabel(treinamento.tipo)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
          <span>Disponível para iniciar</span>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleIniciarTreinamento}
            disabled={iniciarTreinamento.isPending}
            className="w-full"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            {iniciarTreinamento.isPending ? 'Iniciando...' : 'Iniciar Treinamento'}
          </Button>

          <Button 
            variant="outline"
            onClick={() => setPlanosDialogOpen(true)}
            className="w-full"
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Ver Planos
          </Button>
        </div>
      </CardContent>

      <DialogPlanosTreinamento
        open={planosDialogOpen}
        onOpenChange={setPlanosDialogOpen}
        treinamento={treinamento}
      />
    </Card>
  )
}

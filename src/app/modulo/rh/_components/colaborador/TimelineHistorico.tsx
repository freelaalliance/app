'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, User } from 'lucide-react'
import type { HistoricoContratacao } from '../../_types/colaborador/ContratacaoType'

interface TimelineHistoricoProps {
  historico: HistoricoContratacao[]
  isLoading?: boolean
}

export function TimelineHistorico({ historico, isLoading }: TimelineHistoricoProps) {
  if (isLoading) {
    const skeletonItems = Array.from({ length: 3 }, () => crypto.randomUUID())
    
    return (
      <div className="space-y-4">
        {skeletonItems.map((id, i) => (
          <div key={id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              {i < 2 && <Skeleton className="w-0.5 h-16 mt-2" />}
            </div>
            <Card className="flex-1">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  if (!historico || historico.length === 0) {
    return (
      <div className="text-center p-8">
        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground">Nenhum histórico encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {historico.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            {index < historico.length - 1 && (
              <div className="w-0.5 h-16 bg-border mt-2" />
            )}
          </div>
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{item.descricao}</h4>
                <div className="text-right">
                  <time className="text-xs text-muted-foreground block">
                    {format(new Date(item.data), 'dd/MM/yyyy HH:mm', {
                      locale: ptBR,
                    })}
                  </time>
                  <span className="text-xs text-muted-foreground/70">
                    {formatDistanceToNow(new Date(item.data), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

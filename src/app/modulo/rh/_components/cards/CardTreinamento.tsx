'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Calendar, CheckCircle, Clock, FileCheck, Flag, XCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { downloadFile } from '../../../documentos/[id]/novo/_actions/upload-actions'
import type { TreinamentoRealizado } from '../../_types/colaborador/ContratacaoType'
import { DialogFinalizarTreinamento } from '../dialogs/colaborador/DialogFinalizarTreinamento'
import { DialogPlanosTreinamento } from '../dialogs/treinamentos/DialogPlanosTreinamento'

interface CardTreinamentoProps {
  treinamento: TreinamentoRealizado
}

export function CardTreinamento({ treinamento }: CardTreinamentoProps) {
  const [finalizarDialogOpen, setFinalizarDialogOpen] = useState(false)
  const [planosDialogOpen, setPlanosDialogOpen] = useState(false)
  
  const isCompleto = !!treinamento.finalizadoEm
  const isPendente = !treinamento.finalizadoEm && !!treinamento.iniciadoEm
  const diasPendentes = treinamento.diasPendente || 0

  const handleDownloadCertificado = async () => {
    if (!treinamento.certificado) return
    
    try {
      const result = await downloadFile(treinamento.certificado)
      
      if (!result.success) {
        toast.error(result.message || 'Erro ao baixar arquivo')
        return
      }

      // Abre o arquivo em uma nova aba para visualização (bom para PDFs)
      window.open(result.url, '_blank')

      toast.success('Download iniciado!')
    } catch (error) {
      console.error('Erro no download do certificado:', error)
      toast.error('Erro ao baixar certificado. Tente novamente.')
    }
  }

  const getStatusColor = () => {
    if (isCompleto) return 'bg-green-100 text-green-800 border-green-200'
    if (isPendente && diasPendentes > 0) return 'bg-red-100 text-red-800 border-red-200'
    if (isPendente) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = () => {
    if (isCompleto) return <CheckCircle className="h-4 w-4" />
    if (isPendente && diasPendentes > 0) return <XCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (isCompleto) return 'Concluído'
    if (isPendente && diasPendentes > 0) return `Atrasado (${diasPendentes} dias)`
    if (isPendente) return 'Em andamento'
    return 'Não iniciado'
  }

  const getTipoColor = () => {
    return treinamento.treinamento.tipo === 'integracao' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200'
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{treinamento.treinamento.nome}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getTipoColor()}>
                {treinamento.treinamento.tipo === 'integracao' ? 'Integração' : 'Capacitação'}
              </Badge>
              <Badge variant="outline" className={getStatusColor()}>
                <span className="flex items-center gap-1">
                  {getStatusIcon()}
                  {getStatusText()}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {treinamento.iniciadoEm && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Iniciado em:</span>
                <p className="font-medium">{new Date(treinamento.iniciadoEm).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          )}

          {treinamento.finalizadoEm && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <span className="text-muted-foreground">Finalizado em:</span>
                <p className="font-medium">{new Date(treinamento.finalizadoEm).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          )}

          {treinamento.duracaoDias && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Duração:</span>
                <p className="font-medium">{treinamento.duracaoDias} dia{treinamento.duracaoDias > 1 ? 's' : ''}</p>
              </div>
            </div>
          )}
        </div>

        {/* Ações do Treinamento */}
        <div className="space-y-2">
          {/* Botão Ver Planos - sempre visível */}
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setPlanosDialogOpen(true)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Ver Planos do Treinamento
            </Button>
          </div>

          {/* Botão Finalizar - apenas para treinamentos pendentes */}
          {isPendente && !isCompleto && (
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                onClick={() => setFinalizarDialogOpen(true)}
              >
                <Flag className="h-4 w-4 mr-2" />
                Finalizar Treinamento
              </Button>
            </div>
          )}

          {/* Botão Ver Certificado - apenas para treinamentos completos com certificado */}
          {treinamento.certificado && isCompleto && (
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleDownloadCertificado}
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Ver Certificado
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <DialogFinalizarTreinamento
        open={finalizarDialogOpen}
        onOpenChange={setFinalizarDialogOpen}
        treinamento={treinamento}
      />

      <DialogPlanosTreinamento
        open={planosDialogOpen}
        onOpenChange={setPlanosDialogOpen}
        treinamento={treinamento.treinamento}
      />
    </Card>
  )
}

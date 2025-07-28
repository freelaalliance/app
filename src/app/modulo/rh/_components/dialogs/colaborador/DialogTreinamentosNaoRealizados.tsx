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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, GraduationCap, Play, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
    useIniciarTreinamento,
    useTreinamentosNaoRealizados,
} from '../../../_hooks/colaborador/useTreinamentosColaborador'

interface DialogTreinamentosNaoRealizadosProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contratacaoId: string
  nomeColaborador: string
}

export function DialogTreinamentosNaoRealizados({
  open,
  onOpenChange,
  contratacaoId,
  nomeColaborador,
}: DialogTreinamentosNaoRealizadosProps) {
  const [tabAtiva, setTabAtiva] = useState<'integracao' | 'capacitacao'>('integracao')
  
  const { data: treinamentosIntegracao, isFetching: isFetchingIntegracao } =
    useTreinamentosNaoRealizados(contratacaoId, 'integracao')
  
  const { data: treinamentosCapacitacao, isFetching: isFetchingCapacitacao } =
    useTreinamentosNaoRealizados(contratacaoId, 'capacitacao')
  
  const iniciarTreinamento = useIniciarTreinamento()

  const handleIniciarTreinamento = (treinamentoId: string, nomeTrainamento: string) => {
    iniciarTreinamento.mutate(
      {
        treinamentosId: treinamentoId,
        contratacaoColaboradorId: contratacaoId,
        iniciadoEm: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          toast.success(`Treinamento "${nomeTrainamento}" iniciado com sucesso!`)
        },
        onError: (error) => {
          console.error('Erro ao iniciar treinamento:', error)
          toast.error('Erro ao iniciar treinamento. Tente novamente.')
        },
      }
    )
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const TreinamentoCard = ({ 
    treinamento 
  }: { 
    treinamento: { id: string; nome: string; tipo: string } 
  }) => (
    <Card className="border-dashed border-2 hover:border-solid hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium line-clamp-2">
            {treinamento.nome}
          </CardTitle>
          <Badge 
            variant="outline"
            className={
              treinamento.tipo === 'integracao'
                ? 'bg-blue-100 text-blue-800 border-blue-200'
                : 'bg-purple-100 text-purple-800 border-purple-200'
            }
          >
            {treinamento.tipo === 'integracao' ? 'Integração' : 'Capacitação'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
          <span>Disponível para iniciar</span>
        </div>

        <Button 
          onClick={() => handleIniciarTreinamento(treinamento.id, treinamento.nome)}
          disabled={iniciarTreinamento.isPending}
          className="w-full"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          {iniciarTreinamento.isPending ? 'Iniciando...' : 'Iniciar Treinamento'}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Treinamentos Disponíveis
          </DialogTitle>
          <DialogDescription>
            Treinamentos ainda não realizados por{' '}
            <strong>{nomeColaborador}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tabAtiva} onValueChange={(value) => setTabAtiva(value as 'integracao' | 'capacitacao')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="integracao" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Integração
              {treinamentosIntegracao && treinamentosIntegracao.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {treinamentosIntegracao.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="capacitacao" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Capacitação
              {treinamentosCapacitacao && treinamentosCapacitacao.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {treinamentosCapacitacao.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integracao" className="space-y-4">
            {isFetchingIntegracao ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`skeleton-integracao-${Date.now()}-${index}`} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : treinamentosIntegracao && treinamentosIntegracao.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treinamentosIntegracao.map((treinamento) => (
                  <TreinamentoCard key={treinamento.id} treinamento={treinamento} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="text-center p-8">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Nenhum treinamento de integração disponível</h3>
                  <p className="text-sm text-muted-foreground">
                    Todos os treinamentos de integração obrigatórios foram realizados ou estão em andamento.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="capacitacao" className="space-y-4">
            {isFetchingCapacitacao ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`skeleton-capacitacao-${Date.now()}-${index}`} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : treinamentosCapacitacao && treinamentosCapacitacao.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {treinamentosCapacitacao.map((treinamento) => (
                  <TreinamentoCard key={treinamento.id} treinamento={treinamento} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="text-center p-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Nenhum treinamento de capacitação disponível</h3>
                  <p className="text-sm text-muted-foreground">
                    Todos os treinamentos de capacitação foram realizados ou estão em andamento.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Botão de Fechar */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

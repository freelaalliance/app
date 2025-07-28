'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building,
  GraduationCap,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus
} from 'lucide-react'
import { useState } from 'react'
import { StatCard } from '../../_components/analytics/StatCard'
import { TabelaColaboradores } from '../../_components/analytics/TabelaColaboradores'
import {
  useAnalyticsColaboradores,
  useAnalyticsColaboradoresPorCargo,
  useAnalyticsRotatividade,
  useAnalyticsTreinamentos,
  useColaboradoresAtivos,
  useColaboradoresDemitidos,
  useColaboradoresEmTreinamento,
} from '../../_hooks/analytics/useAnalyticsRh'

export default function PainelRhPage() {
  const [periodoRotatividade, setPeriodoRotatividade] = useState<'mes' | 'trimestre' | 'semestre' | 'anual'>('mes')

  // Analytics hooks
  const { data: analyticsColaboradores, isFetching: isFetchingColaboradores } = useAnalyticsColaboradores()
  const { data: analyticsRotatividade, isFetching: isFetchingRotatividade } = useAnalyticsRotatividade(periodoRotatividade)
  const { data: analyticsTreinamentos, isFetching: isFetchingTreinamentos } = useAnalyticsTreinamentos()
  const { data: analyticsCargos, isFetching: isFetchingCargos } = useAnalyticsColaboradoresPorCargo()

  // Listagens hooks
  const { data: colaboradoresAtivos, isFetching: isFetchingAtivos } = useColaboradoresAtivos()
  const { data: colaboradoresDemitidos, isFetching: isFetchingDemitidos } = useColaboradoresDemitidos()
  const { data: colaboradoresEmTreinamento, isFetching: isFetchingColaboradoresEmTreinamento } = useColaboradoresEmTreinamento()

  const getPeriodoLabel = (periodo: string) => {
    const labels = {
      mes: 'Mês atual',
      trimestre: 'Trimestre atual',
      semestre: 'Semestre atual',
      anual: 'Ano atual'
    }
    return labels[periodo as keyof typeof labels] || 'Período'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel RH</h1>
          <p className="text-muted-foreground">
            Visão geral das métricas e indicadores de recursos humanos
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Colaboradores Ativos"
          value={isFetchingColaboradores ? '-' : analyticsColaboradores?.colaboradoresAtivos || 0}
          icon={UserCheck}
          description="Colaboradores com contrato ativo"
          className="border-green-200"
        />
        
        <StatCard
          title="Colaboradores Inativos"
          value={isFetchingColaboradores ? '-' : analyticsColaboradores?.colaboradoresInativos || 0}
          icon={UserMinus}
          description="Colaboradores demitidos"
          className="border-red-200"
        />
        
        <StatCard
          title="Contratações este Mês"
          value={isFetchingColaboradores ? '-' : analyticsColaboradores?.colaboradoresContratacosMesAtual || 0}
          icon={UserPlus}
          description="Novos colaboradores contratados"
          trend={
            analyticsColaboradores ? {
              value: Math.round(analyticsColaboradores.percentualVariacao),
              type: analyticsColaboradores.percentualVariacao > 0 ? 'up' : 
                    analyticsColaboradores.percentualVariacao < 0 ? 'down' : 'neutral',
              description: 'vs mês anterior'
            } : undefined
          }
          className="border-blue-200"
        />
        
        <StatCard
          title="Índice de Rotatividade"
          value={isFetchingRotatividade ? '-' : `${Math.round(analyticsRotatividade?.indiceRotatividade || 0)}%`}
          icon={TrendingUp}
          description={getPeriodoLabel(periodoRotatividade)}
          className="border-orange-200"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Rotatividade Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Análise de Rotatividade
              </CardTitle>
              <Select 
                value={periodoRotatividade} 
                onValueChange={(value: 'mes' | 'trimestre' | 'semestre' | 'anual') => setPeriodoRotatividade(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Mês</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="semestre">Semestre</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isFetchingRotatividade ? (
              <div className="space-y-3">
                <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4" />
                <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2" />
                <div className="animate-pulse h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-700">
                      {analyticsRotatividade?.admissoes || 0}
                    </div>
                    <div className="text-sm text-green-600">Admissões</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-700">
                      {analyticsRotatividade?.demissoes || 0}
                    </div>
                    <div className="text-sm text-red-600">Demissões</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-lg font-semibold text-blue-700">
                    Índice: {Math.round(analyticsRotatividade?.indiceRotatividade || 0)}%
                  </div>
                  <div className="text-xs text-blue-600">
                    Total de colaboradores: {analyticsRotatividade?.totalColaboradores || 0}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Treinamentos Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Treinamentos em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analytics">Estatísticas</TabsTrigger>
                <TabsTrigger value="colaboradores" className="flex items-center gap-2">
                  Colaboradores
                  {colaboradoresEmTreinamento && colaboradoresEmTreinamento.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {colaboradoresEmTreinamento.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="mt-4">
                {isFetchingTreinamentos ? (
                  <div className="space-y-3">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4" />
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2" />
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <div className="font-medium text-blue-900">Integração</div>
                          <div className="text-sm text-blue-600">
                            {analyticsTreinamentos?.treinamentosIntegracao.emAndamento || 0} em andamento, 
                            {' '}{analyticsTreinamentos?.treinamentosIntegracao.finalizados || 0} finalizados
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          {analyticsTreinamentos?.treinamentosIntegracao.total || 0}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div>
                          <div className="font-medium text-purple-900">Capacitação</div>
                          <div className="text-sm text-purple-600">
                            {analyticsTreinamentos?.treinamentosCapacitacao.emAndamento || 0} em andamento, 
                            {' '}{analyticsTreinamentos?.treinamentosCapacitacao.finalizados || 0} finalizados
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                          {analyticsTreinamentos?.treinamentosCapacitacao.total || 0}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="colaboradores" className="mt-4">
                {isFetchingColaboradoresEmTreinamento ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={`skeleton-treinamento-${Date.now()}-${index}`} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : colaboradoresEmTreinamento && colaboradoresEmTreinamento.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {colaboradoresEmTreinamento.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.colaborador.nome}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{item.cargo.nome}</span>
                            <span>•</span>
                            <span>Iniciado em {new Date(item.iniciadoEm).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium truncate max-w-[150px]" title={item.treinamento.nome}>
                            {item.treinamento.nome}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              item.treinamento.tipo === 'integracao'
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : 'bg-purple-100 text-purple-800 border-purple-200'
                            }
                          >
                            {item.treinamento.tipo === 'integracao' ? 'Integração' : 'Capacitação'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum colaborador em treinamento no momento</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Colaboradores por Cargo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Colaboradores por Cargo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetchingCargos ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`cargo-skeleton-${Date.now()}-${index}`} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : analyticsCargos && analyticsCargos.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {analyticsCargos.map((cargo) => (
                <div
                  key={cargo.cargoId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">{cargo.nomeCargo}</div>
                    <div className="text-sm text-muted-foreground">
                      {cargo.totalColaboradores} colaborador{cargo.totalColaboradores !== 1 ? 'es' : ''}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {cargo.totalColaboradores}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum cargo com colaboradores encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabelas de Colaboradores */}
      <Tabs defaultValue="ativos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativos" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Colaboradores Ativos
            {colaboradoresAtivos && (
              <Badge variant="secondary" className="ml-1">
                {colaboradoresAtivos.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="demitidos" className="flex items-center gap-2">
            <UserMinus className="h-4 w-4" />
            Colaboradores Demitidos
            {colaboradoresDemitidos && (
              <Badge variant="secondary" className="ml-1">
                {colaboradoresDemitidos.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <TabelaColaboradores
            colaboradores={colaboradoresAtivos || []}
            titulo="Colaboradores Ativos"
            isLoading={isFetchingAtivos}
          />
        </TabsContent>

        <TabsContent value="demitidos">
          <TabelaColaboradores
            colaboradores={colaboradoresDemitidos || []}
            titulo="Colaboradores Demitidos"
            isLoading={isFetchingDemitidos}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
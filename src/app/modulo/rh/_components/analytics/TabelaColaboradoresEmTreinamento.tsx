'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { aplicarMascaraDocumento } from '@/lib/utils'
import { GraduationCap } from 'lucide-react'
import type { ColaboradorEmTreinamento } from '../../_types/analytics/AnalyticsType'

interface TabelaColaboradoresEmTreinamentoProps {
  colaboradores: ColaboradorEmTreinamento[]
  titulo: string
  isLoading?: boolean
}

export function TabelaColaboradoresEmTreinamento({
  colaboradores,
  titulo,
  isLoading = false,
}: TabelaColaboradoresEmTreinamentoProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {titulo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-${Date.now()}-${index}`} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (colaboradores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {titulo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum colaborador em treinamento no momento</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {titulo}
          <Badge variant="secondary" className="ml-2">
            {colaboradores.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Treinamento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Iniciado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradores.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.colaborador.nome}
                </TableCell>
                <TableCell>
                  {aplicarMascaraDocumento(item.colaborador.documento)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.cargo.nome}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="truncate" title={item.treinamento.nome}>
                    {item.treinamento.nome}
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {new Date(item.iniciadoEm).toLocaleDateString('pt-BR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

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
import { Mail, Phone, User } from 'lucide-react'
import type { ColaboradorListagem } from '../../_types/analytics/AnalyticsType'

interface TabelaColaboradoresProps {
  colaboradores: ColaboradorListagem[]
  titulo: string
  isLoading?: boolean
  mostrarStatus?: boolean
}

export function TabelaColaboradores({
  colaboradores,
  titulo,
  isLoading = false,
  mostrarStatus = false,
}: TabelaColaboradoresProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
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
            <User className="h-5 w-5" />
            {titulo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum colaborador encontrado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
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
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Data Admissão</TableHead>
              {mostrarStatus && <TableHead>Status</TableHead>}
              {colaboradores.some(c => c.demitidoEm) && (
                <TableHead>Data Demissão</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {colaboradores.map((colaborador) => (
              <TableRow key={colaborador.id}>
                <TableCell className="font-medium">
                  {colaborador.colaborador.nome}
                </TableCell>
                <TableCell>
                  {aplicarMascaraDocumento(colaborador.colaborador.documento)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{colaborador.cargo.nome}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {colaborador.colaborador.email && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {colaborador.colaborador.email}
                        </span>
                      </div>
                    )}
                    {colaborador.colaborador.telefone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{colaborador.colaborador.telefone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(colaborador.admitidoEm).toLocaleDateString('pt-BR')}
                </TableCell>
                {mostrarStatus && (
                  <TableCell>
                    <Badge
                      variant={colaborador.demitidoEm ? 'destructive' : 'default'}
                    >
                      {colaborador.demitidoEm ? 'Inativo' : 'Ativo'}
                    </Badge>
                  </TableCell>
                )}
                {colaboradores.some(c => c.demitidoEm) && (
                  <TableCell>
                    {colaborador.demitidoEm
                      ? new Date(colaborador.demitidoEm).toLocaleDateString('pt-BR')
                      : '-'}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

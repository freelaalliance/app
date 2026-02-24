'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClipboardCheck, Plus } from 'lucide-react'
import { useState } from 'react'
import { FormularioCadastrarTreinamentoRealizado } from '../../_components/forms/colaborador/FormularioCadastrarTreinamentoRealizado'
import { colunasTabelaTreinamentosRealizados } from '../../_components/tabelas/treinamentos-realizados/colunas-tabela-treinamentos-realizados'
import { TabelaTreinamentosRealizados } from '../../_components/tabelas/treinamentos-realizados/tabela'
import { useTreinamentosColaborador } from '../../_hooks/colaborador/useTreinamentosColaborador'

export default function TreinamentosColaboradorPage() {
  const [filtroStatus, setFiltroStatus] = useState<
    'todos' | 'pendentes' | 'finalizados'
  >('todos')

  const { data: treinamentosRealizados, isFetching: carregandoTreinamentos } =
    useTreinamentosColaborador(filtroStatus)

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>
                Treinamentos de Colaboradores
              </CardTitle>
              <CardDescription>
                Gerencie os treinamentos realizados pelos colaboradores da
                empresa
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={filtroStatus}
                onValueChange={(value) =>
                  setFiltroStatus(
                    value as 'todos' | 'pendentes' | 'finalizados'
                  )
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendentes">Pendentes</SelectItem>
                  <SelectItem value="finalizados">Finalizados</SelectItem>
                </SelectContent>
              </Select>

              <FormularioCadastrarTreinamentoRealizado>
                <Button className="flex items-center gap-2 bg-padrao-red hover:bg-red-800">
                  <Plus className="h-4 w-4" />
                  Cadastrar Treinamento
                </Button>
              </FormularioCadastrarTreinamentoRealizado>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TabelaTreinamentosRealizados
            listaTreinamentos={treinamentosRealizados ?? []}
            carregandoTreinamentos={carregandoTreinamentos}
            colunasTabela={colunasTabelaTreinamentosRealizados}
          />
        </CardContent>
      </Card>
    </section>
  )
}

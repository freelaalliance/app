'use client'

import { useQuery } from "@tanstack/react-query"
import { buscarInspecoesEquipamento } from "../api/InspecaoEquipamentoAPI"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ListaInspecoesAberto } from "../components/lists/ListaInspecoesAberto"
import { TabelaInspecoesEquipamento } from "../components/tables/inspecoes/tabela-inspecoes"
import IndicadoresInspecaoEquipamento from "../components/charts/IndicadorInspecaoEquipamento"

interface InspecaoEquipamentoProps {
  idEquipamento?: string
}

export default function InspecoesEquipamentoView({ idEquipamento }: InspecaoEquipamentoProps) {
  const { data: listaInspecoesEquipamento, isLoading: carregandoInspecoes } = useQuery({
    queryKey: ['listaInspecoesEquipamento', idEquipamento],
    queryFn: () => buscarInspecoesEquipamento({ equipamentoId: idEquipamento ?? '' }),
    staleTime: Infinity
  })

  return (
    <section className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Inspeções em aberto</CardTitle>
            <CardDescription>
              {
                'Inspeções de equipamentos que ainda não foram finalizadas'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaInspecoesAberto
              carregandoInspecoes={carregandoInspecoes}
              listaInspecoes={listaInspecoesEquipamento?.filter((inspecoes) => !inspecoes.finalizadoEm) ?? []}
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{`Indicadores`}</CardTitle>
            <CardDescription>
              Resumo de indicadores de inspeções do equipamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {
              carregandoInspecoes ? (
                <div className="flex flex-col md:flex-row justify-center gap-2">
                  <Skeleton className="h-52 w-52 rounded-full my-6" />
                </div>
              ) : (
                <IndicadoresInspecaoEquipamento inspecoes={
                  {
                    aberta: listaInspecoesEquipamento?.filter((inspecoes) => !inspecoes.finalizadoEm).length ?? 0,
                    aprovada: listaInspecoesEquipamento?.filter((inspecoes) => inspecoes.statusInspecao === 'aprovado' && inspecoes.finalizadoEm).length ?? 0,
                    reprovada: listaInspecoesEquipamento?.filter((inspecoes) => inspecoes.statusInspecao === 'reprovado' && inspecoes.finalizadoEm).length ?? 0,
                    total: listaInspecoesEquipamento?.length ?? 0,
                  }}
                />
              )
            }
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1">
        <TabelaInspecoesEquipamento
          idEquipamento={idEquipamento ?? ''}
          data={listaInspecoesEquipamento?.filter((inspecoes) => inspecoes.finalizadoEm) ?? []}
          carregandoInspecoes={carregandoInspecoes}
        />
      </div>
    </section>
  )
}
'use client'

import { useQuery } from "@tanstack/react-query";
import { TabelaEquipamentos } from "../components/tables/equipamento/tabela-equipamentos";
import { listarEquipamentos } from "../api/EquipamentoAPi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, Loader2 } from "lucide-react";
import CalendarioEventos, { eventoCalendario } from "@/components/calendario/CalendarioEventos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { buscarAgendaInspecoesEmpresa } from "../api/InspecaoEquipamentoAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInDays } from "date-fns";
import { ListaEventoInspecoesEmpresa } from "../components/lists/ListaEventoInspecoesEmpresa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { consultaEstatatisticaEquipamento, consultaEstatatisticaManutencao, consultaIndicadoresManutencaoEquipamento, consultaIndicadoresManutencaoEquipamentosEmpresa } from "../api/ManutencaoEquipamentoAPI";

import dynamic from "next/dynamic";

const MetricasManutencaoView = dynamic(() => import('./MetricasEmpresaView'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

export default function Equipamentos() {

  const { data: listaEquipamentos, isLoading: carregandoEquipamentos } = useQuery({
    queryKey: ['listaEquipamentosEmpresa'],
    queryFn: listarEquipamentos,
    staleTime: Infinity,
  })

  const agendaInspecoes = useQuery({
    queryKey: ['agendaInspecoesEmpresa'],
    queryFn: buscarAgendaInspecoesEmpresa,
    staleTime: Infinity,
  })

  const estatisticasEquipamento = useQuery({
    queryKey: ['estatisticasEquipamentos'],
    queryFn: consultaEstatatisticaEquipamento,
    staleTime: Infinity
  })

  const estatisticasManutencao = useQuery({
    queryKey: ['estatisticasManutencao'],
    queryFn: consultaEstatatisticaManutencao,
    staleTime: Infinity
  })

  const estatisticasManutencaoMTTReMTBF = useQuery({
    queryKey: ['estatisticasManutencaoMTTRMTBFEmpresa'],
    queryFn: consultaIndicadoresManutencaoEquipamentosEmpresa,
    staleTime: Infinity
  })

  return (
    <section className="grid space-y-2">
      <MetricasManutencaoView
        listaEquipamentos={{
          dados: listaEquipamentos ?? [],
          carregandoEquipamentos: carregandoEquipamentos
        }}
        indicadores={{
          dados: estatisticasManutencaoMTTReMTBF.data ?? [],
          carregandoIndicadores: estatisticasManutencaoMTTReMTBF.isLoading
        }}
        metricasManutencoes={{
          dados: estatisticasManutencao?.data ?? { qtd_equipamentos_manutencao_em_dia: 0, qtd_manutencoes_em_andamento: 0 },
          carregandoMetricasManutencao: estatisticasManutencao.isLoading
        }}
        metricasEquipamentos={{
          dados: estatisticasEquipamento?.data ?? { qtd_equipamentos_parados: 0, qtd_equipamentos_funcionando: 0 },
          carregandoMetricasEquipamentos: estatisticasEquipamento.isLoading
        }}
        agendaEquipamento={{
          eventos: agendaInspecoes.data ?? [],
          carregandoAgenda: agendaInspecoes.isLoading
        }}
      />
      <TabelaEquipamentos data={listaEquipamentos ?? []} carregandoEquipamentos={carregandoEquipamentos} />
    </section>
  )
}
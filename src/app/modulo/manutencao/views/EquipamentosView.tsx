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
import { consultaEstatatisticaEquipamento, consultaEstatatisticaManutencao, consultaIndicadoresManutencaoEmpresa } from "../api/ManutencaoEquipamentoAPI";

import dynamic from "next/dynamic";

const MetricasManutencaoView = dynamic(() => import('./MetricasView'), {
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

  const [equipamentoSelecionado, selecionarEquipamento] = useState<string>("0")

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
    queryKey: ['estatisticasManutencaoMTTRMTBF'],
    queryFn: () => consultaIndicadoresManutencaoEmpresa({equipamentoId: undefined}),
    staleTime: Infinity
  })

  const agenda: eventoCalendario = (agendaInspecoes.data && agendaInspecoes.data.length > 0) ? agendaInspecoes.data.map((agendamento) => {
    const dataAgendamento = new Date(agendamento.agendadoPara)
    const dataAtual = new Date()

    const diferencaDias = differenceInDays(
      new Date(dataAgendamento.getFullYear(), dataAgendamento.getMonth(), dataAgendamento.getDate()),
      new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate())
    )

    if (agendamento.inspecaoRealizada) {
      return {
        id: String(agendamento.id),
        allDay: true,
        start: new Date(agendamento.agendadoPara),
        title: agendamento.equipamento.nome.toUpperCase(),
        display: 'auto',
        backgroundColor: '#168821',
        textColor: '#fff',
        borderColor: '#168821',
        color: '#168821',
      }
    }
    else if (!agendamento.inspecaoRealizada && diferencaDias < agendamento.equipamento.frequencia && diferencaDias > 0) {
      return {
        id: String(agendamento.id),
        allDay: true,
        start: new Date(agendamento.agendadoPara),
        title: agendamento.equipamento.nome.toUpperCase(),
        display: 'auto',
        backgroundColor: '#ffcd07',
        textColor: '#000',
        borderColor: '#ffcd07',
        color: '#fff'
      }
    }
    else if (!agendamento.inspecaoRealizada && diferencaDias >= agendamento.equipamento.frequencia) {

      return {
        id: String(agendamento.id),
        allDay: true,
        start: new Date(agendamento.agendadoPara),
        title: agendamento.equipamento.nome.toUpperCase(),
        display: 'auto',
        backgroundColor: '#155BCB',
        textColor: '#fff',
        borderColor: '#155BCB',
        color: '#155BCB'
      }
    }
    else {
      return {
        id: String(agendamento.id),
        allDay: true,
        start: new Date(agendamento.agendadoPara),
        title: agendamento.equipamento.nome.toUpperCase(),
        display: 'auto',
        backgroundColor: '#E52207',
        textColor: '#fff',
        borderColor: '#E52207',
        color: '#E52207'
      }
    }
  }) : []

  return (
    <section className="grid space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-2">
        <div className="md:col-span-3 lg:col-span-5">
          <MetricasManutencaoView
            indicadores={{
              dados: estatisticasManutencaoMTTReMTBF.data ?? {
                qtd_manutencoes: 0,
                total_tempo_parado: 0
              },
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
          />
        </div>
        <Card className="md:col-span-2 lg:col-span-3 shadow rounded-sm">
          <Tabs defaultValue={"calendario"}>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
              <CardDescription className="space-y-2">
                <p>{'Inspeções de equipamento da empresa'}</p>
                <TabsList className="bg-transparent grid w-full grid-cols-2 gap-2 p-0">
                  <TabsTrigger
                    className="shadow w-full bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 md:w-auto"
                    value={"calendario"}
                    title="Visualizar no calendário"
                  >
                    <CalendarDays className="size-6 hidden md:flex" />
                    <span className="flex md:hidden">Calendário</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="shadow w-full bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 md:w-auto"
                    value={"lista"}
                    title="Visualizar em eventos"
                  >
                    <List className="size-6 hidden md:flex" />
                    <span className="flex md:hidden">Lista</span>
                  </TabsTrigger>
                </TabsList>
              </CardDescription>
            </CardHeader>
            <TabsContent value="calendario">
              <CardContent className="h-auto">
                {
                  agendaInspecoes?.isLoading ? (
                    <div className="grid">
                      <Skeleton className="h-[550px] w-full" />
                    </div>
                  ) : (
                    <CalendarioEventos eventos={agenda} />
                  )
                }
              </CardContent>
            </TabsContent>
            <TabsContent value="lista">
              <CardContent>
                <div className="grid space-y-4">
                  <Select disabled={carregandoEquipamentos} onValueChange={selecionarEquipamento} defaultValue={"0"}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={(listaEquipamentos && listaEquipamentos.length > 0) ? 'Filtrar por equipamento' : 'Nenhum equipamento encontrado'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={'0'}>Todos</SelectItem>
                      {(listaEquipamentos && listaEquipamentos?.length > 0) && listaEquipamentos?.map((equipamento) => (
                        <SelectItem value={equipamento.id}>{equipamento.nome}</SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                  <ScrollArea className="max-h-[650px]">
                    <div className="grid gap-4">
                      {
                        agendaInspecoes?.isLoading ? (
                          <>
                            <Skeleton className="w-full h-24 rounded-sm shadow" />
                            <Skeleton className="w-full h-24 rounded-sm shadow" />
                            <Skeleton className="w-full h-24 rounded-sm shadow" />
                          </>
                        ) : equipamentoSelecionado !== '0' ? agendaInspecoes.data?.filter((evento) => evento.equipamento.id === equipamentoSelecionado && !evento.inspecaoRealizada).map((evento) => {
                          return (
                            <ListaEventoInspecoesEmpresa key={evento.id} evento={evento} />
                          )
                        }) : agendaInspecoes.data?.filter((evento) => !evento.inspecaoRealizada).map((evento) => {
                          return (
                            <ListaEventoInspecoesEmpresa key={evento.id} evento={evento} />
                          )
                        })
                      }
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <TabelaEquipamentos data={listaEquipamentos ?? []} carregandoEquipamentos={carregandoEquipamentos} />
    </section>
  )
}
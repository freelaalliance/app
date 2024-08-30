
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarCheck, Hammer, ShieldAlert, Activity, ArrowBigDownDash, CalendarDays, List } from "lucide-react"
import {
  dadosIndicadoresManutencaoEquipamentoEmpresaType,
  estatisticasEquipamentoType,
  estatisticasManutencaoType,
  indicadoresFalhasEquipamentosEmpresaType
} from "../schemas/ManutencaoSchema"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { calculaMtbf, calculaMttr } from "../utils/indicadores"
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf'
import { Skeleton } from "@/components/ui/skeleton"
import CalendarioEventos, { eventoCalendario } from "@/components/calendario/CalendarioEventos"
import { cn } from "@/lib/utils"
import { IndicadorFalhasEquipamentoEmpresa } from "../components/charts/IndicadorFalhasEquipamentosEmpresa"
import { IndicadorInformativo } from "@/components/IndicadorInfo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { ListaEventoInspecoesEmpresa } from "../components/lists/ListaEventoInspecoesEmpresa"
import { useState } from "react"
import { DadosEquipamentoType } from "../schemas/EquipamentoSchema"
import { AgendaInspecoesEmpresa } from "../schemas/InspecaoSchema"
import { differenceInDays } from "date-fns"

interface MetricasManutencaoProps {
  listaEquipamentos: {
    dados: DadosEquipamentoType[],
    carregandoEquipamentos: boolean
  }
  indicadores: {
    dados: dadosIndicadoresManutencaoEquipamentoEmpresaType[]
    carregandoIndicadores: boolean
  }
  metricasManutencoes: {
    dados: estatisticasManutencaoType,
    carregandoMetricasManutencao: boolean
  }
  metricasEquipamentos: {
    dados: estatisticasEquipamentoType,
    carregandoMetricasEquipamentos: boolean
  },
  agendaEquipamento: {
    eventos: AgendaInspecoesEmpresa[],
    carregandoAgenda: boolean,
  }
}

export default function MetricasEquipamentosEmpresaView({ listaEquipamentos, agendaEquipamento, indicadores, metricasEquipamentos, metricasManutencoes }: MetricasManutencaoProps) {

  const [equipamentoSelecionado, selecionarEquipamento] = useState<string>("0")
  const getMetricaManutencaoRelatorio = () => document.getElementById('metricasManutencao');

  const options: Options = {
    method: 'open',
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: 'A4',
      orientation: 'portrait',
    },
  }

  const dadosMtbfEMttr: indicadoresFalhasEquipamentosEmpresaType[] = indicadores.dados.map((equipamento) => {
    return {
      equipamento: equipamento.nome,
      mtbf: calculaMtbf({ tempoTotalParada: equipamento.total_tempo_parado, qtdParada: equipamento.qtd_manutencoes, tempoTotalOperacao: equipamento.total_tempo_operacao }),
      mttr: calculaMttr({ tempoTotalParada: equipamento.total_tempo_parado, qtdParada: equipamento.qtd_manutencoes })
    }
  })

  const agenda: eventoCalendario = (agendaEquipamento.eventos.length > 0) ? agendaEquipamento.eventos.map((agendamento) => {
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
    <div className="space-y-2">
      <div className="flex flex-1 shadow rounded bg-zinc-200 p-4 space-x-2 justify-between items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'sm'}
              className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2"
              onClick={() => generatePDF(getMetricaManutencaoRelatorio, options)}
            >
              <ArrowBigDownDash className="size-5" />
              {'Exportar'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gerar relatório PDF das métricas de manutenção</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1 space-y-2" id="metricasManutencao">
        <div className={cn('grid grid-cols-1', agendaEquipamento && 'md:grid-cols-3 gap-y-2 md:gap-2')}>
          <div className="col-span-2">
            <div className="grid gap-2">
              {(metricasEquipamentos && metricasManutencoes) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <IndicadorInformativo
                    carregandoInformacao={metricasManutencoes.carregandoMetricasManutencao}
                    info={metricasManutencoes.dados.qtd_equipamentos_manutencao_em_dia}
                    titulo="Manutenções em dia"
                    icon={CalendarCheck} />
                  <IndicadorInformativo
                    carregandoInformacao={metricasManutencoes.carregandoMetricasManutencao}
                    info={metricasManutencoes.dados.qtd_manutencoes_em_andamento}
                    titulo="Manutenções corretivas"
                    icon={Hammer} />
                  <IndicadorInformativo
                    carregandoInformacao={metricasEquipamentos.carregandoMetricasEquipamentos}
                    info={metricasEquipamentos.dados.qtd_equipamentos_parados}
                    titulo="Equipamentos parados"
                    icon={ShieldAlert} />
                  <IndicadorInformativo
                    carregandoInformacao={metricasEquipamentos.carregandoMetricasEquipamentos}
                    info={metricasEquipamentos.dados.qtd_equipamentos_funcionando}
                    titulo="Equipamentos funcionando"
                    icon={Activity} />
                </div>
              )}
              <Card className="shadow rounded border-0 md:min-h-[595px]">
                <CardHeader>
                  <CardTitle>
                    MTTR e MTBF
                  </CardTitle>
                  <CardDescription>
                    {
                      'Indicadores dos equipamentos da empresa'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IndicadorFalhasEquipamentoEmpresa dados={dadosMtbfEMttr} />
                </CardContent>
              </Card>
            </div>
          </div>
          {agendaEquipamento && (
            <Card className="shadow rounded border-0">
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
                      agendaEquipamento.carregandoAgenda ? (
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
                      <Select disabled={listaEquipamentos.carregandoEquipamentos} onValueChange={selecionarEquipamento} defaultValue={"0"}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={(listaEquipamentos.dados.length > 0) ? 'Filtrar por equipamento' : 'Nenhum equipamento encontrado'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={'0'}>Todos</SelectItem>
                          {listaEquipamentos.dados.length > 0 && listaEquipamentos.dados.map((equipamento) => (
                            <SelectItem value={equipamento.id}>{equipamento.nome}</SelectItem>
                          ))
                          }
                        </SelectContent>
                      </Select>
                      <ScrollArea className="max-h-[650px]">
                        <div className="grid gap-4">
                          {
                            agendaEquipamento.carregandoAgenda ? (
                              <>
                                <Skeleton className="w-full h-24 rounded-sm shadow" />
                                <Skeleton className="w-full h-24 rounded-sm shadow" />
                                <Skeleton className="w-full h-24 rounded-sm shadow" />
                              </>
                            ) : equipamentoSelecionado !== '0' ? agendaEquipamento.eventos.filter((evento) => evento.equipamento.id === equipamentoSelecionado && !evento.inspecaoRealizada).map((evento) => {
                              return (
                                <ListaEventoInspecoesEmpresa key={evento.id} evento={evento} />
                              )
                            }) : agendaEquipamento.eventos.filter((evento) => !evento.inspecaoRealizada).map((evento) => {
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
          )}
        </div>
      </div>
    </div>
  )
}
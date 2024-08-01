
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarCheck, Hammer, ShieldAlert, Activity, ArrowBigDownDash } from "lucide-react"
import { IndicadorFalhas } from "../components/charts/IndicadorFalhas"
import { IndicadorInformativo } from "../components/IndicadorInfo"
import { dadosIndicadoresManutencaoType, DadosManutencaoEquipamentoType, DuracaoManutencoesEquipamentoType, estatisticasEquipamentoType, estatisticasManutencaoType, indicadoresFalhasEquipamentoType } from "../schemas/ManutencaoSchema"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { calculaMtbf, calculaMttr } from "../utils/indicadores"
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf'
import { DadosInspecoesEquipamentoType } from "../schemas/EquipamentoSchema"
import { ListaInspecoesAberto } from "../components/lists/ListaInspecoesAberto"
import { Skeleton } from "@/components/ui/skeleton"
import IndicadoresInspecaoEquipamento from "../components/charts/IndicadorInspecaoEquipamento"
import RankingDurancaoManutencaoEquipamento from "../components/charts/IndicadorTempoManutencaoEquipamento"
import IndicadoresMediaEquipamentoParado from "../components/charts/IndicadorMediaEquipamentoParado"
import IndicadoresMediaDuracaoManutencoesEquipamento from "../components/charts/IndicadorMediaDuracaoEquipamento"
import CalendarioEventos, { eventoCalendario } from "@/components/calendario/CalendarioEventos"
import { cn } from "@/lib/utils"

interface MetricasManutencaoProps {
  indicadores: {
    dados: dadosIndicadoresManutencaoType
    carregandoIndicadores: boolean
  }
  metricasManutencoes?: {
    dados: estatisticasManutencaoType,
    carregandoMetricasManutencao: boolean
  }
  metricasEquipamentos?: {
    dados: estatisticasEquipamentoType,
    carregandoMetricasEquipamentos: boolean
  },
  inspecoes?: {
    dados: Array<DadosInspecoesEquipamentoType>
    carregandoInspecoes: boolean
  }
  manutencoes?: {
    metricas: Array<DuracaoManutencoesEquipamentoType>
    carregandoMetricas: boolean
    listaManutencoes: Array<DadosManutencaoEquipamentoType>
    carregandoManutencoes: boolean
  }
  agendaEquipamento?: {
    eventos: eventoCalendario,
    carregandoAgenda: boolean,
  }
}

export default function MetricasView({ agendaEquipamento, indicadores, metricasEquipamentos, metricasManutencoes, inspecoes, manutencoes }: MetricasManutencaoProps) {

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

  const dadosMtbfEMttr: indicadoresFalhasEquipamentoType = {
    mtbf: calculaMtbf({ tempoTotalParada: indicadores.dados.total_tempo_parado, qtdParada: indicadores.dados.qtd_manutencoes }),
    mttr: calculaMttr({ tempoTotalParada: indicadores.dados.total_tempo_parado, qtdParada: indicadores.dados.qtd_manutencoes })
  }

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
        {(metricasEquipamentos && metricasManutencoes) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <IndicadorInformativo carregandoInformacao={metricasManutencoes.carregandoMetricasManutencao} info={metricasManutencoes.dados.qtd_equipamentos_manutencao_em_dia} titulo="Manutenções em dia" icon={CalendarCheck} />
            <IndicadorInformativo carregandoInformacao={metricasManutencoes.carregandoMetricasManutencao} info={metricasManutencoes.dados.qtd_manutencoes_em_andamento} titulo="Manutenções corretivas" icon={Hammer} />
            <IndicadorInformativo carregandoInformacao={metricasEquipamentos.carregandoMetricasEquipamentos} info={metricasEquipamentos.dados.qtd_equipamentos_parados} titulo="Equipamentos parados" icon={ShieldAlert} />
            <IndicadorInformativo carregandoInformacao={metricasEquipamentos.carregandoMetricasEquipamentos} info={metricasEquipamentos.dados.qtd_equipamentos_funcionando} titulo="Equipamentos funcionando" icon={Activity} />
          </div>
        )}
        <div className={cn('grid grid-cols-1', agendaEquipamento && 'md:grid-cols-2 gap-2')}>
          <div className="grid space-y-2">
            <Card className="shadow rounded border-0">
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
              <CardContent className="">
                <IndicadorFalhas data={dadosMtbfEMttr} />
              </CardContent>
            </Card>
          </div>
          {agendaEquipamento ? agendaEquipamento.carregandoAgenda ? (
            <div className="grid">
              <Skeleton className="h-[550px] w-full" />
            </div>
          ) : (
            <Card className="shadow rounded border-0">
              <CardHeader>
                <CardTitle>Agenda de preventivas</CardTitle>
                <CardDescription>
                  {
                    'Agenda de manutenções preventivas do equipamento'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarioEventos eventos={agendaEquipamento.eventos} />
              </CardContent>
            </Card>
          ) : <></>}
        </div>

        {inspecoes && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Card className="shadow rounded border-0">
              <CardHeader>
                <CardTitle>Preventivas em aberto</CardTitle>
                <CardDescription>
                  {
                    'Manutenções preventivas de equipamentos que ainda não foram finalizadas'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ListaInspecoesAberto
                  carregandoInspecoes={inspecoes.carregandoInspecoes}
                  listaInspecoes={inspecoes.dados.filter((inspecoes) => !inspecoes.finalizadoEm) ?? []}
                />
              </CardContent>
            </Card>
            <Card className="shadow rounded border-0">
              <CardHeader>
                <CardTitle>{`Indicadores`}</CardTitle>
                <CardDescription>
                  Resumo de indicadores de manutenções preventivas do equipamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {
                  inspecoes.carregandoInspecoes ? (
                    <div className="flex flex-col md:flex-row justify-center gap-2">
                      <Skeleton className="h-52 w-52 rounded-full my-6" />
                    </div>
                  ) : (
                    <IndicadoresInspecaoEquipamento inspecoes={
                      {
                        aberta: inspecoes.dados.filter((inspecoes) => !inspecoes.finalizadoEm).length,
                        aprovada: inspecoes.dados.filter((inspecoes) => inspecoes.statusInspecao === 'aprovado' && inspecoes.finalizadoEm).length,
                        reprovada: inspecoes.dados.filter((inspecoes) => inspecoes.statusInspecao === 'reprovado' && inspecoes.finalizadoEm).length,
                        total: inspecoes.dados.length,
                      }}
                    />
                  )
                }
              </CardContent>
            </Card>
          </div>
        )}
        {manutencoes && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="grid shadow rounded border-0">
              <CardHeader>
                <CardTitle>Ranking corretivas</CardTitle>
                <CardDescription>
                  {
                    'Ranking de durações de manutenções corretivas no equipamento'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 mx-4">
                {
                  manutencoes.carregandoMetricas ? (
                    <div className="flex-1 justify-center gap-2">
                      <Skeleton className="h-52 w-52 rounded-full my-6" />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <RankingDurancaoManutencaoEquipamento dados={manutencoes.metricas} />
                    </div>
                  )
                }
              </CardContent>
            </Card>
            <Card className="grid shadow rounded border-0">
              <CardHeader className="pb-0">
                <CardTitle>Equipamento parado</CardTitle>
                <CardDescription>
                  Duração média total do equipamento parado
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                {
                  manutencoes.carregandoManutencoes ? (
                    <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                      <Skeleton className="h-52 w-52 rounded-full my-6" />
                    </div>
                  ) : (
                    <div className="flex-1 justify-center">
                      <IndicadoresMediaEquipamentoParado listaManutencoes={manutencoes.listaManutencoes} />
                    </div>
                  )
                }
              </CardContent>
            </Card>
            <Card className="grid shadow rounded border-0">
              <CardHeader className="pb-0">
                <CardTitle>Duração da manutenções</CardTitle>
                <CardDescription>
                  Média de duração das manutenções realizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                {
                  manutencoes.carregandoManutencoes ? (
                    <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                      <Skeleton className="h-52 w-52 rounded-full my-6" />
                    </div>
                  ) : (
                    <IndicadoresMediaDuracaoManutencoesEquipamento listaManutencoes={manutencoes.listaManutencoes} />
                  )
                }
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
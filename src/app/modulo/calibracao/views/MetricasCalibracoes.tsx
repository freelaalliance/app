import {
  ArrowBigDownDash,
  ClipboardCheck,
  Clock11,
  DownloadCloud,
  SmartphoneNfc,
} from 'lucide-react'
import generatePDF, { Margin, Options, Resolution } from 'react-to-pdf'
import { toast } from 'sonner'

import CalendarioEventos, {
  eventoCalendario,
} from '@/components/calendario/CalendarioEventos'
import { IndicadorInformativo } from '@/components/IndicadorInfo'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatarDataBrasil, handleDownloadFile } from '@/lib/utils'

import {
  AgendaCalibracaoEmpresaType,
  recuperaCorVencimentoCalibracoesAgenda,
} from '../api/AgendaCalibracoes'
import { CalibracoesInstrumentosEmpresaType } from '../api/Calibracao'
import { EstatisticasCalibracaoInstrumentoGeral } from '../api/EstatisticasCalibracao'

const getMetricaCalibracaoRelatorio = () =>
  document.getElementById('metricasCalibracao')

const options: Options = {
  method: 'open',
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.MEDIUM,
    format: 'A4',
    orientation: 'portrait',
  },
}

interface MetricasCalibracaoProps {
  indicadores: {
    dados: EstatisticasCalibracaoInstrumentoGeral
    carregandoIndicadores: boolean
  }
  agenda: {
    eventos: AgendaCalibracaoEmpresaType[]
    carregandoAgenda: boolean
  }
  historicoCalibracoes: {
    dados: CalibracoesInstrumentosEmpresaType
    carregandoCalibracoes: boolean
  }
}

export default function MetricasCalibracaoView({
  indicadores,
  agenda,
  historicoCalibracoes,
}: MetricasCalibracaoProps) {
  const agendaCalibracoes: eventoCalendario = agenda.eventos.map((dados) => {
    return {
      id: dados.id,
      allDay: true,
      title: dados.nome,
      start: dados.agendadoPara,
      end: dados.agendadoPara,
      backgroundColor: recuperaCorVencimentoCalibracoesAgenda(
        new Date(dados.agendadoPara),
      ).bgCalendario,
      borderColor: recuperaCorVencimentoCalibracoesAgenda(
        new Date(dados.agendadoPara),
      ).bgCalendario,
      textColor: '#fff',
      display: 'block',
    }
  })

  return (
    <div className="space-y-2">
      <div className="flex flex-1 shadow rounded bg-zinc-200 p-4 space-x-2 justify-between items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'sm'}
              className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2"
              onClick={() =>
                generatePDF(getMetricaCalibracaoRelatorio, options)
              }
            >
              <ArrowBigDownDash className="size-5" />
              {'Exportar'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gerar relatório PDF das métricas de calibração</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1 space-y-2" id="metricasCalibracao">
        <div className={'grid grid-cols-1 md:grid-cols-3 gap-y-2 md:gap-2'}>
          <div className="col-span-2">
            <div className="grid gap-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <IndicadorInformativo
                  carregandoInformacao={indicadores.carregandoIndicadores}
                  info={indicadores.dados.quantidadeInstrumentosEmpresa ?? 0}
                  titulo={'Instrumentos'}
                  icon={SmartphoneNfc}
                />
                <IndicadorInformativo
                  carregandoInformacao={indicadores.carregandoIndicadores}
                  info={indicadores.dados.quantidadeCalibracoesAprovadas ?? 0}
                  titulo={'Aprovadas'}
                  icon={ClipboardCheck}
                />
                <IndicadorInformativo
                  carregandoInformacao={indicadores.carregandoIndicadores}
                  info={indicadores.dados.quantidadeCalibracoesReprovadas ?? 0}
                  titulo={'Reprovadas'}
                  icon={ClipboardCheck}
                />
                <IndicadorInformativo
                  carregandoInformacao={indicadores.carregandoIndicadores}
                  info={`${indicadores.dados.calibracoesVencendo ?? 0} / ${indicadores.dados.calibracoesVencido ?? 0}`}
                  titulo={'Vencendo / Vencidos'}
                  icon={Clock11}
                />
              </div>
              <Card className="shadow rounded border-0">
                <CardHeader>
                  <CardTitle>Históricos de calibrações</CardTitle>
                  <CardDescription>
                    {`Calibrações realizadas recentemente`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full md:h-[400px]"
                  >
                    <ScrollArea className="max-h-[350px] overflow-auto">
                      {historicoCalibracoes.dados.map((historico) => {
                        return (
                          <AccordionItem
                            key={historico.calibracao.id}
                            value={historico.calibracao.id}
                          >
                            <AccordionTrigger>
                              {`${formatarDataBrasil(new Date(historico.calibracao.realizadoEm))} - ${historico.instrumento.nome}`}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid space-y-4">
                                <span className="capitalize">
                                  <b>Realizado por: </b>
                                  {historico.calibracao.usuarioNome}
                                </span>
                                <span className="capitalize">
                                  <b>Situação: </b>
                                  {historico.calibracao.status}
                                </span>

                                <Button
                                  className="mt-2 gap-2 shadow-md text-sm uppercase leading-none text-white bg-sky-600  hover:bg-sky-700 "
                                  disabled={!historico.calibracao.certificado}
                                  onClick={async () => {
                                    if (historico.calibracao.certificado) {
                                      await handleDownloadFile(
                                        historico.calibracao.certificado,
                                        historico.calibracao.id,
                                      )
                                    } else {
                                      toast.warning(
                                        'Certificado não encontrado!',
                                      )
                                    }
                                  }}
                                >
                                  <DownloadCloud className="h-4 w-4" />
                                  Baixar o certificado
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </ScrollArea>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card className="shadow rounded border-0">
            <CardHeader>
              <CardTitle>Agenda de calibrações</CardTitle>
              <CardDescription>
                {'Agenda de calibrações dos instrumentos da empresa'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agenda.carregandoAgenda ? (
                <div className="grid">
                  <Skeleton className="h-[550px] w-full" />
                </div>
              ) : (
                <CalendarioEventos eventos={agendaCalibracoes} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { differenceInDays } from 'date-fns'
import { ArrowLeft, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'

import { eventoCalendario } from '@/components/calendario/CalendarioEventos'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { buscarAgendamentosEquipamento } from '../../api/EquipamentoAPi'
import { buscarInspecoesEquipamento } from '../../api/InspecaoEquipamentoAPI'
import {
  buscarDuracaoManutencoesEquipamento,
  buscarManutencoesEquipamento,
  consultaIndicadoresManutencaoEquipamento,
} from '../../api/ManutencaoEquipamentoAPI'

const InspecoesEquipamentoView = dynamic(
  () => import('../../views/InspecoesEquipamentoView'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

const ManutencoesEquipamentoView = dynamic(
  () => import('../../views/ManutencoesEquipamentoView'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

const MetricasManutencaoView = dynamic(
  () => import('../../views/MetricasEquipamentoView'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

export default function PageInformacoesEquipamento() {
  const searchParams = useSearchParams()
  const idEquipamento = searchParams.get('id')
  const nomeEquipamento = searchParams.get('nome')

  const inspecoesEquipamento = useQuery({
    queryKey: ['listaInspecoesEquipamento', idEquipamento],
    queryFn: () =>
      buscarInspecoesEquipamento({ equipamentoId: idEquipamento ?? '' }),
    staleTime: Infinity,
  })

  const metricasManutencoesEquipamento = useQuery({
    queryKey: ['estatisticaDuracaoManutencoesEquipamento', idEquipamento],
    queryFn: () =>
      buscarDuracaoManutencoesEquipamento({
        equipamentoId: idEquipamento ?? '',
      }),
    staleTime: Infinity,
  })

  const listaManutencoesEquipamento = useQuery({
    queryKey: ['manutencoesEquipamento', idEquipamento],
    queryFn: () =>
      buscarManutencoesEquipamento({ equipamentoId: idEquipamento ?? '' }),
    staleTime: Infinity,
  })

  const estatisticasManutencaoMTTReMTBFEquipamento = useQuery({
    queryKey: ['estatisticasManutencaoMTTRMTBFEquipamento', idEquipamento],
    queryFn: () =>
      consultaIndicadoresManutencaoEquipamento({
        equipamentoId: idEquipamento,
      }),
    staleTime: Infinity,
  })

  const agendaEquipamento = useQuery({
    queryKey: ['agendaInspecaoEquipamento', idEquipamento],
    queryFn: () =>
      buscarAgendamentosEquipamento({ idEquipamento: idEquipamento ?? '' }),
    staleTime: Infinity,
  })

  const eventos: eventoCalendario =
    agendaEquipamento.data?.map((agendamento) => {
      const dataAgendamento = new Date(agendamento.agendadoPara)
      const dataAtual = new Date()

      const diferencaDias = differenceInDays(
        new Date(
          dataAgendamento.getFullYear(),
          dataAgendamento.getMonth(),
          dataAgendamento.getDate(),
        ),
        new Date(
          dataAtual.getFullYear(),
          dataAtual.getMonth(),
          dataAtual.getDate(),
        ),
      )

      if (agendamento.inspecaoRealizada) {
        return {
          id: String(agendamento.id),
          allDay: true,
          start: new Date(agendamento.agendadoPara),
          title: 'Inspeção realizada',
          display: 'auto',
          backgroundColor: '#168821',
          textColor: '#fff',
          borderColor: '#168821',
          color: '#168821',
        }
      } else if (
        !agendamento.inspecaoRealizada &&
        diferencaDias < 30 &&
        diferencaDias > 0
      ) {
        return {
          id: String(agendamento.id),
          allDay: true,
          start: new Date(agendamento.agendadoPara),
          title: 'Inspeção próxima',
          display: 'auto',
          backgroundColor: '#ffcd07',
          textColor: '#000',
          borderColor: '#ffcd07',
          color: '#fff',
        }
      } else if (!agendamento.inspecaoRealizada && diferencaDias >= 30) {
        return {
          id: String(agendamento.id),
          allDay: true,
          start: new Date(agendamento.agendadoPara),
          title: 'Inspeção agendada',
          display: 'auto',
          backgroundColor: '#155BCB',
          textColor: '#fff',
          borderColor: '#155BCB',
          color: '#155BCB',
        }
      } else {
        return {
          id: String(agendamento.id),
          allDay: true,
          start: new Date(agendamento.agendadoPara),
          title: 'Inspeção atrasada',
          display: 'auto',
          backgroundColor: '#E52207',
          textColor: '#fff',
          borderColor: '#E52207',
          color: '#E52207',
        }
      }
    }) ?? []

  return (
    <div className="space-y-2">
      <div className="flex flex-1 shadow rounded-lg bg-zinc-200 p-4 space-x-2 justify-between items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'link'}
              size={'icon'}
              onClick={() => {
                history.back()
              }}
            >
              <ArrowLeft className="size-5 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar para lista de equipamentos</p>
          </TooltipContent>
        </Tooltip>
        <h1 className="text-xl font-semibold text-black">{nomeEquipamento}</h1>
      </div>
      <Separator />
      <Tabs defaultValue={'metricas'} className="space-y-4">
        <TabsList className="flex bg-transparent space-x-2 justify-between md:justify-start">
          <TabsTrigger
            className="shadow w-full bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 md:w-auto"
            value="metricas"
          >
            Métricas
          </TabsTrigger>
          <TabsTrigger
            className="shadow w-full bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 md:w-auto"
            value="inspecoes"
          >
            Preventivas
          </TabsTrigger>
          <TabsTrigger
            className="shadow w-full bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 md:w-auto"
            value="manutencoes"
          >
            Corretivas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="metricas">
          <MetricasManutencaoView
            indicadores={{
              dados: estatisticasManutencaoMTTReMTBFEquipamento.data ?? {
                qtd_manutencoes: 0,
                total_tempo_parado: 0,
                total_tempo_operacao: 0,
              },
              carregandoIndicadores: true,
            }}
            inspecoes={{
              carregandoInspecoes: inspecoesEquipamento.isLoading,
              dados: inspecoesEquipamento.data ?? [],
            }}
            manutencoes={{
              carregandoManutencoes: listaManutencoesEquipamento.isLoading,
              metricas: metricasManutencoesEquipamento.data ?? [],
              carregandoMetricas: metricasManutencoesEquipamento.isLoading,
              listaManutencoes: listaManutencoesEquipamento.data ?? [],
            }}
            agendaEquipamento={{
              carregandoAgenda: agendaEquipamento.isLoading,
              eventos,
            }}
          />
        </TabsContent>
        <TabsContent value="inspecoes">
          <InspecoesEquipamentoView
            idEquipamento={idEquipamento ?? ''}
            carregandoInspecoes={inspecoesEquipamento.isLoading}
            listaInspecoesEquipamento={inspecoesEquipamento.data ?? []}
          />
        </TabsContent>
        <TabsContent value="manutencoes">
          <ManutencoesEquipamentoView
            idEquipamento={idEquipamento ?? ''}
            carregandoManutencoes={listaManutencoesEquipamento.isLoading}
            listaManutencoes={listaManutencoesEquipamento.data ?? []}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'

import CalendarioEventos from '@/components/calendario/CalendarioEventos'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

import {
  AgendaCalibracaoEmpresaType,
  recuperaAgendaCalibracoesEmpresa,
  recuperaCorVencimentoCalibracoesAgenda,
} from './api/AgendaCalibracoes'
import { ItemVencimento } from './components/ItemVencimento'

export default function Vencimentos() {
  const { data: agendaCalibracoes, isLoading: isLoadingAgendamento } = useQuery(
    {
      queryKey: ['agendaCalibracoes'],
      queryFn: recuperaAgendaCalibracoesEmpresa,
    },
  )

  const vencimentosMesAtual: AgendaCalibracaoEmpresaType[] =
    agendaCalibracoes?.filter((agendaMes) => {
      const dataAgendamentoCalibracao: Date = new Date(agendaMes.agendadoPara)
      const dataAtual: Date = new Date()

      return (
        dataAgendamentoCalibracao.getFullYear() <= dataAtual.getFullYear() &&
        dataAgendamentoCalibracao.getMonth() <= dataAtual.getMonth()
      )
    }) ?? []

  return (
    <div className="grid gap-2 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
      <Card className="hidden w-auto h-auto bg-gray-50 rounded md:block md:col-span-3 lg:col-span-4 xl:col-span-8 shadow">
        <CardTitle className="py-4 ml-3">Calendário de vencimentos</CardTitle>
        <CardContent>
          {isLoadingAgendamento ? (
            <div className="flex h-[240px] w-full items-center justify-center">
              <Loader2 className="animate-spin h-16 w-16 " />
            </div>
          ) : (
            <CalendarioEventos
              eventos={
                agendaCalibracoes?.map((dados) => {
                  return {
                    id: uuidv4(),
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
                }) ?? []
              }
            />
          )}
        </CardContent>
      </Card>
      <Card className="md:col-span-3 lg:col-span-4 bg-gray-50 rounded">
        <CardTitle className="py-4 ml-3">Vencimentos deste mês</CardTitle>
        <CardContent className="py-2">
          <ScrollArea className="h-max">
            <ul className="space-y-2">
              {vencimentosMesAtual.length === 0 ? (
                <li className="mt-4">
                  <div className="flex flex-col justify-center space-y-3 items-center">
                    <Image
                      src={'/empty-schedule.svg'}
                      alt="Nenhuma calibração agendado"
                      width={260}
                      height={110}
                    />
                    <p className="text-sm font-medium mt-5 md:text-base lg:text-lg text-padrao-gray-200">
                      Nenhuma calibração agendada para este mês!
                    </p>
                  </div>
                </li>
              ) : (
                vencimentosMesAtual.map((agendaMes) => {
                  const corItemVencimentoCalibracao =
                    recuperaCorVencimentoCalibracoesAgenda(
                      new Date(agendaMes.agendadoPara),
                    )

                  return (
                    <ItemVencimento
                      key={agendaMes.id}
                      className={`${corItemVencimentoCalibracao.bgLista} text-white rounded-md`}
                      instrumento={agendaMes.instrumento}
                      codigoInstrumento={agendaMes.codigo}
                      nomeInstrumento={agendaMes.nome}
                      agendadoPara={agendaMes.agendadoPara}
                    />
                  )
                })
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

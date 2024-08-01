'use client'

import CalendarioEventos, { eventoCalendario } from "@/components/calendario/CalendarioEventos"
import { useQuery } from "@tanstack/react-query"
import { differenceInDays } from "date-fns"
import { Loader2 } from "lucide-react"
import { buscarAgendamentosEquipamento } from "../api/EquipamentoAPi"

export interface AgendaEquipamentoDialogProps {
  idEquipamento: string
}
export default function AgendaEquipoamentoView({
  idEquipamento
}: AgendaEquipamentoDialogProps) {
  const {
    data: agendaEquipamento,
    isLoading
  } = useQuery({
    queryKey: ['agendaInspecaoEquipamento', idEquipamento],
    queryFn: () => buscarAgendamentosEquipamento({ idEquipamento })
  })

  const eventos: eventoCalendario = agendaEquipamento?.map((agendamento) => {

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
        title: 'Inspeção realizada',
        display: 'auto',
        backgroundColor: '#168821',
        textColor: '#fff',
        borderColor: '#168821',
        color: '#168821',
      }
    }
    else if (!agendamento.inspecaoRealizada && diferencaDias < 30 && diferencaDias > 0) {
      return {
        id: String(agendamento.id),
        allDay: true,
        start: new Date(agendamento.agendadoPara),
        title: 'Inspeção próxima',
        display: 'auto',
        backgroundColor: '#ffcd07',
        textColor: '#000',
        borderColor: '#ffcd07',
        color: '#fff'
      }
    }
    else if (!agendamento.inspecaoRealizada && diferencaDias >= 30) {

      return {
        id: String(agendamento.id),
        allDay: true,
        start: new Date(agendamento.agendadoPara),
        title: 'Inspeção agendada',
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
        title: 'Inspeção atrasada',
        display: 'auto',
        backgroundColor: '#E52207',
        textColor: '#fff',
        borderColor: '#E52207',
        color: '#E52207'
      }
    }
  }) ?? []


  return (
    isLoading ? (
      <div className="flex-1 justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16" />
      </div>
    ) : (
      <CalendarioEventos eventos={eventos} />
    )
  )
}
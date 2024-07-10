'use client'

import CalendarioEventos from "@/components/calendario/CalendarioEventos"
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

  const eventos: Array<{
    id: string
    allDay: boolean
    start: Date | string
    title: string
    display:
    | 'auto'
    | 'block'
    | 'list-item'
    | 'background'
    | 'inverse-background'
    | 'none'
    backgroundColor?: string
    textColor: string
    borderColor: string
    color?: string
  }> | undefined = agendaEquipamento?.map((agendamento) => {

    const diferencaDias = differenceInDays(new Date(agendamento.agendadoPara), new Date())

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
  })


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
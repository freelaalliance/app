import ptbrLocale from '@fullcalendar/core/locales/pt-br'
import dayGridPlugin from '@fullcalendar/daygrid'
import FullCalendar from '@fullcalendar/react'
import './styles/style.css'

export type eventoCalendario = Array<{
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
}>

interface CalendarioEventosProps {
  eventos: eventoCalendario
}

export default function CalendarioEventos({ eventos }: CalendarioEventosProps) {
  return (
    <FullCalendar
      height={'auto'}
      contentHeight={'auto'}
      themeSystem="bootstrap5"
      locale={ptbrLocale}
      headerToolbar={{ right: 'prev,next today' }}
      editable={false}
      selectable={false}
      selectMirror={false}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={eventos}
    />
  )
}

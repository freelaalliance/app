import Link from "next/link";
import { AgendaInspecoesEmpresa } from "../../schemas/InspecaoSchema";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface EventoInspecaoProps {
  evento: AgendaInspecoesEmpresa
}

export function ListaEventoInspecoesEmpresa({ evento }: EventoInspecaoProps) {

  const diferencaDias = differenceInDays(new Date(evento.agendadoPara), new Date())

  let statusInspecao: string

  if (!evento.inspecaoRealizada && (diferencaDias < evento.equipamento.frequencia && diferencaDias > 0)) {
    statusInspecao = 'Inspeção à ser realizada'
  }
  else if (!evento.inspecaoRealizada && diferencaDias >= evento.equipamento.frequencia) {
    statusInspecao = 'Inspeção agendada'
  }
  else if (evento.inspecaoRealizada) {
    statusInspecao = 'Inspeção realizada'
  }
  else{
    statusInspecao = 'Inspeção atrasada'
  }

  let idModulo = null

  if (typeof window !== 'undefined') {
    idModulo = localStorage.getItem('modulo')
  }

  return (
    <div className="flex items-start gap-4 bg-zinc-100 hover:bg-zinc-200 transition-all delay-100 px-4 py-2 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{statusInspecao}</div>
          <div className="text-sm text-muted-foreground capitalize">{
            format(new Date(evento.agendadoPara), 'PP', {
              locale: ptBR,
            })
          }</div>
        </div>
        <p className="text-sm text-muted-foreground">
          {
            `${evento.equipamento.codigo} - ${evento.equipamento.nome}`
          }
        </p>
        <Link href={`${idModulo}/equipamento?id=${evento.equipamento.id}&nome=${evento.equipamento.nome}`} className="text-primary hover:underline" prefetch={false}>
          Inspecionar
        </Link>
      </div>
    </div>
  )
}
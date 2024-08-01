import { Skeleton } from "@/components/ui/skeleton"
import { ElementType } from "react"

interface IndicadorInformativoProps {
  titulo: string
  info: number | string
  icon?: ElementType
  carregandoInformacao: boolean
}

export function IndicadorInformativo({ titulo, info, icon: Icon, carregandoInformacao }: IndicadorInformativoProps) {
  return (
    <div className="grid rounded space-y-1 px-4 py-4 shadow-lg w-full select-none bg-slate-50">
      {carregandoInformacao ? (
        <Skeleton className="h-10 w-10" />
      ) : (
        <b className="text-4xl">
          {info}
        </b>
      )}
      <div className="flex flex-row justify-between items-center">
        {
          carregandoInformacao ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <span className="text-sm">
              {titulo}
            </span>
          )
        }
        {Icon && <Icon className="h-8 w-8 text-muted" />}
      </div>
    </div>
  )
}
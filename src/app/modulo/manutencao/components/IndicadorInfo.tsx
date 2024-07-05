interface IndicadorInformativoProps {
  titulo: string
  info: number | string
}

export function IndicadorInformativo({ titulo, info }: IndicadorInformativoProps) {
  return (
    <div className="grid rounded space-y-1 pl-4 py-2 shadow-lg w-full select-none">
      <b className="text-4xl">
        {info}
      </b>
      <span className="text-sm capitalize">
        {titulo}
      </span>
    </div>
  )
}
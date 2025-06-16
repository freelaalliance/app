import type { ElementType } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface IndicadorInformativoProps {
  titulo: string
  info: number | string
  subtitulo?: string
  icon?: ElementType
  carregandoInformacao: boolean
}

export function IndicadorInformativo({
  titulo,
  info,
  subtitulo,
  icon: Icon,
  carregandoInformacao,
}: IndicadorInformativoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {carregandoInformacao ? (
          <Skeleton className="h-10 w-10" />
        ) : (
          <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
        )}
        {
          Icon && (<Icon className={cn(
            'h-8 w-8 text-muted',
            carregandoInformacao ? 'hidden' : 'flex'
          )} />)
        }
      </CardHeader>

      {carregandoInformacao ? (
        <CardContent className='space-y-2'>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-2 w-48 text-muted-foreground" />
        </CardContent>
      ) : (
        <CardContent className='space-y-1'>
          <div className="text-2xl font-bold">{info}</div>
          <p className="text-sm text-muted-foreground">{subtitulo}</p>
        </CardContent>
      )}
    </Card>
  )
}

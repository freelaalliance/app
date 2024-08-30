import { ElementType } from 'react'

import { cn } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card'

interface cardProps {
  titulo: string
  subtitulo: string
  informacao: string | number
  className?: string
  icon?: ElementType
}

export function CardInfo({
  titulo,
  subtitulo,
  informacao,
  className,
  icon: Icon,
}: cardProps) {
  return (
    <Card
      className={cn(
        'w-64 border-0 shadow-md text-muted dark:text-white bg-padrao-gray-100 dark:shadow-none dark:bg-muted md:w-full',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm md:text-lg font-medium">
          {titulo}
        </CardTitle>
        {Icon && <Icon className="h-8 w-8" />}
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold">{informacao}</div>
        <p className="text-sm md:text-md dark:text-white">{subtitulo}</p>
      </CardContent>
    </Card>
  )
}

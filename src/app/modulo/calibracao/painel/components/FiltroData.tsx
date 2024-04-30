'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface filtroDataProps {
  tituloCampo: string
  className?: React.HTMLAttributes<HTMLDivElement>
  rangeData: DateRange | undefined
  selecionarDatas: (range: DateRange | undefined) => void
}

export function FiltroData({
  tituloCampo,
  className,
  rangeData,
  selecionarDatas,
}: filtroDataProps) {
  const useIdFiltro = React.useId()

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={useIdFiltro}
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal',
              !rangeData && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {rangeData?.from ? (
              rangeData.to ? (
                <>
                  {format(rangeData.from, 'LLL dd, y', {
                    locale: ptBR,
                  })}{' '}
                  -{' '}
                  {format(rangeData.to, 'LLL dd, y', {
                    locale: ptBR,
                  })}
                </>
              ) : (
                format(rangeData.from, 'LLL dd, y', {
                  locale: ptBR,
                })
              )
            ) : (
              <span>{tituloCampo}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={rangeData?.from}
            selected={rangeData}
            onSelect={selecionarDatas}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

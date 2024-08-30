'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, FileBarChart2, Loader2 } from 'lucide-react'
import React from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { gerarRelatorioCalibracaoExcel } from '../api/DadosRelatorioApi'

export function FormularioRelatorio() {
  const schemaFiltroRelatorio = z.object({
    codigoInstrumento: z.coerce.string().optional(),
    localizacaoInstrumento: z.coerce.string().optional(),
    status: z.coerce.string().optional(),
  })

  type formularioFiltrosRelatorioType = z.infer<typeof schemaFiltroRelatorio>

  const formularioFiltro = useForm<formularioFiltrosRelatorioType>({
    resolver: zodResolver(schemaFiltroRelatorio),
  })

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  })

  async function onSubmit(data: formularioFiltrosRelatorioType) {
    try {
      const file = await gerarRelatorioCalibracaoExcel({
        ...data,
        calibradoDe: date?.from,
        calibradoAte: date?.to,
      })

      toast.success('Relatorio gerado com sucesso!', {
        closeButton: true,
        action: {
          label: 'Clique para baixar',
          onClick: () => {
            const url = window.URL.createObjectURL(file)
            const a = document.createElement('a')
            a.href = url
            a.download = 'relatório-final.xlsx'
            a.click()
          },
        },
      })

      formularioFiltro.reset()
    } catch (e) {
      toast.error('Não foi possível gerar o relatório, tente novamente!')
    }
  }

  return (
    <Form {...formularioFiltro}>
      <form onSubmit={formularioFiltro.handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-2">
          <FormField
            control={formularioFiltro.control}
            name="codigoInstrumento"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Código do instrumento" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={formularioFiltro.control}
            name="localizacaoInstrumento"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Localização do instrumento" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={formularioFiltro.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status de calibração" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="reprovado">Reprovado</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormItem>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dataCalibracoes"
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-normal w-full md:w-auto',
                    !date && 'text-muted-foreground',
                  )}
                  title="Calibrações realizados de"
                >
                  <CalendarIcon className="mr-2 h-4 w-auto" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y', {
                          locale: ptBR,
                        })}{' '}
                        -{' '}
                        {format(date.to, 'LLL dd, y', {
                          locale: ptBR,
                        })}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y', {
                        locale: ptBR,
                      })
                    )
                  ) : (
                    <span>Data da calibração</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full" align="center">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </FormItem>

          {formularioFiltro.formState.isSubmitting ? (
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 gap-2 hover:bg-sky-700"
              disabled
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </Button>
          ) : (
            <Button
              type="submit"
              className="shadow-md text-sm uppercase leading-none text-white bg-sky-600 hover:bg-sky-700 gap-2 rounded"
            >
              <FileBarChart2 className="h-4 w-4" />
              Gerar relatorio
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

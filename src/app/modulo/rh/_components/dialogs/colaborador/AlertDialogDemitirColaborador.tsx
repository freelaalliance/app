'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, UserX } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useDemitirColaborador } from '../../../_hooks/colaborador/useContratacaoColaborador'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'

const demitirColaboradorSchema = z.object({
  demitidoEm: z.date({
    required_error: 'Data de demissão é obrigatória',
  }),
})

type FormularioDemitirColaboradorData = z.infer<typeof demitirColaboradorSchema>

interface AlertDialogDemitirColaboradorProps {
  contratacao: Contratacao
  children?: React.ReactNode
  onSuccess?: () => void
}

export function AlertDialogDemitirColaborador({
  contratacao,
  children,
  onSuccess,
}: AlertDialogDemitirColaboradorProps) {
  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const { mutateAsync: demitirColaborador, isPending } = useDemitirColaborador()

  const form = useForm<FormularioDemitirColaboradorData>({
    resolver: zodResolver(demitirColaboradorSchema),
    defaultValues: {
      demitidoEm: new Date(),
    },
  })

  const onSubmit = async (data: FormularioDemitirColaboradorData) => {
    try {
      await demitirColaborador({
        id: contratacao.id,
        data: {
          dataDemissao: data.demitidoEm.toISOString(),
        },
      })

      toast.success('Colaborador demitido com sucesso!')
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao demitir colaborador:', error)
      toast.error('Erro ao demitir colaborador. Tente novamente.')
    }
  }

  const handleCancel = () => {
    form.reset()
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="destructive" size="sm">
            <UserX className="h-4 w-4 mr-2" />
            Demitir
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <UserX className="h-5 w-5" />
            Confirmar Demissão
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Você está prestes a demitir o colaborador{' '}
              <strong>{contratacao.colaborador.pessoa.nome}</strong>.
            </p>
            <p className="text-destructive font-medium">
              ⚠️ Uma vez demitido, o colaborador não poderá ser readmitido através do sistema.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="demitidoEm"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Demissão</FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            field.value.toLocaleDateString('pt-BR')
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setCalendarOpen(false)
                        }}
                        disabled={(date) =>
                          date < new Date(contratacao.admitidoEm) || date > new Date()
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="gap-2 pt-4">
              <AlertDialogCancel onClick={handleCancel} disabled={isPending}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPending ? 'Demitindo...' : 'Confirmar Demissão'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

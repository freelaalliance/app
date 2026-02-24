'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import UploadForm from '../../../../documentos/[id]/novo/_components/upload/upload-documentos'
import { useFinalizarTreinamento } from '../../../_hooks/colaborador/useTreinamentosColaborador'
import type { TreinamentoRealizado } from '../../../_types/colaborador/ContratacaoType'

const finalizarTreinamentoSchema = z.object({
  finalizadoEm: z.coerce.date({
    required_error: 'Data de finalização é obrigatória',
  }),
  certificado: z.string(),
  iniciadoEmConfirmado: z.coerce.date({
    required_error: 'Confirme a data de início do treinamento',
  }),
})

type FinalizarTreinamentoFormData = z.infer<typeof finalizarTreinamentoSchema>

interface DialogFinalizarTreinamentoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  treinamento: TreinamentoRealizado | null
}

export function DialogFinalizarTreinamento({
  open,
  onOpenChange,
  treinamento,
}: DialogFinalizarTreinamentoProps) {
  const finalizarTreinamento = useFinalizarTreinamento()
  const [certificadoUrl, setCertificadoUrl] = useState<string>('')
  const [arquivoAnexado, setArquivoAnexado] = useState(false)

  const form = useForm<FinalizarTreinamentoFormData>({
    resolver: zodResolver(finalizarTreinamentoSchema),
    defaultValues: {
      finalizadoEm: new Date(),
      certificado: '',
      iniciadoEmConfirmado: treinamento?.iniciadoEm ? new Date(treinamento.iniciadoEm) : new Date(),
    },
  })

  const handleUploadSuccess = (uuid: string, keyCompleta: string) => {
    setCertificadoUrl(keyCompleta)
    form.setValue('certificado', keyCompleta)
  }

  const handleSubmit = (data: FinalizarTreinamentoFormData) => {
    if (!treinamento?.id) return

    finalizarTreinamento.mutate(
      {
        id: treinamento.id,
        data: {
          finalizadoEm: data.finalizadoEm,
          certificado: certificadoUrl || undefined,
          iniciadoEmConfirmado: data.iniciadoEmConfirmado
        },
      },
      {
        onSuccess: () => {
          toast.success('Treinamento finalizado com sucesso!')
          onOpenChange(false)
          handleReset()
        },
        onError: (error: unknown) => {
          console.error('Erro ao finalizar treinamento:', error)
          toast.error('Erro ao finalizar treinamento. Tente novamente.')
        },
      }
    )
  }

  const handleReset = () => {
    form.reset()
    setCertificadoUrl('')
    setArquivoAnexado(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    handleReset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Treinamento</DialogTitle>
          <DialogDescription>
            Complete as informações para finalizar o treinamento de{' '}
            <strong>{treinamento?.treinamento?.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="iniciadoEmConfirmado"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Confirme a Data de Início</FormLabel>
                  <Popover>
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
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout="dropdown"
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="finalizadoEm"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Finalização</FormLabel>
                  <Popover>
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
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout="dropdown"
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certificado"
              render={() => (
                <FormItem>
                  <FormLabel>Certificado (opcional)</FormLabel>
                  <FormControl>
                    <UploadForm
                      prefixo={`certificados/treinamento_${treinamento?.id}`}
                      onUploadSuccess={handleUploadSuccess}
                      arquivoSelecionado={setArquivoAnexado}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={finalizarTreinamento.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {finalizarTreinamento.isPending ? 'Finalizando...' : 'Finalizar Treinamento'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

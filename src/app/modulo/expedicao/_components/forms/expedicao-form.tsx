'use client'

import type { ItemAvaliacaoExpedicaoEmpresaType } from '@/app/modulo/administrativo/modulos/_api/AdmVendas'
import type { VendasCliente } from '@/app/modulo/vendas/_schemas/vendas.schema'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { enviarExpedicao } from '../../_api/expedicao'

export interface FormularioExpedicaoProps {
  dadosVenda: VendasCliente
  itensAvaliacaoExpedicao: Array<ItemAvaliacaoExpedicaoEmpresaType>
}

export const expedicaoSchema = z.object({
  recebidoEm: z.coerce.date({
    errorMap: () => ({ message: 'Data de recebimento inválida' }),
  }),
  vendasId: z.string().uuid({ message: 'Venda inválida' }),
  itensAvaliacao: z
    .array(
      z.object({
        itensAvaliacaoExpedicaoId: z.coerce.number(),
        nota: z.coerce.number().min(0, 'Nota deve ser igual ou maior que zero').max(100, 'Nota deve ser igual ou menor que 100'),
      })
    )
    .min(1, 'É necessário avaliar pelo menos um item.'),
})

export type ExpedicaoFormData = z.infer<typeof expedicaoSchema>

export function FormularioExpedicao({ dadosVenda, itensAvaliacaoExpedicao }: FormularioExpedicaoProps) {

  const queryClient = useQueryClient()
  const form = useForm<ExpedicaoFormData>({
    resolver: zodResolver(expedicaoSchema),
    defaultValues: {
      recebidoEm: new Date(),
      vendasId: dadosVenda.id,
      itensAvaliacao: itensAvaliacaoExpedicao.map(item => ({
        itensAvaliacaoExpedicaoId: item.id,
      })),
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: 'itensAvaliacao',
  })

  const dataExpedicao = (date: Date) => {
    if (dadosVenda) {
      return date < new Date(dadosVenda.dataCadastro) || date > new Date()
    }
    return date > new Date()
  }

  const { mutate: submitExpedicao } = useMutation({
    mutationFn: enviarExpedicao,
    onSuccess: () => {
      toast.success('Expedição registrada com sucesso!')
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['vendas-pendentes-expedicao'] })
    },
    onError: () => {
      toast.error('Erro ao enviar expedição')
    },
  })

  async function onSubmit(data: ExpedicaoFormData) {
    await submitExpedicao(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="recebidoEm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da expedição</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full  text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PP', {
                          locale: ptBR,
                        })
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
                    onSelect={field.onChange}
                    disabled={dataExpedicao}
                    locale={ptBR}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4">
          <h3 className="font-medium">Avaliação dos Itens</h3>
          <ScrollArea className="max-h-[200px] md:max-h-96 overflow-auto p-2 w-full">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`itensAvaliacao.${index}.nota`}
                render={({ field: notaField }) => (
                  <FormItem>
                    <FormLabel>{itensAvaliacaoExpedicao[index].pergunta}</FormLabel>
                    <FormControl>
                      <Input {...notaField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                form.reset()
              }}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="shadow-md text-sm uppercase leading-none rounded "
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

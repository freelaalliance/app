import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDays, addMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import {
  type FornecedoresEmpresaType,
  salvarNovaAvaliacao,
} from '../(api)/FornecedorApi'
import { schemaAvaliacaoFornecedor } from '../../../(schemas)/fornecedores/schema-fornecedor'
import type { NovaAvaliacaoCriticoProps } from '../components/dialogs/NovaAvaliacaoCriticoDialog'

export type FormularioNovaAvaliacao = z.infer<typeof schemaAvaliacaoFornecedor>

export default function NovaAvaliacaoCriticoView({
  idFornecedor,
}: NovaAvaliacaoCriticoProps) {
  const queryClient = useQueryClient()

  const formNovaAvaliacao = useForm<FormularioNovaAvaliacao>({
    resolver: zodResolver(schemaAvaliacaoFornecedor),
    defaultValues: {
      idFornecedor,
      aprovado: false,
      critico: false,
      nota: 0,
      validade: addDays(new Date(), 1),
    },
    mode: 'onChange',
  })

  const { mutateAsync: novaAvaliacao } = useMutation({
    mutationFn: salvarNovaAvaliacao,
    onError: error => {
      toast.error('Erro ao salvar a avaliação, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: (data, dados) => {
      if (data.status) {
        queryClient.refetchQueries({
          queryKey: ['estatisticasAvaliacoesCritico', idFornecedor],
          exact: true,
        })

        const listaFornecedores: undefined | FornecedoresEmpresaType[] =
          queryClient.getQueryData(['fornecedoresEmpresa'])

        queryClient.setQueryData(
          ['fornecedoresEmpresa'],
          listaFornecedores?.map(fornecedor => {
            if (fornecedor.id === idFornecedor) {
              return {
                ...fornecedor,
                aprovado: dados.aprovado,
                critico: dados.critico,
              }
            }
            return fornecedor
          })
        )

        formNovaAvaliacao.reset()

        toast.success(data.msg)
      } else {
        toast.warning(data.msg)
      }
    },
  })

  async function onSubmitAvaliacao(data: FormularioNovaAvaliacao) {
    await novaAvaliacao(data)
  }

  return (
    <section>
      <Form {...formNovaAvaliacao}>
        <form
          onSubmit={formNovaAvaliacao.handleSubmit(onSubmitAvaliacao)}
          className="space-y-4"
        >
          <FormField
            control={formNovaAvaliacao.control}
            name="critico"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={value => {
                      if (value) {
                        formNovaAvaliacao.setValue('aprovado', false)
                        formNovaAvaliacao.trigger('aprovado')
                      } else {
                        formNovaAvaliacao.setValue('aprovado', true)
                        formNovaAvaliacao.trigger('aprovado')
                      }
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Fornecedor crítico</FormLabel>
                  <FormDescription>
                    {
                      'Selecione essa opção se o fornecedor necessita passar por uma avaliação'
                    }
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={formNovaAvaliacao.control}
            name="aprovado"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Fornecedor aprovado</FormLabel>
                  <FormDescription>
                    {
                      'Selecione essa opção se a avaliação do fornecedor for aprovado'
                    }
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={formNovaAvaliacao.control}
              name={'nota'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nota da avaliação</FormLabel>
                  <FormControl>
                    <Input placeholder="0-100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formNovaAvaliacao.control}
              name="validade"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-[0.5px] mt-[9.2px]">
                    Validade da avaliação
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[300px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', {
                              locale: ptBR,
                            })
                          ) : (
                            <span>Selecione</span>
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
                        disabled={(date: Date) => date <= new Date()}
                        locale={ptBR}
                        captionLayout="dropdown"
                        endMonth={addMonths(new Date(), 100)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  formNovaAvaliacao.reset()
                }}
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
              disabled={formNovaAvaliacao.formState.isSubmitting}
            >
              {formNovaAvaliacao.formState.isSubmitting
                ? 'Salvando...'
                : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </section>
  )
}

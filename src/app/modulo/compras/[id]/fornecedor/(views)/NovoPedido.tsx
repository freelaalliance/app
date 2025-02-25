'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { salvarNovoPedido } from '../(api)/ComprasApi'
import { getNumOrder } from '../utils/pedido-util'

const schemaFormNovoPedido = z.object({
  fornecedorId: z.string().uuid(),
  permiteEntregaParcial: z.boolean().default(false),
  prazoEntrega: z.coerce.date({
    required_error: 'Obrigatório informar o prazo de entrega',
  }),
  condicoesEntrega: z.string().optional(),
  codigo: z.string({
    required_error: 'Obrigatório informar o código do pedido',
  }),
  itens: z.array(
    z.object({
      descricao: z.string({
        required_error: 'Obrigatório informar a descrição do item',
      }),
      quantidade: z.coerce
        .number({
          required_error: 'Obrigatório informar a quantidade do item',
        })
        .min(1, {
          message: 'A quantidade do item deve ser no mínimo 1',
        }),
    })
  ),
})

export type formNovoPedidoType = z.infer<typeof schemaFormNovoPedido>

export interface NovoPedidoProps {
  fornecedorId: string
}

export default function NovoPedidoView({ fornecedorId }: NovoPedidoProps) {
  const router = useRouter()
  const formPedido = useForm<formNovoPedidoType>({
    resolver: zodResolver(schemaFormNovoPedido),
    defaultValues: {
      fornecedorId,
      permiteEntregaParcial: false,
      condicoesEntrega: '',
      prazoEntrega: addDays(new Date(), 1),
      codigo: getNumOrder(),
      itens: [
        {
          descricao: '',
          quantidade: 1,
        },
      ],
    },
    mode: 'onChange',
  })

  const {
    fields: itens,
    append: adicionarItem,
    remove: removerItem,
  } = useFieldArray({
    control: formPedido.control,
    name: 'itens',
  })

  const { mutateAsync: novoPedido } = useMutation({
    mutationFn: salvarNovoPedido,
    onError: error => {
      toast.error('Erro ao salvar o pedido, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: data => {
      if (data.status) {
        toast.success(data.msg, {
          action: {
            onClick: () => {
              router.push(
                `pedido/${data.dados?.id}/visualizar?codigo=${data.dados?.codigo}`
              )
            },
            label: 'Visualizar pedido',
          },
        })
      } else {
        toast.warning(data.msg)
      }
    },
  })

  const submitNovoPedido = async (data: formNovoPedidoType) => {
    await novoPedido(data)
  }

  return (
    <Form {...formPedido}>
      <form
        className="space-y-4"
        onSubmit={formPedido.handleSubmit(submitNovoPedido)}
      >
        <div className="grid space-y-2">
          <div className="grid gap-2">
            <FormField
              control={formPedido.control}
              name="prazoEntrega"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo de entrega</FormLabel>
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
                    <PopoverContent className="w-auto h-full p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={formPedido.control}
            name="permiteEntregaParcial"
            render={({ field }) => (
              <FormItem className="flex flex-row-reverse items-center justify-end rounded-lg border p-3 shadow-sm gap-4">
                <div className="space-y-0.5">
                  <FormLabel>Entrega parcial</FormLabel>
                  <FormDescription className="select-none">
                    Ao selecionar esse campo o fornecedor poderá fazer a entrega
                    deste pedido parcialmente
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={formPedido.control}
            name="condicoesEntrega"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Esse pedido tem que ser entregue até às 15hs"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="select-none">
                  Adicione informações relevantes sobre o pedido ou até mesmo as
                  condições para entrega do pedido
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>Itens do pedido</CardTitle>
                <CardDescription>
                  Adicione os itens no pedido que o fornecedor deverá entregar
                </CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size={'icon'}
                    className="shadow bg-padrao-gray-250 hover:bg-gray-900 "
                    onClick={() =>
                      adicionarItem({
                        descricao: '',
                        quantidade: 1,
                      })
                    }
                  >
                    <Plus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Adicione um novo item ao pedido</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[200px] md:max-h-96 overflow-auto">
                {itens.map((item, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    className="flex flex-col md:flex-row py-2 md:p-4 md:rounded md:transition-all md:hover:bg-accent gap-2"
                  >
                    <FormField
                      key={`${item.id}-descricao`}
                      control={formPedido.control}
                      name={`itens.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input {...field} placeholder="Descrição do item" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-row gap-2">
                      <FormField
                        key={`${item.id}-quantidade`}
                        control={formPedido.control}
                        name={`itens.${index}.quantidade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="shadow bg-padrao-red hover:bg-red-800 "
                        size={'icon'}
                        onClick={() => removerItem(index)}
                        disabled={itens.length === 1}
                      >
                        <Minus className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                formPedido.reset()
              }}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
            disabled={formPedido.formState.isSubmitting}
          >
            {formPedido.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

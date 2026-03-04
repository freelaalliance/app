'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Check, Minus, Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import { cn, formatarDataBrasil } from '@/lib/utils'

import { useConfiguracoesCompras } from '@/hooks/useConfiguracao'
import { buscarItensVendidos, salvarNovoPedido } from '../(api)/ComprasApi'
import { getNumOrder } from '../utils/pedido-util'

const CONFIG_KEYS = {
  HABILITAR_FRETE: 'compras_habilitar_frete',
  HABILITAR_ARMAZENAMENTO: 'compras_habilitar_armazenamento',
  HABILITAR_LOCAL_ENTREGA: 'compras_habilitar_local_entrega',
  HABILITAR_FORMA_PAGAMENTO: 'compras_habilitar_forma_pagamento',
  HABILITAR_IMPOSTOS: 'compras_habilitar_impostos',
} as const

const schemaFormNovoPedido = z.object({
  fornecedorId: z.string().uuid(),
  permiteEntregaParcial: z.boolean().default(false),
  prazoEntrega: z.coerce.date({
    required_error: 'Obrigatório informar o prazo de entrega',
  }),
  frete: z.string().optional(),
  armazenamento: z.string().optional(),
  localEntrega: z.string().optional(),
  formaPagamento: z.string().optional(),
  imposto: z.string().optional(),
  condicoesEntrega: z.string().optional(),
  codigo: z.string({
    required_error: 'Obrigatório informar o código do pedido',
  }),
  itens: z.array(
    z.object({
      unidade: z.string({
        required_error: 'Obrigatório informar a unidade do item',
      }),
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
  const queryClient = useQueryClient()
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null)

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
          unidade: '',
        },
      ],
    },
    mode: 'onChange',
  })

  const { configuracoes } = useConfiguracoesCompras()

  const { data: itensVendidos } = useQuery({
    queryKey: ['itensVendidos'],
    queryFn: buscarItensVendidos,
    select: (data) => (data.status ? data.dados : []),
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
        queryClient.invalidateQueries({
          queryKey: ['pedidosFornecedor', fornecedorId],
        })
        toast.success(data.msg, {
          action: {
            onClick: () => {
              router.push(
                `fornecedor/pedido/${data.dados?.id}/visualizar?codigo=${data.dados?.codigo}`
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
                            formatarDataBrasil(field.value, false, 'PP')
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
                        locale={ptBR}
                        captionLayout="dropdown"
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

          <ScrollArea className='max-h-60 p-4 space-y-4'>
            {configuracoes?.map((config) => {
              if (config.chave === CONFIG_KEYS.HABILITAR_FRETE && config.valor === 'true') {
                return (
                  <FormField
                    key={config.id}
                    control={formPedido.control}
                    name="frete"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frete</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informações sobre o frete deste pedido"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="select-none">
                          Adicione informações relevantes sobre o frete do pedido ou até mesmo as
                          condições para entrega do pedido
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              if (config.chave === CONFIG_KEYS.HABILITAR_ARMAZENAMENTO && config.valor === 'true') {
                return (
                  <FormField
                    key={config.id}
                    control={formPedido.control}
                    name="armazenamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Armazenamento</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Local de armazenamento após entrega"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="select-none">
                          Informe o local onde os itens serão armazenados após a entrega
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              if (config.chave === CONFIG_KEYS.HABILITAR_LOCAL_ENTREGA && config.valor === 'true') {
                return (
                  <FormField
                    key={config.id}
                    control={formPedido.control}
                    name="localEntrega"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local de Entrega</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Endereço ou local de entrega do pedido"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="select-none">
                          Especifique o endereço ou local onde o pedido deve ser entregue
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              if (config.chave === CONFIG_KEYS.HABILITAR_FORMA_PAGAMENTO && config.valor === 'true') {
                return (
                  <FormField
                    key={config.id}
                    control={formPedido.control}
                    name="formaPagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Condições de pagamento do pedido"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="select-none">
                          Descreva as condições e forma de pagamento acordadas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              if (config.chave === CONFIG_KEYS.HABILITAR_IMPOSTOS && config.valor === 'true') {
                return (
                  <FormField
                    key={config.id}
                    control={formPedido.control}
                    name="imposto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impostos</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informações sobre impostos e tributos"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="select-none">
                          Adicione informações sobre impostos aplicáveis a este pedido
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              return null
            })}
          </ScrollArea>

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
                        unidade: '',
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
                    className="flex flex-col md:flex-row py-2 md:p-4 md:rounded gap-2"
                  >
                    <FormField
                      key={`${item.id}-descricao`}
                      control={formPedido.control}
                      name={`itens.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <div className="flex gap-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Descrição do item"
                                autoComplete="off"
                              />
                            </FormControl>
                            <Popover
                              open={openPopoverIndex === index}
                              onOpenChange={(open) =>
                                setOpenPopoverIndex(open ? index : null)
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="shrink-0"
                                >
                                  <Search className="size-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0" align="end">
                                <Command>
                                  <CommandInput placeholder="Buscar item vendido..." />
                                  <CommandList>
                                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                                    <CommandGroup>
                                      {itensVendidos?.map((itemVendido) => (
                                        <CommandItem
                                          key={itemVendido}
                                          value={itemVendido}
                                          onSelect={() => {
                                            formPedido.setValue(
                                              `itens.${index}.descricao`,
                                              itemVendido
                                            )
                                            setOpenPopoverIndex(null)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 size-4',
                                              field.value === itemVendido
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {itemVendido}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      key={`${item.id}-unidade`}
                      control={formPedido.control}
                      name={`itens.${index}.unidade`}
                      render={({ field }) => (
                        <FormItem className="w-1/4">
                          <FormControl>
                            <Input {...field} placeholder="Unidade do item" />
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
            className="shadow-md text-sm uppercase leading-none rounded "
            disabled={formPedido.formState.isSubmitting}
          >
            {formPedido.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

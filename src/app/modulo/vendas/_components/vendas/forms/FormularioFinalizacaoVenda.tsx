'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getNumOrder } from '@/app/modulo/compras/[id]/fornecedor/utils/pedido-util'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useConfiguracoesCompras } from '@/hooks/useConfiguracao'
import { axiosInstance } from '@/lib/AxiosLib'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { ItemCarrinhoType } from '../../../_types/venda'

const CONFIG_KEYS = {
  HABILITAR_FRETE: 'vendas_habilitar_frete',
  HABILITAR_ARMAZENAMENTO: 'vendas_habilitar_armazenamento',
  HABILITAR_LOCAL_ENTREGA: 'vendas_habilitar_local_entrega',
  HABILITAR_FORMA_PAGAMENTO: 'vendas_habilitar_forma_pagamento',
  HABILITAR_IMPOSTOS: 'vendas_habilitar_impostos',
} as const

const expeditionSchema = z.object({
  id: z.string().uuid(),
  prazoEntrega: z.coerce.date(),
  frete: z.string().optional(),
  armazenamento: z.string().optional(),
  localEntrega: z.string().optional(),
  formaPagamento: z.string().optional(),
  imposto: z.string().optional(),
  condicoesEntrega: z.string().optional(),
  permiteEntregaParcial: z.boolean(),
  observacao: z.string().optional(),
  itens: z.array(
    z.object({
      produtosServicosId: z.string().uuid(),
      quantidade: z.number().min(1),
    })
  ),
})

type VendaFormType = z.infer<typeof expeditionSchema>

interface ExpeditionFormProps {
  idCliente: string
  itens: Array<ItemCarrinhoType>
  vendaRealizada: () => void
}

export function FormularioVendaCliente({
  idCliente,
  itens,
  vendaRealizada
}: ExpeditionFormProps) {
  const router = useRouter()
  const formVenda = useForm<VendaFormType>({
    resolver: zodResolver(expeditionSchema),
    defaultValues: {
      prazoEntrega: addDays(new Date(), 1),
      permiteEntregaParcial: false,
      observacao: '',
      itens: itens.map(item => ({
        produtosServicosId: item.id,
        quantidade: item.quantidade,
      })),
      id: idCliente,
    },
  })

  const { configuracoes } = useConfiguracoesCompras()

  const mutation = useMutation({
    mutationFn: async (data: VendaFormType) => {
      const response = await axiosInstance.post(`/vendas/cliente/${data.id}`, {
        itens: data.itens,
        condicoes: data.observacao,
        prazoEntrega: data.prazoEntrega,
        permiteEntregaParcial: data.permiteEntregaParcial,
        codigo: getNumOrder()
      })
      return response.data
    },
    onSuccess: ({ dados }) => {
      toast.success('Venda registrada com sucesso!', {
        action: {
          onClick: () => {
            router.push(
              `/modulo/vendas/visualizar/${dados?.id}`
            )
          },
          label: 'Visualizar pedido',
        },
      })
      formVenda.reset()
      vendaRealizada()
    },
    onError: () => {
      toast.error('Erro ao salvar venda')
    },
  })

  function onSubmit(values: VendaFormType) {
    mutation.mutate(values)
  }

  return (
    <Form {...formVenda}>
      <form
        onSubmit={formVenda.handleSubmit(onSubmit)}
        className="space-y-4 py-4"
      >
        <FormField
          control={formVenda.control}
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
                    locale={ptBR}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formVenda.control}
          name="permiteEntregaParcial"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
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

        <ScrollArea className='max-h-60 p-4 space-y-4'>
          {configuracoes?.map((config) => {
            if (config.chave === CONFIG_KEYS.HABILITAR_FRETE && config.valor === 'true') {
              return (
                <FormField
                  key={config.id}
                  control={formVenda.control}
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
                  control={formVenda.control}
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
                  control={formVenda.control}
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
                  control={formVenda.control}
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
                  control={formVenda.control}
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

        <FormField
          control={formVenda.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="observations">Observações</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Esse pedido tem que ser entregue até às 15hs"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                formVenda.reset()
              }}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="shadow-md text-sm uppercase leading-none rounded "
            disabled={formVenda.formState.isSubmitting}
          >
            {formVenda.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

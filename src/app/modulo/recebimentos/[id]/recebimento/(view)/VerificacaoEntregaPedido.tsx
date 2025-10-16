'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Switch } from '@/components/ui/switch'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { cn, formatarDataBrasil } from '@/lib/utils'

import type { ItemAvaliacaoType } from '@/app/modulo/administrativo/modulos/_api/AdmCompras'
import { consultarPedido } from '@/app/modulo/compras/[id]/fornecedor/(api)/ComprasApi'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useRouter } from 'next/navigation'
import { inserirRecebimento } from '../../../_api/RelatorioRecebimentos'

const schemaVerificacaoEntrega = z.object({
  numeroCertificado: z.string().optional(),
  numeroNotaFiscal: z.string().optional(),
  pedidoRecebidoCompleto: z.coerce.boolean().default(true),
  dataRecebimento: z.coerce.date(),
  observacao: z.string().optional(),
  avaliacao: z.array(
    z.object({
      id: z.string().uuid(),
      descricao: z.string(),
      nota: z.coerce
        .number()
        .min(0, {
          message: 'O valor deve ser de no mínimo 0',
        })
        .max(100, {
          message: 'O valor deve ser de no máximo 100',
        })
        .default(0),
    })
  ),
})

interface VerificaEntregaPedidoProps {
  codigoPedido: string
  itensVerificacaoRecebimento: Array<ItemAvaliacaoType>
}

export type FormVerificacaoEntregaType = z.infer<
  typeof schemaVerificacaoEntrega
>

const NOTA_INICIAL_AVALIACAO_RECEBIMENTO_PERCENT: number = 100

export default function VerificaEntregaPedido({
  codigoPedido,
  itensVerificacaoRecebimento,
}: VerificaEntregaPedidoProps) {
  const route = useRouter()
  const dadosPedido = useQuery({
    queryKey: ['visualizarDadosPedido', codigoPedido],
    queryFn: () =>
      consultarPedido({
        codigoPedido,
      }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  const formularioVerificacaoEntrega = useForm<FormVerificacaoEntregaType>({
    resolver: zodResolver(schemaVerificacaoEntrega),
    defaultValues: {
      dataRecebimento: new Date(),
      pedidoRecebidoCompleto: !dadosPedido.data?.dados?.permiteEntregaParcial,
      numeroCertificado: '',
      numeroNotaFiscal: '',
      observacao: '',
      avaliacao: itensVerificacaoRecebimento.map(({ descricao, id }) => ({
        id,
        descricao,
        nota: NOTA_INICIAL_AVALIACAO_RECEBIMENTO_PERCENT,
      })),
    },
    mode: 'onChange',
  })

  const { fields: itens } = useFieldArray({
    control: formularioVerificacaoEntrega.control,
    name: 'avaliacao',
  })

  const limiteDataRecebimento = (date: Date) => {
    if (dadosPedido.data?.dados) {
      return (
        date < new Date(dadosPedido.data.dados.cadastro.dataCadastro) ||
        date > new Date()
      )
    }
    return date > new Date()
  }

  const { mutateAsync: salvarVerificacaoEntrega } = useMutation({
    mutationFn: inserirRecebimento,
    onSuccess: data => {
      if (data.status) {
        toast.success('Sucesso', {
          description: data.msg,
        })

        route.back()
      } else {
        toast.error('Falha ao salvar', {
          description: data.msg,
        })
      }
    },
    onError: error => {
      toast.error('Falha ao salvar', {
        description: error.message,
      })
    },
  })

  const handleSubmitVerificacaoEntrega = async (
    data: FormVerificacaoEntregaType
  ) => {
    await salvarVerificacaoEntrega({
      compraId: dadosPedido.data?.dados?.id || '',
      data,
    })
  }

  return dadosPedido.data?.dados?.recebido ? (
    <div className="flex flex-row justify-center items-center">
      <Alert>
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>Compra recebida e validada</AlertDescription>
      </Alert>
    </div>
  ) : (
    <section className="space-y-4 bg-padrao-white p-4 rounded">
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <div className="md:col-span-4">
          <Form {...formularioVerificacaoEntrega}>
            <form
              className="space-y-2"
              onSubmit={formularioVerificacaoEntrega.handleSubmit(
                handleSubmitVerificacaoEntrega
              )}
            >
              <FormField
                control={formularioVerificacaoEntrega.control}
                name="dataRecebimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da entrega</FormLabel>
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
                          className="border rounded-sm"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={limiteDataRecebimento}
                          locale={ptBR}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={formularioVerificacaoEntrega.control}
                  name={'numeroNotaFiscal'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° Nota fiscal</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formularioVerificacaoEntrega.control}
                  name={'numeroCertificado'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° Certificado</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={formularioVerificacaoEntrega.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações do recebimento</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Insira observações sobre o recebimento desta compra"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {dadosPedido.data?.dados?.permiteEntregaParcial && (
                <FormField
                  control={formularioVerificacaoEntrega.control}
                  name="pedidoRecebidoCompleto"
                  render={({ field }) => (
                    <FormItem className="flex flex-row-reverse items-center bg-padrao-white justify-end rounded-lg border p-3 shadow-sm gap-4">
                      <div className="space-y-0.5">
                        <FormLabel>Entregue completa?</FormLabel>
                        <FormDescription className="select-none">
                          Ao selecionar esse campo irá computar que o fornecedor
                          fez a entrega de todos os itens solicitados no pedido
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
              )}
              <ScrollArea className="max-h-[200px] md:max-h-96 overflow-auto">
                {itens.map((item, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    className="flex flex-col md:flex-row py-2 px-1"
                  >
                    <FormField
                      key={`${item.id}-avaliacao`}
                      control={formularioVerificacaoEntrega.control}
                      name={`avaliacao.${index}.nota`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>{`Nota ${item.descricao}`}</FormLabel>
                          <FormControl>
                            <Input placeholder="0-100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </ScrollArea>
              <div className="grid">
                <Button
                  type="submit"
                  className="shadow-md text-sm uppercase leading-none rounded "
                  disabled={formularioVerificacaoEntrega.formState.isSubmitting}
                >
                  {formularioVerificacaoEntrega.formState.isSubmitting
                    ? 'Salvando...'
                    : 'Salvar'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="md:col-span-4 space-y-2">
          <div className="space-y-2 border rounded px-4 py-2">
            <h3 className="font-medium text-lg">Dados do pedido</h3>
            <Separator />
            <ul>
              <li className="flex justify-between items-center gap-2">
                <strong>Num. do Pedido</strong>
                <span>{dadosPedido.data?.dados?.numPedido ?? ''}</span>
              </li>
              <li className="flex justify-between items-center gap-2">
                <strong>Data do Pedido</strong>
                <span>
                  {dadosPedido.data?.dados &&
                    formatarDataBrasil(
                      new Date(dadosPedido.data.dados.cadastro.dataCadastro),
                      true
                    )}
                </span>
              </li>
              <li className="flex justify-between items-center gap-2">
                <strong>Responsável</strong>
                <span>{dadosPedido.data?.dados?.cadastro.usuario ?? ''}</span>
              </li>
              <li className="flex justify-between items-center gap-2">
                <strong>Prazo para entrega </strong>
                <span>
                  {dadosPedido.data?.dados &&
                    formatarDataBrasil(
                      new Date(dadosPedido.data.dados.prazoEntrega),
                      false,
                      'PP'
                    )}
                </span>
              </li>
              <li className="flex justify-between items-center gap-2">
                <strong>Entrega parcial </strong>
                <span>{`${dadosPedido.data?.dados?.permiteEntregaParcial ? 'Sim' : 'Não'}`}</span>
              </li>
            </ul>

            {dadosPedido.data?.dados?.condicoesEntrega && (
              <>
                <Separator />
                <div className="flex flex-col gap-2">
                  <strong>Condições de entrega</strong>
                  <p className="whitespace-break-spaces">
                    {dadosPedido.data?.dados?.condicoesEntrega}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="rounded border max-h-[150px] md:max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto">#</TableHead>
                  <TableHead className="w-3/4">Descrição</TableHead>
                  <TableHead className="w-auto">Qtd.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosPedido.data?.dados?.itens.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                  </TableRow>
                )) ?? []}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

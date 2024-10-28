'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
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
import { Progress } from '@/components/ui/progress'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn, formatarDataBrasil } from '@/lib/utils'

import {
  consultarPedido,
  inserirRecebimento,
} from '../../fornecedor/(api)/ComprasApi'

const schemaVerificacaoEntrega = z.object({
  qtdIncorreta: z.coerce.boolean(),
  numeroCertificado: z.string().optional(),
  numeroNotaFiscal: z.string().optional(),
  dataRecebimento: z.coerce.date(),
  entregaAvarias: z.coerce.boolean(),
  pedidoRecebidoCompleto: z.coerce.boolean().default(true),
  notaRecebimento: z.number(),
})

interface VerificaEntregaPedidoProps {
  codigoPedido: string
}

export type FormVerificacaoEntregaType = z.infer<
  typeof schemaVerificacaoEntrega
>

const NOTA_INICIAL_AVALIACAO_RECEBIMENTO_PERCENT: number = 100

export default function VerificaEntregaPedido({
  codigoPedido,
}: VerificaEntregaPedidoProps) {
  const dadosPedido = useQuery({
    queryKey: ['visualizarDadosPedido', codigoPedido],
    queryFn: () =>
      consultarPedido({
        codigoPedido,
      }),
    staleTime: Infinity,
  })

  const formularioVerificacaoEntrega = useForm<FormVerificacaoEntregaType>({
    resolver: zodResolver(schemaVerificacaoEntrega),
    defaultValues: {
      qtdIncorreta: false,
      dataRecebimento: new Date(),
      pedidoRecebidoCompleto: !dadosPedido.data?.dados?.permiteEntregaParcial,
      notaRecebimento: NOTA_INICIAL_AVALIACAO_RECEBIMENTO_PERCENT,
    },
    mode: 'onChange',
  })

  const limiteDataRecebimento = (date: Date) => {
    if (dadosPedido.data && dadosPedido.data.dados) {
      return (
        date < new Date(dadosPedido.data.dados.cadastro.dataCadastro) ||
        date > new Date()
      )
    }
    return date > new Date()
  }

  const notaAvaliacao = useMemo(
    () => {
      let totalAvaliacao = NOTA_INICIAL_AVALIACAO_RECEBIMENTO_PERCENT

      if (dadosPedido.data && dadosPedido.data.dados) {
        const prazoEntrega = new Date(dadosPedido.data.dados.prazoEntrega)

        const qtdDiasAtraso = differenceInDays(
          new Date(
            prazoEntrega.getFullYear(),
            prazoEntrega.getMonth(),
            prazoEntrega.getDate() + 1,
          ),
          formularioVerificacaoEntrega.watch('dataRecebimento'),
        )

        if (qtdDiasAtraso > 0) {
          totalAvaliacao = totalAvaliacao - qtdDiasAtraso * 0.5
        }
      }

      if (
        !formularioVerificacaoEntrega.watch('numeroNotaFiscal') ||
        formularioVerificacaoEntrega.watch('numeroNotaFiscal') === ''
      ) {
        totalAvaliacao = totalAvaliacao - 0.5
      }

      if (
        !formularioVerificacaoEntrega.watch('numeroCertificado') ||
        formularioVerificacaoEntrega.watch('numeroCertificado') === ''
      ) {
        totalAvaliacao = totalAvaliacao - 1
      }

      if (formularioVerificacaoEntrega.watch('entregaAvarias')) {
        totalAvaliacao = totalAvaliacao - 1
      }

      if (formularioVerificacaoEntrega.watch('qtdIncorreta')) {
        totalAvaliacao = totalAvaliacao - 1
      }

      formularioVerificacaoEntrega.setValue('notaRecebimento', totalAvaliacao)

      return totalAvaliacao
    },
    formularioVerificacaoEntrega.watch([
      'dataRecebimento',
      'entregaAvarias',
      'numeroCertificado',
      'numeroCertificado',
      'qtdIncorreta',
    ]),
  )

  const { mutateAsync: salvarVerificacaoEntrega } = useMutation({
    mutationFn: inserirRecebimento,
    onSuccess: (data) => {
      if (data.status) {
        toast.success('Sucesso', {
          description: data.msg,
        })

        redirect('recebimento')
      } else {
        toast.error('Falha ao salvar', {
          description: data.msg,
        })
      }
    },
    onError: (error) => {
      toast.error('Falha ao salvar', {
        description: error.message,
      })
    },
  })

  const handleSubmitVerificacaoEntrega = async (
    data: FormVerificacaoEntregaType,
  ) => {
    await salvarVerificacaoEntrega({
      compraId:
        (dadosPedido.data &&
          dadosPedido.data.dados &&
          dadosPedido.data.dados.id) ||
        '',
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
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-row items-center gap-2">
            <Progress className="h-2" value={notaAvaliacao} />
            <span className="font-medium md:mb-1">{`${notaAvaliacao}%`}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-wrap text-sm font-medium max-w-screen-sm md:max-w-screen-md">
            {`A avaliação do pedido é baseada na pontuação dos demeritos (atraso, sem nota fiscal, sem certificado, avarias ou a quantidade incorretade itens do pedido). 
            A pontuação máxima é 100% e a pontuação dessa entrega é de ${notaAvaliacao}%.`}
          </p>
        </TooltipContent>
      </Tooltip>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <div className="md:col-span-4">
          <Form {...formularioVerificacaoEntrega}>
            <form
              className="space-y-2"
              onSubmit={formularioVerificacaoEntrega.handleSubmit(
                handleSubmitVerificacaoEntrega,
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
                              !field.value && 'text-muted-foreground',
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
                          disabled={limiteDataRecebimento}
                          locale={ptBR}
                          initialFocus
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
                name="entregaAvarias"
                render={({ field }) => (
                  <FormItem className="flex flex-row-reverse items-center bg-padrao-white justify-end rounded-lg border p-3 shadow-sm gap-4">
                    <div className="space-y-0.5">
                      <FormLabel>Avaria ou danificado?</FormLabel>
                      <FormDescription className="select-none">
                        Ao selecionar esse campo irá computar que o fornecedor
                        realizou a entrega de algum item com avaria ou
                        danificado
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
                control={formularioVerificacaoEntrega.control}
                name="qtdIncorreta"
                render={({ field }) => (
                  <FormItem className="flex flex-row-reverse items-center bg-padrao-white justify-end rounded-lg border p-3 shadow-sm gap-4">
                    <div className="space-y-0.5">
                      <FormLabel>Faltou algum item?</FormLabel>
                      <FormDescription className="select-none">
                        Ao selecionar esse campo irá computar que o fornecedor
                        realizou a entrega com a quantidade diferente do que
                        consta no pedido
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
              <div className="grid">
                <Button
                  type="submit"
                  className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
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
                  {dadosPedido.data &&
                    dadosPedido.data.dados &&
                    formatarDataBrasil(
                      new Date(dadosPedido.data.dados.cadastro.dataCadastro),
                      true,
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
                  {dadosPedido.data &&
                    dadosPedido.data.dados &&
                    formatarDataBrasil(
                      new Date(dadosPedido.data.dados.prazoEntrega),
                      false,
                      'PP',
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

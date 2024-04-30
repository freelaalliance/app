'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'

import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Upload } from '@/components/upload/upload'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ListaArquivo } from '@/components/upload/lista-arquivo'
import { cn } from '@/lib/utils'

import {
  consultarCodigoInstrumento,
  DadosInstrumentoType,
  salvarCalibracao,
} from '../../api/CalibracaoInstrumento'

import {
  calibracaoFormSchema,
  CalibracaoInstrumentoValores,
  valoresPadroes,
} from './schemas/SchemaNovaCalibracao'

export function NovaCalibracaoForm() {
  const [idInstrumento, setarIdInstrumento] = useState<string | null>(null)
  const [listaArquivoSelecionado, adicionaArquivo] = useState<Array<File>>([])

  const form = useForm<CalibracaoInstrumentoValores>({
    resolver: zodResolver(calibracaoFormSchema),
    defaultValues: valoresPadroes,
    mode: 'onChange',
  })

  function resetarFormulario() {
    adicionaArquivo([])
    setarIdInstrumento(null)
    form.reset()
  }

  async function onSubmit(data: CalibracaoInstrumentoValores) {
    if (listaArquivoSelecionado.length === 0) {
      toast.warning('Necessário adicionar o certificado da calibração!')
    } else {
      const respostaRequisicao = await salvarCalibracao(
        data,
        listaArquivoSelecionado[0],
      )

      if (respostaRequisicao.status) {
        toast.success(respostaRequisicao.msg)
        resetarFormulario()
      } else {
        toast.error(respostaRequisicao.msg)
      }
    }
  }

  async function verificarExisteInstrumento(codigoInstrumento: string) {
    const dadosInstrumento: DadosInstrumentoType | null =
      await consultarCodigoInstrumento(codigoInstrumento)

    if (dadosInstrumento) {
      form.setValue('nomeInstrumento', dadosInstrumento.nome)
      form.setValue('resolucao', dadosInstrumento.resolucao)
      form.setValue('marcaInstrumento', dadosInstrumento.marca)
      form.setValue('localizacaoInstrumento', dadosInstrumento.localizacao)
      form.setValue('frequenciaCalibracao', Number(dadosInstrumento.frequencia))
      form.setValue('repeticaoCalibracao', Number(dadosInstrumento.repeticao))

      setarIdInstrumento(dadosInstrumento.id)
    } else {
      form.setValue('nomeInstrumento', '')
      form.setValue('resolucao', '')
      form.setValue('marcaInstrumento', '')
      form.setValue('localizacaoInstrumento', '')
      form.setValue('frequenciaCalibracao', Number(1))
      form.setValue('repeticaoCalibracao', Number(0))

      setarIdInstrumento(null)
    }
  }

  useEffect(() => {
    if (form.watch('codigoInstrumento') !== '') {
      verificarExisteInstrumento(form.watch('codigoInstrumento'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('codigoInstrumento')])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <FormField
            control={form.control}
            name="codigoInstrumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo</FormLabel>
                <FormControl>
                  <Input placeholder="Codigo do instrumento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomeInstrumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do instrumento"
                    {...field}
                    disabled={!!idInstrumento}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormField
            control={form.control}
            name="resolucao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolução</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Resolução do instrumento"
                    {...field}
                    disabled={!!idInstrumento}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marcaInstrumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Marca do instrumento"
                    {...field}
                    disabled={!!idInstrumento}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="localizacaoInstrumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Localização do instrumento"
                    {...field}
                    disabled={!!idInstrumento}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FormField
            control={form.control}
            name="dataCalibracao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calibrado em...</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', {
                            locale: ptBR,
                          })
                        ) : (
                          <span>Selecione a data de calibração...</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={ptBR}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequenciaCalibracao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequencia de calibracao (Meses)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Frequencia de calibração"
                    itemType="number"
                    {...field}
                    disabled={!!idInstrumento}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeticaoCalibracao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetição</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Repetir essa calibração x vezes"
                    itemType="number"
                    {...field}
                    disabled={!!idInstrumento}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormField
            control={form.control}
            name="erroEncontrado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maior erro encontrado</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Maior erro encontrado"
                    itemType="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="incertezaTendenciaEncontrado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incerteza ou tendência encontrado</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Incerteza ou tendencia encontrado"
                    itemType="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tolerancia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tolerância estabelecida pela empresa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tolerância"
                    itemType="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observacaoCalibracao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observação da calibração do instrumento"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numeroCertificado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do certificado</FormLabel>
              <FormControl>
                <Input
                  placeholder="Número do certificado de calibração"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <Upload selecionaArquivo={adicionaArquivo} />
          {listaArquivoSelecionado.length > 0 && <Separator />}
          <ListaArquivo
            listaArquivoSelecionado={listaArquivoSelecionado}
            excluiArquivo={() => adicionaArquivo([])}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          {form.formState.isSubmitting ? (
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
              disabled
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </Button>
          ) : (
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
              type="submit"
            >
              Salvar calibração
            </Button>
          )}
          <Button
            type="button"
            variant={'destructive'}
            onClick={resetarFormulario}
            className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}

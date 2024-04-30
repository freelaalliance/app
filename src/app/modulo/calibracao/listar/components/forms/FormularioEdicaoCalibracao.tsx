'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DialogClose } from '@/components/ui/dialog'
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
import { Upload } from '@/components/upload/upload'
import { cn, encodeFileToBase64 } from '@/lib/utils'

import {
  CalibracoesInstrumentosEmpresaType,
  EdicaoCalibracaoPropsInterface,
  salvarEdicaoCalibracao,
} from '../../api/Calibracao'

import {
  EditCalibracaoFormType,
  formValoresPadrao,
  schemaFormEditCalibracao,
} from './schemas/SchemaEdicaoCalibracao'

export interface PropsFormularioEdicaoInterface {
  idCalibracao: string
}

export function FormaularioEdicaoCalibracao({
  idCalibracao,
}: PropsFormularioEdicaoInterface) {
  const [listaArquivoSelecionado, adicionaArquivo] = useState<Array<File>>([])
  const queryClient = useQueryClient()

  const form = useForm<EditCalibracaoFormType>({
    resolver: zodResolver(schemaFormEditCalibracao),
    defaultValues: formValoresPadrao,
    mode: 'onChange',
  })

  const resetarFormulario = () => {
    form.reset()
    adicionaArquivo([])
  }

  const { mutateAsync: editarCalibracaoFn } = useMutation({
    mutationFn: salvarEdicaoCalibracao,
    onMutate({
      id,
      numeroCertificado,
      erroEncontrado,
      incertezaTendenciaEncontrado,
      toleranciaEstabelicida,
      observacao,
      certificado,
      realizadoEm,
    }) {
      const { cacheCalibracoes } = atualizarCacheCalibracoes({
        id,
        numeroCertificado,
        erroEncontrado,
        incertezaTendenciaEncontrado,
        toleranciaEstabelicida,
        observacao,
        certificado,
        realizadoEm,
      })

      return { listaAntigaCalibracoes: cacheCalibracoes }
    },
    onError(_, __, context) {
      if (context?.listaAntigaCalibracoes) {
        queryClient.setQueryData(
          ['listaCalibracoes'],
          context.listaAntigaCalibracoes,
        )
      }
    },
  })

  const statusCalibracao = (
    incertezaTendenciaEncontrado: number,
    erroEncontrado: number,
    tolerancia: number,
  ): 'aprovado' | 'reprovado' => {
    return incertezaTendenciaEncontrado + erroEncontrado <= tolerancia
      ? 'aprovado'
      : 'reprovado'
  }

  function atualizarCacheCalibracoes({
    id,
    numeroCertificado,
    erroEncontrado,
    incertezaTendenciaEncontrado,
    toleranciaEstabelicida,
    observacao,
    certificado,
    realizadoEm,
  }: EdicaoCalibracaoPropsInterface) {
    const cacheCalibracoes: CalibracoesInstrumentosEmpresaType | undefined =
      queryClient.getQueryData(['calibracoes'])

    queryClient.setQueryData(
      ['calibracoes'],
      cacheCalibracoes?.map((calibracao) => {
        if (calibracao.calibracao.id === id) {
          return {
            ...calibracao,
            calibracao: {
              id,
              numeroCertificado,
              erroEncontrado,
              incertezaTendenciaEncontrado,
              toleranciaEstabelicida,
              observacao,
              certificado,
              realizadoEm,
              status: statusCalibracao(
                Number(incertezaTendenciaEncontrado),
                Number(erroEncontrado),
                Number(toleranciaEstabelicida),
              ),
              usuarioId: calibracao.calibracao.usuarioId,
            },
          }
        }
        return calibracao
      }),
    )

    return { cacheCalibracoes }
  }

  async function onSubmit(data: EditCalibracaoFormType) {
    let certificado: string | null = null

    if (listaArquivoSelecionado.length > 0) {
      const base64 = await encodeFileToBase64(listaArquivoSelecionado[0])

      if (!base64) {
        toast.error('Não foi possível converter o arquivo, tente novamente!')
        return
      } else {
        certificado = base64
      }
    }

    if (!certificado) {
      const cacheCalibracoes: CalibracoesInstrumentosEmpresaType | undefined =
        queryClient.getQueryData(['calibracoes'])

      const dadosCalibracao = cacheCalibracoes?.filter((dados) => {
        return dados.calibracao.id === idCalibracao
      })

      if (dadosCalibracao && dadosCalibracao.length > 0) {
        certificado = dadosCalibracao[0].calibracao.certificado
      } else {
        toast.warning('Necessário selecionar o certificado da calibração!')
        return
      }
    }

    if (!certificado) {
      toast.warning('Necessário selecionar o certificado da calibração!')
      return
    }

    try {
      await editarCalibracaoFn({
        id: idCalibracao,
        numeroCertificado: data.numeroCertificado,
        erroEncontrado: String(data.erroEncontrado),
        incertezaTendenciaEncontrado: String(data.incertezaTendenciaEncontrado),
        toleranciaEstabelicida: String(data.tolerancia),
        observacao: data.observacaoCalibracao,
        certificado: certificado || '',
        realizadoEm: data.dataCalibracao,
      })

      toast.success('Dados da calibração salvo com sucesso!')
    } catch {
      toast.error('Houve um erro ao salvar as modificações, tente novamente!')
    }
  }

  useEffect(() => {
    const listaCalibracoesEmpresaCache:
      | CalibracoesInstrumentosEmpresaType
      | undefined = queryClient.getQueryData(['calibracoes'])

    const dadosCalibracao = listaCalibracoesEmpresaCache?.filter((dados) => {
      return dados.calibracao.id === idCalibracao
    })

    if (dadosCalibracao && dadosCalibracao.length === 1) {
      form.setValue(
        'numeroCertificado',
        dadosCalibracao[0].calibracao.numeroCertificado,
      )
      form.setValue(
        'dataCalibracao',
        new Date(dadosCalibracao[0].calibracao.realizadoEm),
      )
      form.setValue(
        'erroEncontrado',
        Number(dadosCalibracao[0].calibracao.erroEncontrado),
      )
      form.setValue(
        'incertezaTendenciaEncontrado',
        Number(dadosCalibracao[0].calibracao.incertezaTendenciaEncontrado),
      )
      form.setValue(
        'tolerancia',
        Number(dadosCalibracao[0].calibracao.toleranciaEstabelicida),
      )
      form.setValue(
        'observacaoCalibracao',
        dadosCalibracao[0].calibracao.observacao,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Upload selecionaArquivo={adicionaArquivo} />
          {listaArquivoSelecionado.length > 0 && <Separator />}
          <ListaArquivo
            listaArquivoSelecionado={listaArquivoSelecionado}
            excluiArquivo={() => adicionaArquivo([])}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
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
                <FormLabel>Tolerância</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tolerância estabelecida pela empresa"
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

        <div className="flex flex-row gap-2 float-right">
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={resetarFormulario}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
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
        </div>
      </form>
    </Form>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Trash } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ListaArquivo } from '@/components/upload/lista-arquivo'
import { Upload } from '@/components/upload/upload'
import { consultarCep } from '@/lib/ViacepLib'
import {
  cn,
  encodeFileToBase64,
  formatarDocumento,
  formatarNumeroTelefone,
  removerCaracteresEspecial,
} from '@/lib/utils'

import {
  type FornecedoresEmpresaType,
  salvarNovoFornecedor,
} from '../(api)/FornecedorApi'
import { schemaCadastroFornecedorForm } from '../../../(schemas)/fornecedores/schema-fornecedor'

export type FormularioCadastroFornecedor = z.infer<
  typeof schemaCadastroFornecedorForm
>

const schemaTelefone = z.object({
  codigoArea: z
    .string({
      required_error: 'Código área (DDD) obrigatório',
    })
    .max(2, {
      message: 'Código área (DDD) inválido',
    }),
  numero: z
    .string({
      required_error: 'Número do contato obrigatório',
    })
    .max(9, {
      message: 'Número do contato inválido',
    }),
})

const schemaEmail = z.object({
  email: z
    .string({
      required_error: 'Email obrigatório',
    })
    .email({
      message: 'Email inválido',
    }),
})

const schemaDocumentos = z.object({
  nome: z.string(),
  arquivo: z.string(),
})

type documentosFornecedor = z.infer<typeof schemaDocumentos>

export default function CadastroFornecedorView() {
  const queryClient = useQueryClient()

  const [listaArquivoSelecionado, adicionaArquivo] = useState<Array<File>>([])
  const formNovoFornecedor = useForm<FormularioCadastroFornecedor>({
    resolver: zodResolver(schemaCadastroFornecedorForm),
    defaultValues: {
      critico: false,
      nome: '',
      documento: '',
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      complemento: '',
      aprovado: true,
      nota: 0,
      validade: new Date(),
      telefones: [],
      emails: [],
      documentos: [],
    },
    mode: 'onChange',
  })

  const formTelefone = useForm<z.infer<typeof schemaTelefone>>({
    resolver: zodResolver(schemaTelefone),
    defaultValues: {
      codigoArea: '',
      numero: '',
    },
    mode: 'onChange',
  })

  const formEmail = useForm<z.infer<typeof schemaEmail>>({
    resolver: zodResolver(schemaEmail),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  })

  const {
    fields: telefones,
    append: adicionarTelefone,
    remove: removerTelefone,
  } = useFieldArray({
    control: formNovoFornecedor.control,
    name: 'telefones',
  })

  const {
    fields: emails,
    append: adicionarEmail,
    remove: removerEmail,
  } = useFieldArray({
    control: formNovoFornecedor.control,
    name: 'emails',
  })

  async function buscarEnderecoCep(cep: string) {
    const dadosCep = await consultarCep({ cep })

    if(dadosCep.erro) {
      toast.error(dadosCep.msg)
    }

    formNovoFornecedor.setValue('logradouro', dadosCep.dados.logradouro)
    formNovoFornecedor.setValue('bairro', dadosCep.dados.bairro)
    formNovoFornecedor.setValue('cidade', dadosCep.dados.localidade)
    formNovoFornecedor.setValue('estado', dadosCep.dados.uf)
    formNovoFornecedor.setValue('complemento', dadosCep.dados.complemento)
  }

  async function onSubmitEmail(data: z.infer<typeof schemaEmail>) {
    if (
      await formEmail.trigger(['email'], {
        shouldFocus: true,
      })
    ) {
      adicionarEmail(data)
      formEmail.reset()
    }
  }

  async function onSubmitTelefone(data: z.infer<typeof schemaTelefone>) {
    if (
      await formTelefone.trigger(['codigoArea', 'numero'], {
        shouldFocus: true,
      })
    ) {
      adicionarTelefone(data)
      formTelefone.reset()
    }
  }

  const { mutateAsync: salvarFornecedor } = useMutation({
    mutationFn: salvarNovoFornecedor,
    onError: error => {
      toast.error('Erro ao salvar novo fornecedor', {
        description: error.message,
      })
    },
    onSuccess: data => {
      if (data.status) {
        const fornecedores: Array<FornecedoresEmpresaType> | undefined =
          queryClient.getQueryData(['fornecedoresEmpresa'])

        queryClient.setQueryData(
          ['fornecedoresEmpresa'],
          [...(fornecedores ?? []), data.dados]
        )

        toast.success(data.msg)

        formNovoFornecedor.reset()
        adicionaArquivo([])
        removerTelefone()
        removerEmail()
      } else {
        toast.warning(data.msg)
      }
    },
  })

  async function onSubmitFornecedor(data: FormularioCadastroFornecedor) {
    const arquivosCodificados: documentosFornecedor[] = await Promise.all(
      listaArquivoSelecionado.map(async arquivo => ({
        nome: arquivo.name,
        arquivo: await encodeFileToBase64(arquivo),
      }))
    )

    if (data.emails.length === 0) {
      toast.warning('Necessário informar ao menos um email do fornecedor')
    } else if (data.telefones.length === 0) {
      toast.warning('Necessário informar ao menos um telefone do fornecedor')
    } else if (
      data.critico &&
      (!data.validade || data.validade === new Date())
    ) {
      toast.warning(
        'Data de validade de avaliação do fornecedor é obrigatória e não pode ser a data atual ou a data do cadastro'
      )
    } else {
      salvarFornecedor({
        ...data,
        documento: removerCaracteresEspecial(data.documento),
        documentos: arquivosCodificados,
      })
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(() => {
    const cep = formNovoFornecedor.getValues('cep')

    if (cep.length >= 8) {
      buscarEnderecoCep(cep)
    }
  }, [formNovoFornecedor.watch('cep')])

  return (
    <section>
      <Form {...formNovoFornecedor}>
        <form
          className="space-y-4"
          onSubmit={formNovoFornecedor.handleSubmit(onSubmitFornecedor)}
        >
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <div className="md:col-span-2">
              <FormField
                control={formNovoFornecedor.control}
                name={'documento'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ/CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000.000.000-00"
                        {...field}
                        onChange={event => {
                          formNovoFornecedor.setValue(
                            'documento',
                            formatarDocumento(event.target.value)
                          )
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-4">
              <FormField
                control={formNovoFornecedor.control}
                name={'nome'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão social</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={formNovoFornecedor.control}
            name="critico"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={value => {
                      if (value) {
                        formNovoFornecedor.setValue('aprovado', false)
                        formNovoFornecedor.trigger('aprovado')
                      } else {
                        formNovoFornecedor.setValue('aprovado', true)
                        formNovoFornecedor.trigger('aprovado')
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
          {formNovoFornecedor.watch('critico') && (
            <>
              <Separator />
              <FormField
                control={formNovoFornecedor.control}
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
              <div className="flex flex-row gap-2">
                <FormField
                  control={formNovoFornecedor.control}
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
                  control={formNovoFornecedor.control}
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
                                'w-[240px] pl-3 text-left font-normal',
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
                            disabled={date => date < new Date()}
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
            </>
          )}

          <Tabs defaultValue="endereco" className="w-full space-y-2">
            <TabsList className="flex flex-row justify-center">
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="telefones">Telefones</TabsTrigger>
              <TabsTrigger value="emails">E-mails</TabsTrigger>
              <TabsTrigger value="documentos">Anexos</TabsTrigger>
            </TabsList>
            <Separator />
            <TabsContent value="endereco">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={formNovoFornecedor.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="CEP do endereço"
                          {...field}
                          maxLength={9}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={formNovoFornecedor.control}
                    name="logradouro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logradouro</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Logradouro da empresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={formNovoFornecedor.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formNovoFornecedor.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado da cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={formNovoFornecedor.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formNovoFornecedor.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Num. da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1">
                <FormField
                  control={formNovoFornecedor.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Complemento do endereço da empresa"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="telefones">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="grid space-y-2">
                  <Form {...formTelefone}>
                    <div className="flex flex-col md:flex-row gap-2">
                      <FormField
                        control={formTelefone.control}
                        name="codigoArea"
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <FormLabel>DDD</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="DDD do telefone"
                                {...field}
                                maxLength={2}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formTelefone.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Número do telefone"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                  <Button
                    type="button"
                    onClick={() => {
                      onSubmitTelefone({
                        codigoArea: formTelefone.getValues('codigoArea'),
                        numero: formTelefone.getValues('numero'),
                      })
                    }}
                    className="shadow bg-padrao-gray-250 hover:bg-gray-900 flex md:justify-between justify-center w-24"
                  >
                    Adicionar
                  </Button>
                </div>
                <ScrollArea className="max-h-52 md:max-h-72 w-full overflow-auto">
                  {telefones.map((telefone, index) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="flex flex-row justify-between p-4 rounded transition-all hover:bg-accent"
                    >
                      <b className="text-base">{`(${telefone.codigoArea}) ${formatarNumeroTelefone(telefone.numero)}`}</b>
                      <Button
                        className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
                        variant={'destructive'}
                        size={'icon'}
                        type="button"
                        onClick={() => removerTelefone(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="emails">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="grid space-y-2">
                  <Form {...formEmail}>
                    <FormField
                      control={formEmail.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="exemplo@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Form>
                  <Button
                    type="button"
                    onClick={() => {
                      onSubmitEmail({
                        email: formEmail.getValues('email'),
                      })
                    }}
                    className="shadow bg-padrao-gray-250 hover:bg-gray-900 flex md:justify-between justify-center w-24"
                  >
                    Adicionar
                  </Button>
                </div>
                <ScrollArea className="max-h-52 md:max-h-72 w-full overflow-auto">
                  {emails.map((email, index) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="flex flex-row justify-between p-4 rounded transition-all hover:bg-accent"
                    >
                      <b className="text-base">{`${email.email}`}</b>
                      <Button
                        className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
                        size={'icon'}
                        variant={'destructive'}
                        type="button"
                        onClick={() => removerEmail(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="documentos">
              <div className="grid gap-2">
                {listaArquivoSelecionado.length > 0 && (
                  <>
                    <ListaArquivo
                      listaArquivoSelecionado={listaArquivoSelecionado}
                      excluiArquivo={indexArquivo =>
                        adicionaArquivo(
                          listaArquivoSelecionado.filter(
                            (_, index) => index !== indexArquivo
                          )
                        )
                      }
                    />
                    <Separator />
                  </>
                )}
                <Upload
                  selecionaArquivo={anexo => {
                    // biome-ignore lint/complexity/noForEach: <explanation>
                    anexo.forEach(arquivo => {
                      adicionaArquivo([...listaArquivoSelecionado, arquivo])
                    })
                  }}
                  multiplo={false}
                  qtdArquivos={5}
                />
              </div>
            </TabsContent>
          </Tabs>
          <Separator />
          <DialogFooter className='gap-2'>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  formNovoFornecedor.reset()
                  adicionaArquivo([])
                  removerTelefone()
                  removerEmail()
                }}
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
              disabled={formNovoFornecedor.formState.isSubmitting}
            >
              {formNovoFornecedor.formState.isSubmitting
                ? 'Salvando...'
                : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </section>
  )
}

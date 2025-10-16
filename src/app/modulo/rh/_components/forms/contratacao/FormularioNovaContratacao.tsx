'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Building, CalendarIcon, CheckCircle, FileText, Loader2, Minus, Plus, Upload, User, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
    type CriarContratacaoFormType,
    schemaCriarContratacao,
    valoresFormPadrao
} from '@/app/modulo/rh/_schemas/contratacao/ContratacaoSchemas'
import {
    type DocumentoUpload,
    gerarIdDocumento,
    removerDocumento,
    uploadDocumento
} from '@/app/modulo/rh/_utils/uploadDocumentos'
import { Badge } from '@/components/ui/badge'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { consultarCep } from '@/lib/ViacepLib'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useCargos } from '../../../_hooks/cargos/useCargos'
import { useCriarContratacao } from '../../../_hooks/colaborador/useContratacaoColaborador'

interface FormularioNovaContratacaoProps {
  onSubmitCallback?: () => void
}

export function FormularioNovaContratacao({ onSubmitCallback }: FormularioNovaContratacaoProps) {
  const [emailKeys, setEmailKeys] = useState<string[]>([])
  const [telefoneKeys, setTelefoneKeys] = useState<string[]>([])
  const [documentoKeys, setDocumentoKeys] = useState<string[]>([])
  const [documentosUpload, setDocumentosUpload] = useState<DocumentoUpload[]>([])

  const form = useForm<CriarContratacaoFormType>({
    resolver: zodResolver(schemaCriarContratacao),
    defaultValues: valoresFormPadrao,
    mode: 'onChange',
  })

  const criarContratacao = useCriarContratacao()
  const { data: cargos, isFetching: carregandoCargos } = useCargos()

  // Watch para arrays dinâmicos e campos de endereço
  const emails = form.watch('colaborador.pessoa.EmailPessoa') || []
  const telefones = form.watch('colaborador.pessoa.TelefonePessoa') || []
  const endereco = form.watch('colaborador.pessoa.Endereco')

  // Função para gerar ID único
  const generateId = useCallback(() => Math.random().toString(36).substr(2, 9), [])

  // Verificação de erros nas seções usando form.formState.errors
  const errorsEndereco = form.formState.errors.colaborador?.pessoa?.Endereco
  const errorsEmails = form.formState.errors.colaborador?.pessoa?.EmailPessoa
  const errorsTelefones = form.formState.errors.colaborador?.pessoa?.TelefonePessoa

  // Estados reativos para verificar se há erros nas seções
  const temErroEndereco = useMemo(() => {
    return !!(errorsEndereco)
  }, [errorsEndereco])

  const temErroEmails = useMemo(() => {
    return !!(errorsEmails)
  }, [errorsEmails])

  const temErroTelefones = useMemo(() => {
    return !!(errorsTelefones)
  }, [errorsTelefones])

  // Funções para adicionar/remover emails
  const adicionarEmail = () => {
    const emailsAtuais = form.getValues('colaborador.pessoa.EmailPessoa') || []
    const newKey = generateId()
    form.setValue('colaborador.pessoa.EmailPessoa', [...emailsAtuais, { email: '' }])
    setEmailKeys(prev => [...prev, newKey])
  }

  const removerEmail = (index: number) => {
    const emailsAtuais = form.getValues('colaborador.pessoa.EmailPessoa') || []
    form.setValue('colaborador.pessoa.EmailPessoa', emailsAtuais.filter((_: { email: string }, i: number) => i !== index))
    setEmailKeys(prev => prev.filter((_: string, i: number) => i !== index))
  }

  // Funções para adicionar/remover telefones
  const adicionarTelefone = () => {
    const telefonesAtuais = form.getValues('colaborador.pessoa.TelefonePessoa') || []
    const newKey = generateId()
    form.setValue('colaborador.pessoa.TelefonePessoa', [...telefonesAtuais, { codigoArea: '', numero: '' }])
    setTelefoneKeys(prev => [...prev, newKey])
  }

  const removerTelefone = (index: number) => {
    const telefonesAtuais = form.getValues('colaborador.pessoa.TelefonePessoa') || []
    form.setValue('colaborador.pessoa.TelefonePessoa', telefonesAtuais.filter((_: { codigoArea: string; numero: string }, i: number) => i !== index))
    setTelefoneKeys(prev => prev.filter((_: string, i: number) => i !== index))
  }

  // Funções para adicionar/remover documentos
  const adicionarDocumento = () => {
    const novoDocumento: DocumentoUpload = {
      id: gerarIdDocumento(),
      documento: ''
    }

    setDocumentosUpload(prev => [...prev, novoDocumento])

    const newKey = generateId()
    setDocumentoKeys(prev => [...prev, newKey])
  }

  const removerDocumentoCompleto = async (index: number) => {
    const documento = documentosUpload[index]

    // Se o documento tem arquivo no S3, remove primeiro
    if (documento?.chaveArquivo) {
      await removerDocumento(documento.chaveArquivo)
    }

    setDocumentosUpload(prev => prev.filter((_, i) => i !== index))
    setDocumentoKeys(prev => prev.filter((_: string, i: number) => i !== index))
  }

  // Função para fazer upload do arquivo
  const handleFileUpload = async (index: number, arquivo: File) => {
    // Atualizar estado para mostrar loading
    setDocumentosUpload(prev => prev.map((doc, i) =>
      i === index ? { ...doc, arquivo, uploading: true } : doc
    ))

    try {
      const documento = documentosUpload[index]
      const resultado = await uploadDocumento(arquivo, documento.id)

      if (resultado.success) {
        setDocumentosUpload(prev => prev.map((doc, i) =>
          i === index ? {
            ...doc,
            chaveArquivo: resultado.chaveArquivo,
            uploading: false
          } : doc
        ))
      } else {
        // Remover arquivo em caso de erro
        setDocumentosUpload(prev => prev.map((doc, i) =>
          i === index ? {
            ...doc,
            arquivo: undefined,
            uploading: false
          } : doc
        ))
        alert(`Erro no upload: ${resultado.error}`)
      }
    } catch (error) {
      setDocumentosUpload(prev => prev.map((doc, i) =>
        i === index ? {
          ...doc,
          arquivo: undefined,
          uploading: false
        } : doc
      ))
      alert('Erro inesperado no upload')
    }
  }

  // Função para remover arquivo específico
  const removerArquivo = async (index: number) => {
    const documento = documentosUpload[index]

    if (documento.chaveArquivo) {
      const sucesso = await removerDocumento(documento.chaveArquivo)
      if (sucesso) {
        setDocumentosUpload(prev => prev.map((doc, i) =>
          i === index ? {
            ...doc,
            arquivo: undefined,
            chaveArquivo: undefined
          } : doc
        ))
      } else {
        alert('Erro ao remover arquivo do servidor')
      }
    } else {
      // Apenas remover arquivo local
      setDocumentosUpload(prev => prev.map((doc, i) =>
        i === index ? {
          ...doc,
          arquivo: undefined
        } : doc
      ))
    }
  }

  const handleSubmit = async (data: CriarContratacaoFormType) => {

    try {
      // Verificar se há uploads pendentes
      const uploadsPendentes = documentosUpload.some(doc => doc.uploading)
      if (uploadsPendentes) {
        alert('Aguarde o upload dos arquivos terminar antes de salvar.')
        return
      }

      // Transformar documentos com upload para o formato da API
      const documentosParaAPI = documentosUpload.map(doc => ({
        documento: doc.documento,
        chaveArquivo: doc.chaveArquivo || undefined
      }))

      if (data.colaborador.pessoa.EmailPessoa?.length === 0) {
        toast.error('É necessário informar pelo menos um e-mail.')
        return
      }

      if (data.colaborador.pessoa.TelefonePessoa?.length === 0) {
        toast.error('É necessário informar pelo menos um telefone.')
        return
      }

      // Transformar dados do formulário para o formato da API
      const submitData = {
        admitidoEm: data.admitidoEm,
        cargoId: data.cargoId,
        colaborador: {
          documento: data.colaborador.documento,
          pessoa: {
            id: '', // Será gerado pelo backend
            nome: data.colaborador.pessoa.nome,
            EmailPessoa: data.colaborador.pessoa.EmailPessoa || [],
            TelefonePessoa: data.colaborador.pessoa.TelefonePessoa || [],
            Endereco: data.colaborador.pessoa.Endereco
          }
        },
        documentosContrato: documentosParaAPI
      }

      await criarContratacao.mutateAsync(submitData)
      form.reset()
      setDocumentosUpload([]) // Limpar documentos
      onSubmitCallback?.()
    } catch (error) {
      toast.error(`Erro ao salvar contratação: ${error}`)
    }
  }

  async function buscarEnderecoCep(cep: string) {
    const dadosCep = await consultarCep({ cep })

    if (dadosCep.erro) {
      toast.error(dadosCep.msg)
    }

    form.setValue('colaborador.pessoa.Endereco.logradouro', dadosCep.dados.logradouro)
    form.setValue('colaborador.pessoa.Endereco.bairro', dadosCep.dados.bairro)
    form.setValue('colaborador.pessoa.Endereco.cidade', dadosCep.dados.localidade)
    form.setValue('colaborador.pessoa.Endereco.estado', dadosCep.dados.uf)
    form.setValue('colaborador.pessoa.Endereco.complemento', dadosCep.dados.complemento)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(() => {
    const cep = form.getValues('colaborador.pessoa.Endereco.cep')

    if (cep && cep.length >= 8) {
      buscarEnderecoCep(cep)
    }
  }, [form.watch('colaborador.pessoa.Endereco.cep')])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Dados Pessoais</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="colaborador.pessoa.nome"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="colaborador.documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admitidoEm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Admissão *</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
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
                          className={"border rounded-sm"}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date => date <= new Date(date.getDate(), date.getMonth(), date.getFullYear() - 1)}
                          locale={ptBR}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="endereco" className="w-full space-y-2">
          <TabsList className="flex flex-row justify-center">
            <TabsTrigger value='endereco' className="relative">
              <span>Endereço</span>
              {temErroEndereco && (
                <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />
              )}
            </TabsTrigger>
            <TabsTrigger value='telefone' className="relative">
              <span>Telefones</span>
              {temErroTelefones && (
                <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />
              )}
            </TabsTrigger>
            <TabsTrigger value="email" className="relative">
              <span>E-mails</span>
              {temErroEmails && (
                <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="endereco">
            {temErroEndereco && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Erros no endereço:</span>
                </div>
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
                  {errorsEndereco?.cep && <li>{errorsEndereco.cep.message}</li>}
                  {errorsEndereco?.logradouro && <li>{errorsEndereco.logradouro.message}</li>}
                  {errorsEndereco?.numero && <li>{errorsEndereco.numero.message}</li>}
                  {errorsEndereco?.bairro && <li>{errorsEndereco.bairro.message}</li>}
                  {errorsEndereco?.cidade && <li>{errorsEndereco.cidade.message}</li>}
                  {errorsEndereco?.estado && <li>{errorsEndereco.estado.message}</li>}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="colaborador.pessoa.Endereco.cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP *</FormLabel>
                    <FormControl>
                      <Input placeholder="00000-000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colaborador.pessoa.Endereco.logradouro"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Logradouro *</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, Avenida, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colaborador.pessoa.Endereco.numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número *</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colaborador.pessoa.Endereco.bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colaborador.pessoa.Endereco.cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colaborador.pessoa.Endereco.estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <FormControl>
                      <Input placeholder="UF" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colaborador.pessoa.Endereco.complemento"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Apt, Sala, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value='email'>
            {temErroEmails && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Erros nos e-mails:</span>
                </div>
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
                  {Array.isArray(errorsEmails) && errorsEmails.map((error, index) => {
                    if (error?.email) {
                      return <li key={`email-error-${Math.random()}`}>E-mail {index + 1}: {error.email.message}</li>
                    }
                    return null
                  })}
                  {!Array.isArray(errorsEmails) && errorsEmails?.message && (
                    <li>{errorsEmails.message}</li>
                  )}
                </ul>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>E-mails</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarEmail}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar E-mail
                </Button>
              </div>

              {emails.map((_, index: number) => {
                const key = emailKeys[index] || `email-${index}`
                return (
                  <div key={key} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`colaborador.pessoa.EmailPessoa.${index}.email`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="exemplo@email.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerEmail(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>
          <TabsContent value='telefone'>
            {temErroTelefones && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Erros nos telefones:</span>
                </div>
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside space-y-1">
                  {Array.isArray(errorsTelefones) && errorsTelefones.map((error, index) => {
                    const erros = []
                    if (error?.codigoArea) {
                      erros.push(`DDD: ${error.codigoArea.message}`)
                    }
                    if (error?.numero) {
                      erros.push(`Número: ${error.numero.message}`)
                    }
                    if (erros.length > 0) {
                      return <li key={`telefone-error-${Math.random()}`}>Telefone {index + 1}: {erros.join(', ')}</li>
                    }
                    return null
                  })}
                  {!Array.isArray(errorsTelefones) && errorsTelefones?.message && (
                    <li>{errorsTelefones.message}</li>
                  )}
                </ul>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Telefones</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarTelefone}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Telefone
                </Button>
              </div>

              {telefones.map((_, index: number) => {
                const key = telefoneKeys[index] || `telefone-${index}`
                return (
                  <div key={key} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`colaborador.pessoa.TelefonePessoa.${index}.codigoArea`}
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormControl>
                            <Input
                              placeholder="11"
                              maxLength={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`colaborador.pessoa.TelefonePessoa.${index}.numero`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="99999-9999"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerTelefone(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
        <Separator />
        {/* Seção: Informações Profissionais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Informações Profissionais</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cargoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={carregandoCargos ? "Carregando..." : "Selecione um cargo"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cargos?.map((cargo) => (
                        <SelectItem key={cargo.id} value={cargo.id}>
                          {cargo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Seção: Documentos */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Documentos do Contrato</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel>Documentos</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={adicionarDocumento}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Documento
              </Button>
            </div>

            {documentosUpload.map((documento, index: number) => {
              const key = documentoKeys[index] || `documento-${index}`
              return (
                <div key={key} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Documento {index + 1}</Badge>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerDocumentoCompleto(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {/* Nome do Documento */}
                    <div>
                      <FormLabel>Nome do Documento *</FormLabel>
                      <Input
                        placeholder="Ex: Contrato de Trabalho, Termo de Compromisso..."
                        value={documento.documento}
                        onChange={(e) => {
                          setDocumentosUpload(prev => prev.map((doc, i) =>
                            i === index ? { ...doc, documento: e.target.value } : doc
                          ))
                        }}
                      />
                    </div>

                    {/* Upload de Arquivo */}
                    <div>
                      <FormLabel>Arquivo</FormLabel>
                      <div className="space-y-2">
                        {!documento.arquivo && !documento.chaveArquivo ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400" />
                              <div className="mt-2">
                                <label
                                  htmlFor={`file-${documento.id}`}
                                  className="cursor-pointer"
                                >
                                  <span className="text-sm text-blue-600 hover:text-blue-500">
                                    Clique para selecionar um arquivo
                                  </span>
                                  <input
                                    id={`file-${documento.id}`}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                      const arquivo = e.target.files?.[0]
                                      if (arquivo) {
                                        handleFileUpload(index, arquivo)
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                PDF, DOC, DOCX, JPG, PNG até 10MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {documento.uploading ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                ) : documento.chaveArquivo ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="text-sm text-gray-700">
                                  {documento.arquivo?.name || 'Arquivo carregado'}
                                </span>
                                {documento.uploading && (
                                  <span className="text-xs text-blue-500">Enviando...</span>
                                )}
                                {documento.chaveArquivo && (
                                  <span className="text-xs text-green-500">Enviado com sucesso</span>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removerArquivo(index)}
                                disabled={documento.uploading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={form.formState.isSubmitting}
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
            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Contratação'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

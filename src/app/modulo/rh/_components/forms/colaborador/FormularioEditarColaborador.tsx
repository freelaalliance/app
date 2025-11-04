'use client'

import { Button } from '@/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { consultarCep } from '@/lib/ViacepLib'
import type { EmailPessoa, TelefonePessoa } from '@/types/PessoaType'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useAtualizarDadosColaborador } from '../../../_hooks/colaborador/useContratacaoColaborador'
import {
  type EditarColaboradorData,
  schemaEditarColaborador,
} from '../../../_schemas/colaborador/EditarColaboradorSchemas'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'
import { removerCaracteresEspecial } from '@/lib/utils'

interface FormularioEditarColaboradorProps {
  contratacao: Contratacao
  onSuccess?: () => void
}

export function FormularioEditarColaborador({
  contratacao,
  onSuccess,
}: FormularioEditarColaboradorProps) {
  const { mutateAsync: atualizarColaborador } = useAtualizarDadosColaborador()

  const form = useForm<EditarColaboradorData>({
    resolver: zodResolver(schemaEditarColaborador),
    defaultValues: {
      nome: contratacao.colaborador.pessoa.nome,
      documento: contratacao.colaborador.documento,
      endereco: contratacao.colaborador.pessoa.Endereco
        ? {
          logradouro: contratacao.colaborador.pessoa.Endereco.logradouro,
          numero: contratacao.colaborador.pessoa.Endereco.numero,
          complemento: contratacao.colaborador.pessoa.Endereco.complemento || '',
          bairro: contratacao.colaborador.pessoa.Endereco.bairro,
          cidade: contratacao.colaborador.pessoa.Endereco.cidade,
          estado: contratacao.colaborador.pessoa.Endereco.estado,
          cep: contratacao.colaborador.pessoa.Endereco.cep,
        }
        : {
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
        },
      telefones: contratacao.colaborador.pessoa.TelefonePessoa?.map((tel: TelefonePessoa) => ({
        numero: tel.numero,
      })) || [{ numero: '' }],
      emails: contratacao.colaborador.pessoa.EmailPessoa?.map((email: EmailPessoa) => ({
        email: email.email,
      })) || [{ email: '' }],
    },
  })

  const {
    fields: telefoneFields,
    append: telefoneAppend,
    remove: telefoneRemove,
  } = useFieldArray({
    control: form.control,
    name: 'telefones',
  })

  const {
    fields: emailFields,
    append: emailAppend,
    remove: emailRemove,
  } = useFieldArray({
    control: form.control,
    name: 'emails',
  })

  const onSubmit = async (data: EditarColaboradorData) => {
    try {
      // Filtrar telefones e emails vazios
      const telefonesValidos = data.telefones?.filter((tel: { numero: string }) => tel.numero.trim() !== '')
      const emailsValidos = data.emails?.filter((email: { email: string }) => email.email.trim() !== '')

      const dadosFormatados: EditarColaboradorData = {
        ...data,
        documento: removerCaracteresEspecial(data.documento),
        telefones: telefonesValidos?.length ? telefonesValidos : undefined,
        emails: emailsValidos?.length ? emailsValidos : undefined,
      }

      await atualizarColaborador({
        id: contratacao.id,
        data: dadosFormatados,
      })

      toast.success('Dados do colaborador atualizados com sucesso!')
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error)
      toast.error('Erro ao atualizar dados do colaborador')
    }
  }

  async function buscarEnderecoCep(cep: string) {
    const dadosCep = await consultarCep({ cep })

    if (dadosCep.erro) {
      toast.error(dadosCep.msg)
    }

    form.setValue('endereco.logradouro', dadosCep.dados.logradouro)
    form.setValue('endereco.bairro', dadosCep.dados.bairro)
    form.setValue('endereco.cidade', dadosCep.dados.localidade)
    form.setValue('endereco.estado', dadosCep.dados.uf)
    form.setValue('endereco.complemento', dadosCep.dados.complemento)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(() => {
    const cep = form.getValues('endereco.cep')

    if (cep && cep && cep.length >= 8) {
      buscarEnderecoCep(cep)
    }
  }, [form.watch('endereco.cep')])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados Básicos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dados Básicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nome completo do colaborador"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="000.000.000-00"
                      maxLength={11}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Tabs defaultValue="endereco" className="w-full space-y-2">
          <TabsList className="flex flex-row justify-center">
            <TabsTrigger value='endereco'>Endereço</TabsTrigger>
            <TabsTrigger value='telefone'>Telefones</TabsTrigger>
            <TabsTrigger value="email">E-mails</TabsTrigger>
          </TabsList>
          <TabsContent value="endereco">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="endereco.cep"
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
                name="endereco.logradouro"
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
                name="endereco.numero"
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
                name="endereco.bairro"
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
                name="endereco.cidade"
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
                name="endereco.estado"
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
                name="endereco.complemento"
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>E-mails</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => emailAppend({ email: '' })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar E-mail
                </Button>
              </div>

              {emailFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`emails.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">E-mail {index + 1}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="email@exemplo.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {emailFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => emailRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value='telefone'>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Telefones</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => telefoneAppend({ numero: '' })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Telefone
                </Button>
              </div>

              {telefoneFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`telefones.${index}.numero`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">Telefone {index + 1}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="(00) 00000-0000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {telefoneFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => telefoneRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

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
            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

'use client';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { consultarCep } from '@/lib/ViacepLib';
import { formatarNumeroTelefoneComDDD, validarDocumento } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCreateCliente } from '../../../_servicos/useClientes';

const clienteSchema = z.object({
  documento: z.string().min(11, 'Documento inválido').refine(validarDocumento, {
        message: 'Documento do cliente inválido',
      }),
  nome: z.string().min(2, 'Nome obrigatório'),
  observacoes: z.string().optional(),
  endereco: z.object({
    logradouro: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    estado: z.string(),
    numero: z.string(),
    complemento: z.string().optional(),
    cep: z.string(),
  }),
  telefones: z.array(
    z.object({
      numero: z.string().max(12, 'Número inválido'),
    })
  ),
  emails: z.array(
    z.object({
      email: z.string().email('E-mail inválido'),
    })
  ),
});

const schemaTelefone = z.object({
  numero: z
    .string({
      required_error: 'Número do contato obrigatório',
    })
    .max(12, {
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


type ClienteFormData = z.infer<typeof clienteSchema>;


export function FormualarioCliente() {
  const formCliente = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      documento: '',
      nome: '',
      observacoes: '',
      endereco: {
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: '',
        complemento: '',
        cep: '',
      },
      telefones: [],
      emails: [],
    },
  });

  const { control } = formCliente;

  const createCliente = useCreateCliente();

  const formTelefone = useForm<z.infer<typeof schemaTelefone>>({
    resolver: zodResolver(schemaTelefone),
    defaultValues: {
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
    control,
    name: 'telefones',
  })

  const {
    fields: emails,
    append: adicionarEmail,
    remove: removerEmail,
  } = useFieldArray({
    control,
    name: 'emails',
  })

  async function buscarEnderecoCep(cep: string) {
    const dadosCep = await consultarCep({ cep })

    if (dadosCep.erro) {
      toast.error(dadosCep.msg)
    }

    formCliente.setValue('endereco.logradouro', dadosCep.dados.logradouro)
    formCliente.setValue('endereco.bairro', dadosCep.dados.bairro)
    formCliente.setValue('endereco.cidade', dadosCep.dados.localidade)
    formCliente.setValue('endereco.estado', dadosCep.dados.uf)
    formCliente.setValue('endereco.complemento', dadosCep.dados.complemento)
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
      await formTelefone.trigger(['numero'], {
        shouldFocus: true,
      })
    ) {
      adicionarTelefone(data)
      formTelefone.reset()
    }
  }

  const onSubmit = async (data: ClienteFormData) => {
    try {
      
      await createCliente.mutateAsync(data);

      toast.success('Cliente criado com sucesso!');      

      formCliente.reset();
      removerTelefone();
      removerEmail();
    } catch (error) {
      console.error(error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(() => {
    const cep = formCliente.getValues('endereco.cep')

    if (cep && cep.length >= 8) {
      buscarEnderecoCep(cep)
    }
  }, [formCliente.watch('endereco.cep')])

  return (
    <Form {...formCliente}>
      <form onSubmit={formCliente.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={formCliente.control}
          name="documento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Documento (CPF/CNPJ)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formCliente.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome do cliente" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formCliente.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} placeholder="Observações sobre o cliente" />
              </FormControl>
              <FormDescription>Insira aqui observações relevantes sobre o cliente.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Tabs defaultValue="endereco" className="w-full space-y-2">
          <TabsList className="flex flex-row justify-center">
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="telefones">Telefones</TabsTrigger>
            <TabsTrigger value="emails">E-mails</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="endereco">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <FormField
                control={formCliente.control}
                name="endereco.cep"
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
                  control={formCliente.control}
                  name="endereco.logradouro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Logradouro"
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
                control={formCliente.control}
                name="endereco.bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formCliente.control}
                name="endereco.numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={formCliente.control}
                name="endereco.cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formCliente.control}
                name="endereco.estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input placeholder="Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1">
              <FormField
                control={formCliente.control}
                name="endereco.complemento"
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
            <div className="grid space-y-2">
              <div className="flex flex-row gap-2">
                <Form {...formTelefone}>
                  <FormField
                    control={formTelefone.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input
                            placeholder="00 99999-9999"
                            maxLength={12}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
                <Button
                  type="button"
                  onClick={() => {
                    if (formTelefone.getValues('numero').length < 10) {
                      formTelefone.setError('numero', {
                        type: 'manual',
                        message: 'Número inválido. Deve conter pelo menos 10 dígitos.',
                      })
                      return
                    }
                    onSubmitTelefone({
                      numero: formTelefone.getValues('numero'),
                    })
                    formTelefone.reset();
                  }}
                  className="shadow bg-padrao-gray-250 hover:bg-gray-900 flex md:justify-between justify-center w-24"
                >
                  Adicionar
                </Button>
              </div>
              <ScrollArea className="max-h-52 md:max-h-72 w-full overflow-auto">
                {telefones.map((telefone, index) => (
                  <div
                    key={telefone.id}
                    className="flex flex-row justify-between p-4 rounded transition-all hover:bg-accent items-center"
                  >
                    <b className="text-base">{`${formatarNumeroTelefoneComDDD(telefone.numero)}`}</b>
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
            <div className="grid space-y-2">
              <div className="flex flex-row gap-2">
                <Form {...formEmail}>
                  <FormField
                    control={formEmail.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                    if(formEmail.formState.errors.email) {
                      return
                    }
                    onSubmitEmail({
                      email: formEmail.getValues('email'),
                    })
                    formEmail.reset();
                  }}
                  className="shadow bg-padrao-gray-250 hover:bg-gray-900 flex md:justify-between justify-center w-24"
                >
                  Adicionar
                </Button>
              </div>
              <ScrollArea className="max-h-52 md:max-h-72 w-full overflow-auto">
                {emails.map((email, index) => (
                  <div
                    key={email.id}
                    className="flex flex-row justify-between items-center p-4 rounded transition-all hover:bg-accent"
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

        </Tabs>

        <Separator />
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                formCliente.reset()
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
            className="shadow-md text-sm uppercase leading-none rounded "
            disabled={formCliente.formState.isSubmitting}
          >
            {formCliente.formState.isSubmitting
              ? 'Salvando...'
              : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

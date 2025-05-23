'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { consultarCep } from '@/lib/ViacepLib'
import { queryClient } from '@/lib/react-query'
import { formatarDocumento, validaCNPJ } from '@/lib/utils'
import { z } from 'zod'
import { editarEmpresa } from '../../api/Empresa'
import type { empresaType } from '../../schemas/SchemaNovaEmpresa'

const edicaoEmpresaFormSchema = z.object({
  id: z.string().uuid(),
  idPessoa: z.string().uuid(),
  nome: z
    .string({
      required_error: 'O nome da empresa é obrigatório',
    })
    .trim(),
  cnpj: z
    .string({
      required_error: 'O documento da empresa é obrigatório',
    })
    .min(14, {
      message: 'O documento precisa ter no mínimo 14 caractéres',
    })
    .refine(validaCNPJ, {
      message: 'Documento da empresa inválido',
    }),
  idEndereco: z.string().uuid(),
  cep: z
    .string({
      required_error: 'Necessário informar o cep',
    })
    .min(8, {
      message: 'O cep precisa ter 8 caractéres',
    })
    .trim(),
  logradouro: z
    .string({
      required_error: 'Necessário informar o logradouro da empresa',
    })
    .trim(),
  numero: z
    .string({
      required_error: 'Obrigatório informar o número do endereço',
    })
    .min(1, {
      message: 'Obrigatório informar o número do endereço',
    }),
  bairro: z.string({
    required_error: 'Obrigatório informar o bairro do endereço',
  }),
  cidade: z.string({
    required_error: 'Obrigatório informar o nome da cidade',
  }),
  estado: z.string({
    required_error: 'Necessário informar o estado da cidade',
  }),
  complemento: z.string().optional(),
})

export type EdicaoEmpresaFormType = z.infer<typeof edicaoEmpresaFormSchema>

export interface EdicaoEmpresaProps {
  dadosEmpresa?: empresaType
}

export function FormularioEdicaoEmpresa({ dadosEmpresa }: EdicaoEmpresaProps) {
  const formEmpresa = useForm<EdicaoEmpresaFormType>({
    resolver: zodResolver(edicaoEmpresaFormSchema),
    defaultValues: dadosEmpresa,
    mode: 'onChange',
  })

  async function buscarEnderecoCep(cep: string) {
    const dadosCep = await consultarCep({ cep })

    if (dadosCep.erro) {
      toast.error(dadosCep.msg)
    }

    formEmpresa.setValue('logradouro', dadosCep.dados.logradouro)
    formEmpresa.setValue('bairro', dadosCep.dados.bairro)
    formEmpresa.setValue('cidade', dadosCep.dados.localidade)
    formEmpresa.setValue('estado', dadosCep.dados.uf)
    formEmpresa.setValue('complemento', dadosCep.dados.complemento)
  }

  async function onSubmit(data: EdicaoEmpresaFormType) {
    const salvarEmpresa = await editarEmpresa(data)

    if (salvarEmpresa.status) {
      toast.success(salvarEmpresa.msg)
      formEmpresa.reset()
      await queryClient.refetchQueries({
        queryKey: ['empresas'],
        type: 'active',
      })
    } else {
      toast.error(salvarEmpresa.msg)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      formEmpresa.watch('cep') !== '' &&
      formEmpresa.watch('cep').length === 8
    ) {
      buscarEnderecoCep(formEmpresa.watch('cep'))
    }
  }, [formEmpresa.watch('cep')])

  return (
    <Form {...formEmpresa}>
      <form onSubmit={formEmpresa.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={formEmpresa.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Documento da empresa"
                    {...field}
                    onChange={event => {
                      formEmpresa.setValue(
                        'cnpj',
                        formatarDocumento(event.target.value)
                      )
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formEmpresa.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormField
            control={formEmpresa.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CEP do endereço"
                    {...field}
                    maxLength={8}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2">
            <FormField
              control={formEmpresa.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input placeholder="Logradouro da empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={formEmpresa.control}
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
            control={formEmpresa.control}
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
            control={formEmpresa.control}
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
            control={formEmpresa.control}
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
            control={formEmpresa.control}
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
        <div className="flex flex-row gap-2 float-right">
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => {
                formEmpresa.reset()
              }}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          {formEmpresa.formState.isSubmitting ? (
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
              Salvar Empresa
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

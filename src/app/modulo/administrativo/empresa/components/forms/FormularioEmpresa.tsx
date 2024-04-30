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
import { queryClient } from '@/lib/react-query'
import { consultarCep } from '@/lib/ViacepLib'

import { cadastrarEmpresa } from '../../api/Empresa'
import {
  empresaFormSchema,
  EmpresaFormType,
  valoresFormPadrao,
} from '../../schemas/SchemaNovaEmpresa'

export function FormularioNovaEmpresa() {
  const formEmpresa = useForm<EmpresaFormType>({
    resolver: zodResolver(empresaFormSchema),
    defaultValues: valoresFormPadrao,
    mode: 'onChange',
  })

  async function buscarEnderecoCep(cep: string) {
    const dadosCep = await consultarCep({ cep })

    if (dadosCep) {
      formEmpresa.setValue('logradouro', dadosCep.data.logradouro)
      formEmpresa.setValue('bairro', dadosCep.data.bairro)
      formEmpresa.setValue('cidade', dadosCep.data.localidade)
      formEmpresa.setValue('estado', dadosCep.data.uf)
      formEmpresa.setValue('cep', dadosCep.data.cep)
      formEmpresa.setValue('complemento', dadosCep.data.complemento)
    }
  }

  async function onSubmit(data: EmpresaFormType) {
    const salvarEmpresa = await cadastrarEmpresa(data)

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

  useEffect(() => {
    if (
      formEmpresa.watch('cep') !== '' &&
      formEmpresa.watch('cep').length === 8
    ) {
      buscarEnderecoCep(formEmpresa.watch('cep'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <FormLabel>Documento</FormLabel>
                <FormControl>
                  <Input placeholder="Documento da empresa" {...field} />
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

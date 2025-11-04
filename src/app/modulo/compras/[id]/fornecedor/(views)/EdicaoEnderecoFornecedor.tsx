import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
import { Textarea } from '@/components/ui/textarea'
import { consultarCep } from '@/lib/ViacepLib'
import { queryClient } from '@/lib/react-query'

import {
    type ResponseFornecedorType,
    salvarModificacaoEndereco,
} from '../(api)/FornecedorApi'
import {
    type EnderecoFornecedorType,
    schemaEnderecoForm,
} from '../../../(schemas)/fornecedores/schema-fornecedor'
import type { EdicaoEnderecoFornecedorProps } from '../components/dialogs/EdicaoEnderecoFornecedorDialog'

export default function EdicaoEnderecoFornecedorView({
  idFornecedor,
  endereco,
}: EdicaoEnderecoFornecedorProps) {
  const formEdicaoEndereco = useForm<EnderecoFornecedorType>({
    resolver: zodResolver(schemaEnderecoForm),
    defaultValues: {
      id: endereco.id,
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      complemento: endereco.complemento,
    },
    mode: 'onChange',
  })

  async function buscarEnderecoCep(cep: string) {
    const dadosCep = await consultarCep({ cep })

    if(dadosCep.erro) {
      toast.error(dadosCep.msg)
    }

    formEdicaoEndereco.setValue('logradouro', dadosCep.dados.logradouro)
    formEdicaoEndereco.setValue('bairro', dadosCep.dados.bairro)
    formEdicaoEndereco.setValue('cidade', dadosCep.dados.localidade)
    formEdicaoEndereco.setValue('estado', dadosCep.dados.uf)
    formEdicaoEndereco.setValue('complemento', dadosCep.dados.complemento)
  }

  const { mutateAsync: salvarEndereco } = useMutation({
    mutationFn: salvarModificacaoEndereco,
    onError: error => {
      toast.error('Erro ao salvar a endereço, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: resp => {
      if (resp.status) {
        const dadosFornecedor: ResponseFornecedorType | undefined =
          queryClient.getQueryData(['dadosFornecedor', idFornecedor])

        queryClient.setQueryData(
          ['dadosFornecedor', idFornecedor],
          dadosFornecedor &&
            resp.dados && {
              ...dadosFornecedor,
              dados: {
                ...dadosFornecedor?.dados,
                endereco: {
                  cep: resp.dados.cep,
                  logradouro: resp.dados.logradouro,
                  numero: resp.dados.numero,
                  bairro: resp.dados.bairro,
                  cidade: resp.dados.cidade,
                  estado: resp.dados.estado,
                  complemento: resp.dados.complemento,
                  id: resp.dados.id,
                },
              },
            }
        )

        formEdicaoEndereco.reset()
        toast.success(resp.msg)
      } else {
        toast.warning(resp.msg)
      }
    },
  })

  async function onSubmitEdicaoEndereco(data: EnderecoFornecedorType) {
    await salvarEndereco({ idFornecedor, endereco: data })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(() => {
    const cep = formEdicaoEndereco.getValues('cep')

    if (cep) {
      buscarEnderecoCep(cep)
    }
  }, [formEdicaoEndereco.watch('cep')])

  return (
    <section>
      <Form {...formEdicaoEndereco}>
        <form
          className="space-y-4"
          onSubmit={formEdicaoEndereco.handleSubmit(onSubmitEdicaoEndereco)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
              control={formEdicaoEndereco.control}
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
                control={formEdicaoEndereco.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input placeholder="Logradouro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={formEdicaoEndereco.control}
              name="bairro"
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
              control={formEdicaoEndereco.control}
              name="numero"
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
              control={formEdicaoEndereco.control}
              name="cidade"
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
              control={formEdicaoEndereco.control}
              name="estado"
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
              control={formEdicaoEndereco.control}
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
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  formEdicaoEndereco.reset()
                }}
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="shadow-md text-sm uppercase leading-none rounded "
              disabled={formEdicaoEndereco.formState.isSubmitting}
            >
              {formEdicaoEndereco.formState.isSubmitting
                ? 'Salvando...'
                : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </section>
  )
}

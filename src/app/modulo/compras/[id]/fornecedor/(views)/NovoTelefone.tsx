'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { Separator } from '@/components/ui/separator'

import {
  ResponseFornecedorType,
  salvarNovoTelefone,
} from '../(api)/FornecedorApi'
import { schemaTelefoneForm } from '../../../(schemas)/fornecedores/schema-fornecedor'
import { NovoTelefoneProps } from '../components/dialogs/NovoTelefoneFornecedorDialog'

export type FormularioNovoTelefone = z.infer<typeof schemaTelefoneForm>

export default function NovoTelefoneView({ idFornecedor }: NovoTelefoneProps) {
  const queryClient = useQueryClient()

  const formNovoTelefone = useForm<FormularioNovoTelefone>({
    resolver: zodResolver(schemaTelefoneForm),
    defaultValues: {
      codigoArea: '',
      numero: '',
    },
    mode: 'onChange',
  })

  const { mutateAsync: novoTelefone } = useMutation({
    mutationFn: salvarNovoTelefone,
    onError: (error) => {
      toast.error('Erro ao salvar o telefone, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: (data) => {
      if (data.status) {
        const dadosFornecedor: ResponseFornecedorType | undefined =
          queryClient.getQueryData(['dadosFornecedor', idFornecedor])

        queryClient.setQueryData(
          ['dadosFornecedor', idFornecedor],
          dadosFornecedor &&
            data.status &&
            data.dados && {
              ...dadosFornecedor,
              dados: {
                ...dadosFornecedor?.dados,
                telefones: [
                  ...(dadosFornecedor.dados?.telefones ?? []),
                  data.dados,
                ],
              },
            },
        )

        formNovoTelefone.reset()

        toast.success(data.msg)
      } else {
        toast.warning(data.msg)
      }
    },
  })

  async function onSubmitTelefone(data: FormularioNovoTelefone) {
    await novoTelefone({
      idFornecedor,
      telefone: data,
    })
  }

  return (
    <section>
      <Form {...formNovoTelefone}>
        <form
          onSubmit={formNovoTelefone.handleSubmit(onSubmitTelefone)}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={formNovoTelefone.control}
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
              control={formNovoTelefone.control}
              name="numero"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Número do telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  formNovoTelefone.reset()
                }}
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
              disabled={formNovoTelefone.formState.isSubmitting}
            >
              {formNovoTelefone.formState.isSubmitting
                ? 'Salvando...'
                : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </section>
  )
}

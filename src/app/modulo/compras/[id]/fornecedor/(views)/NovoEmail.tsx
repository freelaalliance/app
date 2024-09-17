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

import { ResponseFornecedorType, salvarNovoEmail } from '../(api)/FornecedorApi'
import { schemaEmailForm } from '../../../(schemas)/fornecedores/schema-fornecedor'
import { NovoEmailProps } from '../components/dialogs/NovoEmailFornecedorDialog'

export type FormularioNovoEmail = z.infer<typeof schemaEmailForm>

export default function NovoEmailView({ idFornecedor }: NovoEmailProps) {
  const queryClient = useQueryClient()

  const formEmail = useForm<FormularioNovoEmail>({
    resolver: zodResolver(schemaEmailForm),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  })

  const { mutateAsync: novoEmail } = useMutation({
    mutationFn: salvarNovoEmail,
    onError: (error) => {
      toast.error('Erro ao salvar o email, tente novamente!', {
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
                emails: [...(dadosFornecedor.dados?.emails ?? []), data.dados],
              },
            },
        )

        formEmail.reset()

        toast.success(data.msg)
      } else {
        toast.warning(data.msg)
      }
    },
  })

  async function onSubmitEmail(data: FormularioNovoEmail) {
    await novoEmail({
      idFornecedor,
      email: data,
    })
  }

  return (
    <section>
      <Form {...formEmail}>
        <form
          onSubmit={formEmail.handleSubmit(onSubmitEmail)}
          className="space-y-4"
        >
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
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => {
                  formEmail.reset()
                }}
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
              disabled={formEmail.formState.isSubmitting}
            >
              {formEmail.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </section>
  )
}

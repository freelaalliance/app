'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
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

import type { NovoEmailPessoaProps } from '../dialogs/NovoEmailDialog'
import { salvarNovoEmail } from '../dialogs/api/EmailApi'

const schemaEmailForm = z.object({
  email: z
    .string({
      required_error: 'Email obrigatório',
    })
    .email({
      message: 'Email inválido',
    }),
})

export type FormularioNovoEmail = z.infer<typeof schemaEmailForm>

export default function NovoEmailView({
  idPessoa,
  emailAtualizado,
}: NovoEmailPessoaProps) {
  const formEmail = useForm<FormularioNovoEmail>({
    resolver: zodResolver(schemaEmailForm),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  })

  const { mutateAsync: novoEmail } = useMutation({
    mutationFn: salvarNovoEmail,
    onError: error => {
      toast.error('Erro ao salvar o email, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: data => {
      if (data.status) {
        formEmail.reset()
        emailAtualizado()
        toast.success(data.msg)
      } else {
        toast.warning(data.msg)
      }
    },
  })

  async function onSubmitEmail(data: FormularioNovoEmail) {
    await novoEmail({
      idPessoa,
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

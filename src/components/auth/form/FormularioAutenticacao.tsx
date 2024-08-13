'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { login } from '../api/AuthApi'

const schemaFormAutenticacaoUsuario = z.object({
  email: z
    .string({
      required_error: 'Obrigatório informar o email!',
    })
    .email({ message: 'Email inválido!' }),
  senha: z
    .string({
      required_error: 'Obrigatório informar a senha!',
    })
    .min(8, { message: 'A senha precisa ter no minimo 8 dígitos' }),
})

type CredenciaisUsuarioType = z.infer<typeof schemaFormAutenticacaoUsuario>

export function FormularioAutenticacao() {
  const router = useRouter()
  const formAuth = useForm<CredenciaisUsuarioType>({
    resolver: zodResolver(schemaFormAutenticacaoUsuario),
  })

  const { mutateAsync: authenticateFn } = useMutation({
    mutationFn: login,
    onError: () => {
      toast.error(
        'Houve um problema no processo de autenticação, tente novamente!',
      )
    },
    onSuccess: () => {
      router.push('/home')
    },
  })

  async function onSubmit(data: CredenciaisUsuarioType) {
    await authenticateFn(data)
  }

  return (
    <Form {...formAuth}>
      <form onSubmit={formAuth.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <FormField
              control={formAuth.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nome@exemplo.com"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={formAuth.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formAuth.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Sua senha"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      disabled={formAuth.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="leading-none text-white bg-sky-600 hover:bg-sky-700 shadow"
            type="submit"
            disabled={formAuth.formState.isSubmitting}
          >
            {formAuth.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Iniciar sessão
          </Button>
        </div>
      </form>
    </Form>
  )
}

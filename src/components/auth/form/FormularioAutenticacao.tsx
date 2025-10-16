'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useState } from 'react'
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
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<CredenciaisUsuarioType>({
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Campo Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu.email@empresa.com"
                      className="pl-10 h-12"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Senha */}
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 w-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={form.formState.isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botão de Login */}
        <Button
          type="submit"
          variant="destructive"
          className="w-full h-12 text-base font-medium"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar no Sistema"
          )}
        </Button>
      </form>
    </Form>
  )
}

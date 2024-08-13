'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Key, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { AlterarSenhaUsuario } from './api/AlterarSenhaUsuarioApi'

interface PropsDialogSenhaUsuarioInterface {
  id: string
}

export function SenhaUsuarioDialog({ id }: PropsDialogSenhaUsuarioInterface) {
  const [alerta, alertar] = useState<string | null>(null)
  const schemaSenhaUsuario = z.object({
    senhaAntiga: z
      .string({
        required_error: 'Obrigatório informar a senha antiga!',
      })
      .min(8, {
        message: 'A senha está inválida!',
      }),
    senhaNova: z
      .string({
        required_error: 'Obrigatório informar a nova senha!',
      })
      .min(8, {
        message: 'A senha precisa ter no mínimo 8 digitos',
      })
      .trim(),
    confirmaSenha: z
      .string({
        required_error: 'Obrigatório informar a confirmação de senha!',
      })
      .min(8, {
        message: 'A senha precisa ter no mínimo 8 digitos',
      })
      .trim(),
  })
  type formUsuarioSenhaType = z.infer<typeof schemaSenhaUsuario>
  const form = useForm<formUsuarioSenhaType>({
    resolver: zodResolver(schemaSenhaUsuario),
  })

  function verificarSenhasIguais(): boolean {
    const senhaNova = form.getValues().senhaNova
    const confirmaSenha = form.getValues().confirmaSenha
    const senhaAntiga = form.getValues().senhaAntiga

    if (
      senhaNova !== '' &&
      confirmaSenha !== '' &&
      senhaNova !== confirmaSenha
    ) {
      alertar('As senhas não estão iguais!, verifica novamente!')
      return false
    } else if (
      senhaNova !== '' &&
      senhaAntiga !== '' &&
      senhaAntiga === senhaNova
    ) {
      alertar('As senhas não podem ser iguais!')
      return false
    }

    return true
  }

  async function onSubmit(data: formUsuarioSenhaType) {
    if (!verificarSenhasIguais()) {
      return false
    }

    const alteraSenha = await AlterarSenhaUsuario({
      id,
      senhaAntiga: data.senhaAntiga,
      novaSenha: data.senhaNova,
    })

    if (alteraSenha.status) {
      toast.success(alteraSenha.msg)
      form.reset()
    } else {
      toast.error(alteraSenha.msg)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Alterar senha</DialogTitle>
        <DialogDescription>Modifique a senha do seu usuário</DialogDescription>
      </DialogHeader>
      {alerta && (
        <Alert variant={'destructive'}>
          <Key className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>{alerta}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <FormField
              control={form.control}
              name="senhaAntiga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha antiga</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Informe a sua senha atual"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senhaNova"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Insira uma nova senha forte"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmaSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirma a senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Insira novamente a sua senha forte"
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
                  alertar(null)
                  form.reset()
                }}
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
              >
                Cancelar
              </Button>
            </DialogClose>
            {form.formState.isSubmitting ? (
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
                Salvar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { queryClient } from '@/lib/react-query'

import { buscarListaPerfis } from '../../../../api/Perfil'
import { criarUsuario } from '../../../../api/Usuario'
import {
  FormularioNovoUsuarioType,
  schemaFormularioNovoUsuario,
} from '../../../../schemas/SchemaUsuarios'

interface FormularioNovoUsuarioProps {
  idEmpresa: string
}

export function NovoUsuarioForm({ idEmpresa }: FormularioNovoUsuarioProps) {
  const { data: listaPerfis, isLoading: carregandoPerfisEmpresa } = useQuery({
    queryKey: ['perfisEmpresa', idEmpresa],
    queryFn: () => buscarListaPerfis(idEmpresa),
    staleTime: Infinity,
  })

  const formNovoUsuario = useForm<FormularioNovoUsuarioType>({
    resolver: zodResolver(schemaFormularioNovoUsuario),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      perfil: '',
      empresa: idEmpresa,
    },
    mode: 'onChange',
  })

  async function salvarDadosUsuario(data: FormularioNovoUsuarioType) {
    try {
      const criaUsuario = await criarUsuario(data)

      if (criaUsuario.status) {
        toast.success(criaUsuario.msg)
        formNovoUsuario.reset()

        await queryClient.refetchQueries({
          queryKey: ['listaUsuariosEmpresa', idEmpresa],
          type: 'active',
        })
      } else {
        toast.warning(criaUsuario.msg)
      }
    } catch {
      toast.error('Houve um problema ao salvar usuário, tente novamente!')
    }
  }

  return (
    <Form {...formNovoUsuario}>
      <form
        className="space-y-4"
        onSubmit={formNovoUsuario.handleSubmit(salvarDadosUsuario)}
      >
        <div className="grid grid-cols-1 gap-2">
          <FormField
            control={formNovoUsuario.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do usuário</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formNovoUsuario.control}
            name="perfil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil do usuário</FormLabel>
                <Select
                  disabled={carregandoPerfisEmpresa}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil deste usuário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listaPerfis?.map((perfil) => {
                      return (
                        <SelectItem key={perfil.id} value={perfil.id}>
                          {perfil.nome}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={formNovoUsuario.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email do usuário</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="email"
                    placeholder="usuario@email.com.br"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formNovoUsuario.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha inicial do usuário</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    type="password"
                    placeholder="Nova senha"
                    autoCorrect="off"
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
              onClick={() => formNovoUsuario.reset()}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          {formNovoUsuario.formState.isSubmitting ? (
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
              disabled
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </Button>
          ) : (
            <DialogClose asChild>
              <Button
                className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
                type="submit"
              >
                Salvar usuário
              </Button>
            </DialogClose>
          )}
        </div>
      </form>
    </Form>
  )
}

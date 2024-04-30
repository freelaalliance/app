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
import { useEmpresa } from '@/lib/CaseAtom'
import { queryClient } from '@/lib/react-query'

import { buscarListaPerfis } from '../../../../api/Perfil'
import { alterarDadosUsuario } from '../../../../api/Usuario'
import {
  FormularioEdicaoUsuarioType,
  schemaFormularioEdicaoUsuario,
  UsuarioType,
} from '../../../../schemas/SchemaUsuarios'

interface FormularioNovoUsuarioProps {
  dadosUsuario: UsuarioType
}

export function EditarUsuarioForm({
  dadosUsuario,
}: FormularioNovoUsuarioProps) {
  const [empresaSelecionada] = useEmpresa()
  const { data: listaPerfis, isLoading: carregandoPerfisEmpresa } = useQuery({
    queryKey: ['perfisEmpresa', empresaSelecionada.selected],
    queryFn: () => buscarListaPerfis(empresaSelecionada.selected ?? ''),
    staleTime: Infinity,
  })

  const formEditUsuario = useForm<FormularioEdicaoUsuarioType>({
    resolver: zodResolver(schemaFormularioEdicaoUsuario),
    defaultValues: {
      id: dadosUsuario.id,
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      perfil: dadosUsuario.perfil,
    },
    mode: 'onChange',
  })

  async function salvarDadosUsuario(data: FormularioEdicaoUsuarioType) {
    try {
      const salvaEdicao = await alterarDadosUsuario(data)

      if (salvaEdicao.status) {
        toast.success(salvaEdicao.msg)
        formEditUsuario.reset()

        await queryClient.refetchQueries({
          queryKey: ['listaUsuariosEmpresa', empresaSelecionada.selected],
          type: 'active',
        })
      } else {
        toast.warning(salvaEdicao.msg)
      }
    } catch {
      toast.error(
        'Houve um problema ao salvar alterações do usuário, tente novamente!',
      )
    }
  }

  return (
    <Form {...formEditUsuario}>
      <form
        className="space-y-4"
        onSubmit={formEditUsuario.handleSubmit(salvarDadosUsuario)}
      >
        <div className="grid grid-cols-1 gap-2">
          <FormField
            control={formEditUsuario.control}
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
            control={formEditUsuario.control}
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
            control={formEditUsuario.control}
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
        <div className="flex flex-row gap-2 float-right">
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => formEditUsuario.reset()}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          {formEditUsuario.formState.isSubmitting ? (
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
                Salvar
              </Button>
            </DialogClose>
          )}
        </div>
      </form>
    </Form>
  )
}

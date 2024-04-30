'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { cadastrarPerfil } from '@/app/modulo/administrativo/empresa/api/Perfil'
import {
  FormularioPerfilType,
  schemaFormularioPerfil,
} from '@/app/modulo/administrativo/empresa/schemas/SchemaPerfil'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogClose } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { queryClient } from '@/lib/react-query'

interface FormularioNovoPerfilProps {
  idEmpresa: string
}

export function FormularioNovoPerfil({ idEmpresa }: FormularioNovoPerfilProps) {
  const formNovoPerfil = useForm<FormularioPerfilType>({
    resolver: zodResolver(schemaFormularioPerfil),
    defaultValues: {
      nome: '',
      administrativo: false,
      empresa: idEmpresa,
    },
    mode: 'onChange',
  })

  async function salvar(data: FormularioPerfilType) {
    try {
      const salvaPerfil = await cadastrarPerfil(data)

      if (salvaPerfil.status) {
        toast.success(salvaPerfil.msg)
        formNovoPerfil.reset()

        await queryClient.refetchQueries({
          queryKey: ['listaPerfisEmpresa', idEmpresa],
          type: 'active',
        })
      } else {
        toast.warning(salvaPerfil.msg)
      }
    } catch {
      toast.error('Houve um problema ao salvar perfil, tente novamente!')
    }
  }

  return (
    <Form {...formNovoPerfil}>
      <form
        className="space-y-4"
        onSubmit={formNovoPerfil.handleSubmit(salvar)}
      >
        <div className="grid grid-cols-1 gap-2">
          <FormField
            control={formNovoPerfil.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do perfil" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formNovoPerfil.control}
            name="administrativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Administrativo</FormLabel>
                  <FormDescription>
                    {
                      'Selecione essa opção se os usuários desse perfil terá acesso ao sistema todo'
                    }
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row gap-2 float-right">
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => formNovoPerfil.reset()}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          {formNovoPerfil.formState.isSubmitting ? (
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
                Salvar perfil
              </Button>
            </DialogClose>
          )}
        </div>
      </form>
    </Form>
  )
}

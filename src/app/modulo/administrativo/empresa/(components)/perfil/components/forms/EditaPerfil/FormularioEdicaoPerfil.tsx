'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { modificarPerfil } from '@/app/modulo/administrativo/empresa/api/Perfil'
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

export interface FormularioEdicaoPerfilProps {
  idPerfil: string
  nomePerfil: string
  perfilAdministrativo: boolean
  idEmpresa: string
}

export function FormularioEdicaoPerfil({
  idPerfil,
  nomePerfil,
  perfilAdministrativo,
  idEmpresa,
}: FormularioEdicaoPerfilProps) {
  const formEdicaoPerfil = useForm<FormularioPerfilType>({
    resolver: zodResolver(schemaFormularioPerfil),
    defaultValues: {
      nome: nomePerfil,
      administrativo: perfilAdministrativo,
      empresa: idEmpresa,
    },
    mode: 'onChange',
  })

  async function salvar(data: FormularioPerfilType) {
    try {
      const salvaPerfil = await modificarPerfil({
        id: idPerfil,
        nome: data.nome,
        administrativo: data.administrativo,
        empresaId: idEmpresa,
      })

      if (salvaPerfil.status) {
        toast.success(salvaPerfil.msg)
        formEdicaoPerfil.reset()

        await queryClient.refetchQueries({
          queryKey: ['listaPerfisEmpresa', idEmpresa],
          type: 'active',
        })
      } else {
        toast.warning(salvaPerfil.msg)
      }
    } catch {
      toast.error(
        'Houve um problema ao salvar as modificações perfil, tente novamente!',
      )
    }
  }

  return (
    <Form {...formEdicaoPerfil}>
      <form
        className="space-y-4"
        onSubmit={formEdicaoPerfil.handleSubmit(salvar)}
      >
        <div className="grid grid-cols-1 gap-2">
          <FormField
            control={formEdicaoPerfil.control}
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
            control={formEdicaoPerfil.control}
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
              onClick={() => formEdicaoPerfil.reset()}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          {formEdicaoPerfil.formState.isSubmitting ? (
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

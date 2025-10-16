'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAtualizarCargo } from '../../../_hooks/cargos/useCargos'
import type { Cargo } from '../../../_types/cargos/CargoType'
import type { AtualizarCargoRequest } from '../../../_types/cargos/CargoType'

const editarCargoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  atribuicoes: z.string().min(1, 'Atribuições são obrigatórias'),
  superior: z.boolean().optional(),
  experienciaMinima: z.string().optional(),
  escolaridadeMinima: z.string().optional(),
})

interface FormularioEditarCargoProps {
  cargo: Cargo
  children: React.ReactNode
}

export function FormularioEditarCargo({
  cargo,
  children,
}: FormularioEditarCargoProps) {
  const [open, setOpen] = useState(false)
  const { mutate: editarCargo, isPending } = useAtualizarCargo()

  const form = useForm<AtualizarCargoRequest>({
    resolver: zodResolver(editarCargoSchema),
    defaultValues: {
      nome: '',
      atribuicoes: '',
      superior: false,
      experienciaMinima: '',
      escolaridadeMinima: '',
    },
  })

  useEffect(() => {
    if (cargo && open) {
      form.reset({
        nome: cargo.nome || '',
        atribuicoes: cargo.atribuicoes || '',
        superior: cargo.superior || false,
        experienciaMinima: cargo.experienciaMinima || '',
        escolaridadeMinima: cargo.escolaridadeMinima || '',
      })
    }
  }, [cargo, open, form])

  const onSubmit = (data: AtualizarCargoRequest) => {
    editarCargo(
      { id: cargo.id, data },
      {
        onSuccess: () => {
          toast.success('Cargo atualizado com sucesso!')
          setOpen(false)
        },
        onError: (error) => {
          console.error('Erro ao editar cargo:', error)
          toast.error('Erro ao editar cargo. Tente novamente.')
        },
      }
    )
  }

  const handleClose = () => {
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cargo</DialogTitle>
          <DialogDescription>
            Atualize as informações do cargo: {cargo?.nome}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cargo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Analista de Sistemas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="superior"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Exige educação Superior
                      </FormLabel>
                      <FormDescription>
                        Marque se este cargo vai exigir educação superior dos colaboradores na contratação
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="atribuicoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atribuições do Cargo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva as principais responsabilidades e atividades do cargo..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Descreva detalhadamente as responsabilidades do cargo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experienciaMinima"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiência Mínima</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 2 anos em análise de sistemas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="escolaridadeMinima"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escolaridade Mínima</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Superior completo em TI"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="shadow-md text-sm uppercase leading-none rounded "
              >
                {isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

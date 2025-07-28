'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useAtualizarTreinamento } from '../../../_hooks/treinamentos/useTreinamentos'
import {
    type EditarTreinamentoFormData,
    editarTreinamentoSchema,
} from '../../../_schemas/treinamentos/editarTreinamento.schema'
import type { TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'

interface FormularioEditarTreinamentoProps {
  treinamento: TreinamentosType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FormularioEditarTreinamento({
  treinamento,
  open,
  onOpenChange,
}: FormularioEditarTreinamentoProps) {
  const { mutate: atualizarTreinamento, isPending } = useAtualizarTreinamento()

  const form = useForm<EditarTreinamentoFormData>({
    resolver: zodResolver(editarTreinamentoSchema),
    defaultValues: {
      nome: '',
      tipo: 'integracao',
    },
  })

  // Atualizar valores do formulário quando o treinamento mudar
  useEffect(() => {
    if (treinamento && open) {
      form.reset({
        nome: treinamento.nome,
        tipo: treinamento.tipo,
      })
    }
  }, [treinamento, open, form])

  const onSubmit = (data: EditarTreinamentoFormData) => {
    atualizarTreinamento(
      {
        id: treinamento.id,
        data,
      },
      {
        onSuccess: () => {
          toast.success('Treinamento atualizado com sucesso!')
          onOpenChange(false)
        },
        onError: (error) => {
          console.error('Erro ao atualizar treinamento:', error)
          toast.error('Erro ao atualizar treinamento. Tente novamente.')
        },
      }
    )
  }

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Treinamento</DialogTitle>
          <DialogDescription>
            Atualize as informações do treinamento de capacitação ou integração.
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
                    <FormLabel>Nome do Treinamento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Treinamento de Segurança no Trabalho"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Treinamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="integracao">Integração</SelectItem>
                        <SelectItem value="capacitacao">Capacitação</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Integração: para novos funcionários. Capacitação: para
                      desenvolvimento de habilidades.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
                disabled={isPending}
              >
                {isPending ? 'Atualizando...' : 'Atualizar Treinamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

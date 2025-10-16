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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCriarPlanoTreinamento } from '../../../_hooks/treinamentos/useTreinamentos'
import {
    type CriarPlanoTreinamentoFormData,
    criarPlanoTreinamentoSchema,
} from '../../../_schemas/treinamentos/criarPlanoTreinamento.schema'
import type { TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'

interface FormularioAdicionarPlanoProps {
  treinamento: TreinamentosType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FormularioAdicionarPlano({
  treinamento,
  open,
  onOpenChange,
}: FormularioAdicionarPlanoProps) {
  const { mutate: criarPlano, isPending } = useCriarPlanoTreinamento()

  const form = useForm<CriarPlanoTreinamentoFormData>({
    resolver: zodResolver(criarPlanoTreinamentoSchema),
    defaultValues: {
      nome: '',
    },
  })

  const onSubmit = (data: CriarPlanoTreinamentoFormData) => {
    criarPlano(
      {
        treinamentoId: treinamento.id,
        data,
      },
      {
        onSuccess: () => {
          toast.success('Plano de treinamento adicionado com sucesso!')
          form.reset()
          onOpenChange(false)
        },
        onError: (error) => {
          console.error('Erro ao criar plano de treinamento:', error)
          toast.error('Erro ao adicionar plano. Tente novamente.')
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Plano de Treinamento</DialogTitle>
          <DialogDescription>
            Adicione um novo plano para o treinamento "{treinamento.nome}".
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {treinamento.nome}
                    </p>
                    <p className="text-xs text-blue-700 capitalize">
                      Tipo: {treinamento.tipo === 'integracao' ? 'Integração' : 'Capacitação'}
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Plano</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Normas de Segurança Básica"
                        {...field}
                      />
                    </FormControl>
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
                className="shadow-md text-sm uppercase leading-none rounded "
                disabled={isPending}
              >
                {isPending ? 'Adicionando...' : 'Adicionar Plano'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

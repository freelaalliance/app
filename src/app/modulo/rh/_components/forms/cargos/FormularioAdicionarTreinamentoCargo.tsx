'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAdicionarTreinamentoCargo, useTreinamentosCargo } from '../../../_hooks/cargos/useCargos'
import { useTreinamentosIntegracao } from '../../../_hooks/treinamentos/useTreinamentos'
import type { AdicionarTreinamentoCargoRequest, Cargo } from '../../../_types/cargos/CargoType'

const adicionarTreinamentoCargoSchema = z.object({
  treinamentoId: z.string().min(1, 'Selecione um treinamento'),
  observacoes: z.string().optional(),
})

interface FormularioAdicionarTreinamentoCargoProps {
  cargo: Cargo
  children: React.ReactNode
}

export function FormularioAdicionarTreinamentoCargo({
  cargo,
  children,
}: FormularioAdicionarTreinamentoCargoProps) {
  const [open, setOpen] = useState(false)
  const { mutate: adicionarTreinamento, isPending } = useAdicionarTreinamentoCargo()
  const { data: treinamentosIntegracao = [], isLoading: carregandoTreinamentos } = useTreinamentosIntegracao()
  const { data: treinamentosCargo = [] } = useTreinamentosCargo(cargo.id)

  const form = useForm<AdicionarTreinamentoCargoRequest>({
    resolver: zodResolver(adicionarTreinamentoCargoSchema),
    defaultValues: {
      treinamentoId: '',
    },
  })

  // Filtrar treinamentos que já estão associados ao cargo
  const treinamentosDisponiveis = treinamentosIntegracao.filter(
    treinamento => !treinamentosCargo.some(tc => tc.id === treinamento.id)
  )

  const onSubmit = (data: AdicionarTreinamentoCargoRequest) => {
    const treinamentoSelecionado = treinamentosIntegracao.find(t => t.id === data.treinamentoId)

    adicionarTreinamento(
      {
        cargoId: cargo.id,
        data
      },
      {
        onSuccess: () => {
          toast.success(`Treinamento "${treinamentoSelecionado?.nome}" adicionado ao cargo com sucesso!`)
          form.reset()
          setOpen(false)
        },
        onError: (error) => {
          console.error('Erro ao adicionar treinamento:', error)
          toast.error('Erro ao adicionar treinamento. Tente novamente.')
        },
      }
    )
  }

  const handleClose = () => {
    setOpen(false)
    form.reset()
  }

  const treinamentoSelecionado = treinamentosIntegracao.find(
    t => t.id === form.watch('treinamentoId')
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Treinamento</DialogTitle>
          <DialogDescription>
            Associe um treinamento ao cargo: <strong>{cargo.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="treinamentoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treinamento</FormLabel>
                    <Select
                      disabled={carregandoTreinamentos}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um treinamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treinamentosDisponiveis.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500 text-center">
                            {carregandoTreinamentos
                              ? 'Carregando treinamentos...'
                              : 'Todos os treinamentos já estão associados a este cargo'
                            }
                          </div>
                        ) : (
                          treinamentosDisponiveis.map(treinamento => (
                            <SelectItem key={treinamento.id} value={treinamento.id}>
                              <div className="flex items-center gap-2">
                                <span>{treinamento.nome}</span>
                                <Badge variant="outline" className="text-xs">
                                  Integração
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {treinamentoSelecionado && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-medium text-sm text-blue-900 mb-1">
                    {treinamentoSelecionado.nome}
                  </h4>
                  {treinamentoSelecionado.nome && (
                    <p className="text-xs text-blue-700">
                      {treinamentoSelecionado.tipo === 'integracao' ? 'Integração' : 'Capacitação'}
                    </p>
                  )}
                </div>
              )}
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
                disabled={isPending || treinamentosDisponiveis.length === 0}
                className="shadow-md text-sm uppercase leading-none rounded text-white bg-green-600 hover:bg-green-700"
              >
                {isPending ? 'Adicionando...' : 'Adicionar Treinamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

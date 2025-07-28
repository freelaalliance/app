'use client'

import { Button } from '@/components/ui/button'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useCargos } from '../../../_hooks/cargos/useCargos'
import { useTransferirColaborador } from '../../../_hooks/colaborador/useContratacaoColaborador'
import type { Contratacao } from '../../../_types/colaborador/ContratacaoType'

const transferirCargoSchema = z.object({
  novoCargoId: z.string().min(1, 'Selecione um cargo'),
})

type FormularioTransferirCargoData = z.infer<typeof transferirCargoSchema>

interface FormularioTransferirCargoProps {
  contratacao: Contratacao
  onSuccess?: () => void
}

export function FormularioTransferirCargo({
  contratacao,
  onSuccess,
}: FormularioTransferirCargoProps) {
  const { data: cargos, isLoading: isLoadingCargos } = useCargos()
  const { mutateAsync: transferirColaborador, isPending } = useTransferirColaborador()

  const form = useForm<FormularioTransferirCargoData>({
    resolver: zodResolver(transferirCargoSchema),
    defaultValues: {
      novoCargoId: '',
    },
  })

  const onSubmit = async (data: FormularioTransferirCargoData) => {
    try {
      await transferirColaborador({
        id: contratacao.id,
        data,
      })

      toast.success('Cargo transferido com sucesso!')
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao transferir cargo:', error)
      toast.error('Erro ao transferir cargo. Tente novamente.')
    }
  }

  // Filtrar cargos para não mostrar o cargo atual
  const cargosDisponiveis = cargos?.filter(cargo => cargo.id !== contratacao.cargo.id) || []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/20">
            <h4 className="font-medium mb-2">Informações Atuais</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Colaborador:</strong> {contratacao.colaborador.pessoa.nome}</p>
              <p><strong>Cargo Atual:</strong> {contratacao.cargo.nome}</p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="novoCargoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Novo Cargo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o novo cargo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingCargos ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Carregando cargos...
                      </div>
                    ) : cargosDisponiveis.length > 0 ? (
                      cargosDisponiveis.map((cargo) => (
                        <SelectItem key={cargo.id} value={cargo.id}>
                          {cargo.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Nenhum cargo disponível para transferência
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isPending || isLoadingCargos || cargosDisponiveis.length === 0}
            className="flex-1 shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
          >
            {isPending ? 'Transferindo...' : 'Confirmar Transferência'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

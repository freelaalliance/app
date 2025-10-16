import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEmpresa } from '@/lib/CaseAtom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { atualizarDescricaoItemAvaliativosRecebimento } from '../../../_api/AdmCompras'

const schemaAtualizacaoItemAvaliativoRecebimento = z.object({
  id: z.string().uuid(),
  descricao: z.string({
    required_error: 'Obrigatório adicionar a descrição do item',
  }),
})

export type ItemAvaliativoRecebimentoFormType = z.infer<
  typeof schemaAtualizacaoItemAvaliativoRecebimento
>

export interface AtualizacaoItemAvaliativoRecebimentoFormProps {
  id: string
  descricao: string
}

export function AtualizacaoItemAvaliativoRecebimentoForm({
  id,
  descricao
}: AtualizacaoItemAvaliativoRecebimentoFormProps) {
  const [empresaSelecionada] = useEmpresa()
  const queryClient = useQueryClient()
  const formItemAvaliatiosRecebimento =
    useForm<ItemAvaliativoRecebimentoFormType>({
      resolver: zodResolver(schemaAtualizacaoItemAvaliativoRecebimento),
      defaultValues: {
        descricao,
        id
      },
      mode: 'onChange',
    })

  const { mutateAsync: atualizacaoItemAvaliacao } = useMutation({
    mutationFn: atualizarDescricaoItemAvaliativosRecebimento,
    onError: (error) => {
      toast.error('Erro ao atualizar o item de avaliação do recebimento, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['itensAvaliativoRecebimentoEmpresa', empresaSelecionada.selected],
        exact: true,
      })
    },
  })

  const submitItensAvaliativosRecebimento = async (formulario: ItemAvaliativoRecebimentoFormType) => {
    await atualizacaoItemAvaliacao(formulario)
  }

  return (
    <Form {...formItemAvaliatiosRecebimento}>
      <form className="space-y-2" onSubmit={formItemAvaliatiosRecebimento.handleSubmit(submitItensAvaliativosRecebimento)}>
        
        <FormField
          control={formItemAvaliatiosRecebimento.control}
          name={'descricao'}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Descrição do item" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                formItemAvaliatiosRecebimento.reset()
              }}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="shadow-md text-sm uppercase leading-none rounded "
            disabled={formItemAvaliatiosRecebimento.formState.isSubmitting}
          >
            {formItemAvaliatiosRecebimento.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

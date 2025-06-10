'use client'

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
import { atualizarDescricaoItemAvaliativosExpedicao } from '../../../_api/AdmVendas'

const schemaAtualizacaoItemAvaliativoExpedicao = z.object({
  id: z.string().uuid(),
  pergunta: z.string({
    required_error: 'Obrigatório adicionar a descrição do item',
  }),
})

export type ItemAvaliativoExpedicaoFormType = z.infer<
  typeof schemaAtualizacaoItemAvaliativoExpedicao
>

export interface AtualizacaoItemAvaliativoExpedicaoFormProps {
  id: string
  pergunta: string
}

export function AtualizacaoItemAvaliativoExpedicaoForm({
  id,
  pergunta
}: AtualizacaoItemAvaliativoExpedicaoFormProps) {
  const [empresaSelecionada] = useEmpresa()
  const queryClient = useQueryClient()
  const formItemAvaliativosExpedicao =
    useForm<ItemAvaliativoExpedicaoFormType>({
      resolver: zodResolver(schemaAtualizacaoItemAvaliativoExpedicao),
      defaultValues: {
        pergunta,
        id
      },
      mode: 'onChange',
    })

  const { mutateAsync: atualizacaoItemExpedicao } = useMutation({
    mutationFn: atualizarDescricaoItemAvaliativosExpedicao,
    onError: (error) => {
      toast.error('Erro ao atualizar o item de avaliação de expedição, tente novamente!', {
        description: error.message,
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['itensAvaliativoExpedicaoEmpresa', empresaSelecionada.selected],
        exact: true,
      })
    },
  })

  const submitItensAvaliativosExpedicao = async (formulario: ItemAvaliativoExpedicaoFormType) => {
    await atualizacaoItemExpedicao(formulario)
  }

  return (
    <Form {...formItemAvaliativosExpedicao}>
      <form className="space-y-2" onSubmit={formItemAvaliativosExpedicao.handleSubmit(submitItensAvaliativosExpedicao)}>
        
        <FormField
          control={formItemAvaliativosExpedicao.control}
          name={'pergunta'}
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
                formItemAvaliativosExpedicao.reset()
              }}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
            disabled={formItemAvaliativosExpedicao.formState.isSubmitting}
          >
            {formItemAvaliativosExpedicao.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

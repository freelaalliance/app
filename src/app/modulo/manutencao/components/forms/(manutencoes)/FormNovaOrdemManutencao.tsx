'use client'

import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { criarNovaManutencaoEquipamento } from '../../../api/ManutencaoEquipamentoAPI'
import {
  type DadosNovaOrdemManutencaoType,
  schemaFormNovaOrdemManutencao
} from '../../../schemas/ManutencaoSchema'

export interface FormNovaOrdemManutencaoEquipamentoProps {
  equipamentoId: string
}

export function FormNovaOrdemManutencaoEquipamento({
  equipamentoId,
}: FormNovaOrdemManutencaoEquipamentoProps) {
  const queryClient = useQueryClient()
  const formNovaManutencao = useForm<DadosNovaOrdemManutencaoType>({
    resolver: zodResolver(schemaFormNovaOrdemManutencao),
    defaultValues: {
      observacao: '',
      equipamentoId,
    },
  })

  const { mutateAsync: criarNovaOrdemManutencao } = useMutation({
    mutationFn: criarNovaManutencaoEquipamento,
    onError: () => {
      toast.error('Erro ao criar nova manutenção para equipamento')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['manutencoes-equipamento', equipamentoId],
      })

      formNovaManutencao.reset()
      toast.success('Manutenção criada com sucesso')
    },
  })

  return (
    <Form {...formNovaManutencao}>
      <form
        className="flex-1 space-y-2"
        onSubmit={formNovaManutencao.handleSubmit(async dados => {
          await criarNovaOrdemManutencao(dados)
        })}
      >
        <FormField
          control={formNovaManutencao.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Estou enviando pelo o motivo de ..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Mencione os motivos e problemas do equipamento para o setor de
                manutenção
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="gap-2 md:gap-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => formNovaManutencao.reset()}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
          >
            Criar nova ordem
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

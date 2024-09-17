'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, Trash } from 'lucide-react'
import { useLayoutEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  listarPecasEquipamento,
  salvarNovasPecas,
} from '@/app/modulo/manutencao/api/EquipamentoAPi'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

import { MAX_PECAS_EQUIPAMENTO } from './utils-equipamento'

export interface NovaPecaEquipamentoProps {
  idEquipamento: string
}

const schemaNovaPecaEquipamento = z.object({
  pecas: z.array(
    z.object({
      nome: z
        .string({
          required_error: 'Necessário informar o nome do item',
        })
        .min(1, {
          message: 'Necessário informar o nome do item',
        }),
      descricao: z.string().optional(),
      equipamentoId: z.string(),
    }),
  ),
})

export function FormularioNovaPeca({
  idEquipamento,
}: NovaPecaEquipamentoProps) {
  const { data: listaPecas, isLoading: carregandoPecas } = useQuery({
    queryKey: ['pecasEquipamento', idEquipamento],
    queryFn: () => listarPecasEquipamento({ idEquipamento }),
  })

  const formNovaPecaEquipamento = useForm<
    z.infer<typeof schemaNovaPecaEquipamento>
  >({
    resolver: zodResolver(schemaNovaPecaEquipamento),
    defaultValues: {
      pecas: [],
    },
    mode: 'onChange',
  })

  const {
    fields: pecas,
    append: adicionarPeca,
    remove: removerPeca,
  } = useFieldArray({
    control: formNovaPecaEquipamento.control,
    name: 'pecas',
  })

  const { mutateAsync: salvarPecasEquipamento } = useMutation({
    mutationFn: salvarNovasPecas,
    onError: (error) => {
      toast.error('Erro ao salvar itens do equipamento', {
        description: error.message,
      })
    },
    onSuccess: () => {
      toast.success('Itens do equipamento salvas com sucesso!')
      formNovaPecaEquipamento.reset()
    },
  })

  useLayoutEffect(() => {
    const pecasEquipamento = formNovaPecaEquipamento.getValues('pecas')

    if (pecasEquipamento.length === 0) {
      adicionarPeca({
        nome: '',
        descricao: '',
        equipamentoId: idEquipamento,
      })
    }
  })

  return carregandoPecas ? (
    <div className="flex justify-center">
      <Loader2 className="size-10 animate-spin" />
    </div>
  ) : (
    <Form {...formNovaPecaEquipamento}>
      <form
        className="space-y-4"
        onSubmit={formNovaPecaEquipamento.handleSubmit(
          async (data: z.infer<typeof schemaNovaPecaEquipamento>) => {
            await salvarPecasEquipamento(data)
          },
        )}
      >
        <div className="grid">
          <div className="flex flex-col gap-2">
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-green-600  hover:bg-green-700"
              type="button"
              disabled={
                pecas.length + (listaPecas?.length ?? 0) >=
                MAX_PECAS_EQUIPAMENTO
              }
              onClick={() =>
                adicionarPeca({
                  nome: '',
                  descricao: '',
                  equipamentoId: idEquipamento,
                })
              }
            >
              Adicionar peça
            </Button>
            <ScrollArea className="max-h-52 md:max-h-72 w-full overflow-auto">
              {pecas.map((peca, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between gap-2 mb-4"
                >
                  <div className="flex flex-col w-full gap-2">
                    <FormField
                      key={peca.id}
                      control={formNovaPecaEquipamento.control}
                      name={`pecas.${index}.nome`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input {...field} placeholder="Nome do item" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      key={index}
                      control={formNovaPecaEquipamento.control}
                      name={`pecas.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Textarea
                              placeholder="Item responsável por..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
                    variant={'destructive'}
                    type="button"
                    onClick={() => removerPeca(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="gap-2 md:gap-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => formNovaPecaEquipamento.reset()}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
              type="submit"
            >
              Salvar itens
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}

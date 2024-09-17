'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Trash } from 'lucide-react'
import { useLayoutEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { criarEquipamento } from '@/app/modulo/manutencao/api/EquipamentoAPi'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

import {
  DadosEquipamentoType,
  FormularioNovoEquipamentoType,
  schemaFormularioNovoEquipamento,
} from '../../../schemas/EquipamentoSchema'

import { MAX_PECAS_EQUIPAMENTO } from './utils-equipamento'

export function NovoEquipamentoForm() {
  const queryClient = useQueryClient()
  const formNovoEquipamento = useForm<FormularioNovoEquipamentoType>({
    resolver: zodResolver(schemaFormularioNovoEquipamento),
    defaultValues: {
      nome: '',
      codigo: '',
      especificacao: '',
      frequencia: 0,
      tempoOperacao: 0,
      pecas: [],
    },
    mode: 'onChange',
  })

  const {
    fields: pecas,
    append: adicionarPeca,
    remove: removerPeca,
  } = useFieldArray({
    control: formNovoEquipamento.control,
    name: 'pecas',
  })

  const { mutateAsync: salvarEquipamento } = useMutation({
    mutationFn: criarEquipamento,
    onError: (error) => {
      toast.error('Erro ao salvar equipamento', {
        description: error.message,
      })
    },
    onSuccess: (dados) => {
      const listaEquipamentos: Array<DadosEquipamentoType> | undefined =
        queryClient.getQueryData(['listaEquipamentosEmpresa'])

      queryClient.setQueryData(
        ['listaEquipamentosEmpresa'],
        [...(listaEquipamentos ?? []), dados],
      )

      toast.success('Equipamento salvo com sucesso!')
      formNovoEquipamento.reset()
    },
  })

  const processarFormulario = async (data: FormularioNovoEquipamentoType) => {
    await salvarEquipamento(data)
  }

  useLayoutEffect(() => {
    const pecasEquipamento = formNovoEquipamento.getValues('pecas')

    if (pecasEquipamento.length === 0) {
      adicionarPeca({
        nome: '',
        descricao: '',
      })
    }
  })

  return (
    <Form {...formNovoEquipamento}>
      <form
        className="space-y-4"
        onSubmit={formNovoEquipamento.handleSubmit(processarFormulario)}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 space-y-2 md:space-x-4">
          <div className="md:col-span-2 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <FormField
                control={formNovoEquipamento.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formNovoEquipamento.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Equipamento A1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={formNovoEquipamento.control}
                name="frequencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência inspeção (DIAS)</FormLabel>
                    <FormControl>
                      <Input placeholder="30 dias" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formNovoEquipamento.control}
                name="tempoOperacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo de operação (minutos)</FormLabel>
                    <FormControl>
                      <Input placeholder="3600 minutos (1h)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={formNovoEquipamento.control}
              name="especificacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes do que deve ser verificado"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-3 grid space-y-2">
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-green-600  hover:bg-green-700"
              type="button"
              disabled={pecas.length >= MAX_PECAS_EQUIPAMENTO}
              onClick={() => adicionarPeca({ nome: '', descricao: '' })}
            >
              Adicionar item
            </Button>
            <ScrollArea className="max-h-52 md:max-h-72 w-full overflow-auto">
              {pecas.map((peca, index) => (
                <>
                  <div
                    key={index}
                    className="flex flex-row justify-between space-x-2 mb-4"
                  >
                    <div className="grid w-full gap-2">
                      <FormField
                        key={peca.id}
                        control={formNovoEquipamento.control}
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
                        control={formNovoEquipamento.control}
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
                </>
              ))}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="gap-2 md:gap-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => formNovoEquipamento.reset()}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          {formNovoEquipamento.formState.isSubmitting ? (
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700 gap-2"
              disabled
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </Button>
          ) : (
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
              type="submit"
            >
              Salvar equipamento
            </Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  )
}

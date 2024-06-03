'use client'

import { useFieldArray, useForm } from "react-hook-form"
import { DadosEquipamentoType, FormularioNovoEquipamentoType, schemaFormularioNovoEquipamento } from "../../schemas/EquipamentoSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLayoutEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { criarEquipamento } from "../../api/EquipamentoAPi"
import { toast } from "sonner"

export function NovoEquipamentoForm() {

  const queryClient = useQueryClient()
  const formNovoEquipamento = useForm<FormularioNovoEquipamentoType>({
    resolver: zodResolver(schemaFormularioNovoEquipamento),
    defaultValues: {
      nome: '',
      codigo: '',
      especificacao: '',
      frequencia: 0,
      pecas: []
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
      const listaEquipamentos: Array<DadosEquipamentoType> | undefined = queryClient.getQueryData(['listaEquipamentosEmpresa'])

      queryClient.setQueryData(
        ['listaEquipamentosEmpresa'],
        [...(listaEquipamentos ?? []), dados],
      )

      toast.success('Equipamento salvo com sucesso!')
      formNovoEquipamento.reset()
    }
  })

  const processarFormulario = async (data: FormularioNovoEquipamentoType) => {
    await salvarEquipamento(data)
  }

  useLayoutEffect(() => {
    const pecasEquipamento = formNovoEquipamento.getValues('pecas')

    if (pecasEquipamento.length === 0) {
      adicionarPeca({
        nome: '',
        descricao: ''
      })
    }
  })

  return (
    <Form {...formNovoEquipamento}>
      <form className="space-y-4" onSubmit={formNovoEquipamento.handleSubmit(processarFormulario)}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="md:col-span-2">
            <div className="grid">
              <FormField
                control={formNovoEquipamento.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
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
            </div>
            <div className="grid gap-2">
              <FormField
                control={formNovoEquipamento.control}
                name="especificacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especificações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Equipamento responsavel por..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>
          <div className="md:col-span-3">
            <div className="grid">
              <div className="flex flex-col gap-2">
                <Button
                  className="shadow-md text-sm uppercase leading-none rounded text-white bg-green-600  hover:bg-green-700"
                  type="button"
                  onClick={() =>
                    adicionarPeca({ nome: '', descricao: '' })
                  }
                >
                  Adicionar peça
                </Button>
                <ScrollArea className="max-h-72 w-full rounded-md border px-2">
                  {pecas.map((peca, index) => (
                    <>
                      <div
                        key={index}
                        className="flex flex-row justify-between gap-2 my-2"
                      >
                        <div className="flex flex-col w-full gap-2">
                          <FormField
                            key={peca.id}
                            control={formNovoEquipamento.control}
                            name={`pecas.${index}.nome`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Input {...field} placeholder="Nome da peça" />
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
                                    placeholder="Peça responsável por..."
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
          </div>
        </div>
        <DialogFooter>
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
          {
            formNovoEquipamento.formState.isSubmitting ? (
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
            )
          }
        </DialogFooter>
      </form>
    </Form>
  )
}
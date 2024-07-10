'use client'

import { DadosInspecoesEquipamentoType, DadosPecasEquipamentoType } from "../../../schemas/EquipamentoSchema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DadosInspecaoType, schemaFormInspecao } from "../../../schemas/InspecaoSchema";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { salvarInspecaoEquipamento } from "@/app/modulo/manutencao/api/InspecaoEquipamentoAPI";

interface NovaInspecaoFormProps {
  pecasEquipamento: Array<DadosPecasEquipamentoType>
  idEquipamento: string
  fecharModalInspecao: () => void
}

export function NovaInspecaoForm({
  pecasEquipamento,
  idEquipamento,
  fecharModalInspecao
}: NovaInspecaoFormProps) {

  const [alertOpen, setAlertOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const [todosItensInspecionado, setarInspecionado] = React.useState(false)
  const [todosItensAprovado, setarItensAprovado] = React.useState(false)

  const formInspecao = useForm<DadosInspecaoType>({
    resolver: zodResolver(schemaFormInspecao),
    defaultValues: {
      iniciadoEm: new Date(),
      finalizadoEm: undefined,
      equipamentoId: idEquipamento,
      observacao: undefined,
      inspecaoPeca: pecasEquipamento.map((peca) => ({
        pecaEquipamentoId: peca.id,
        aprovado: false,
        inspecionadoEm: null,
        inspecionado: false
      }))
    },
    mode: 'onChange',
  })

  const {
    fields: pecas,
  } = useFieldArray({
    control: formInspecao.control,
    name: 'inspecaoPeca',
  })

  function verificarTodosItensInspecionado() {

    const todosItensInspecionado = formInspecao.getValues('inspecaoPeca').filter((peca) => !peca.inspecionado).length > 0 ? false : true

    todosItensInspecionado ? formInspecao.setValue('finalizadoEm', new Date()) : formInspecao.setValue('finalizadoEm', undefined)

    return todosItensInspecionado
  }

  function verificarTodosItensAprovados() {
    return formInspecao.getValues('inspecaoPeca').find((inspecao) => !inspecao.aprovado) ? false : true
  }

  function verificaDadosInspecao() {
    const dadosFormulario = formInspecao.getValues('inspecaoPeca')

    if (dadosFormulario.find((inspecao) => !inspecao.aprovado)) {
      return 'Deseja realmente enviar esse equipamento para a manutenção?'
    }

    return 'Deseja realmente salvar a inspeção desse equipamento?'
  }

  const { mutateAsync: salvarInspecao } = useMutation({
    mutationFn: salvarInspecaoEquipamento,
    onError: (error) => {
      toast.error('Erro ao salvar inspeção do equipamento', {
        description: error.message,
      })
    },
    onSuccess: (dados) => {
      const listaInspecaoEquipamento: Array<DadosInspecoesEquipamentoType> | undefined = queryClient.getQueryData([
        'listaInspecoesEquipamento', idEquipamento
      ])

      queryClient.setQueryData(
        ['listaInspecoesEquipamento', idEquipamento],
        [...(listaInspecaoEquipamento ?? []), dados]
      )

      if (!todosItensAprovado && todosItensInspecionado) {
        toast.info('Equipamento enviado para manutenção com sucesso!')
      }
      else if (todosItensAprovado && todosItensInspecionado) {
        toast.success('Inspeção salva com sucesso!')
      }
      else {
        toast.success('Inspeção pausado com sucesso com sucesso!')
      }

      fecharModalInspecao()
      formInspecao.reset()
    }
  })

  async function pausarInspecao(dados: DadosInspecaoType) {
    await salvarInspecao(dados)
  }

  async function encerrarInspecao(dados: DadosInspecaoType) {

    if (!todosItensInspecionado) {
      toast.warning('Necessário marcar todos os itens como inspecionado para salvar!')
    }
    else {
      formInspecao.setValue('finalizadoEm', new Date())

      const observacaoManutencao = formInspecao.getValues('observacao')

      if (!todosItensAprovado && (observacaoManutencao === '' || !observacaoManutencao)) {
        toast.warning('Necessário preencher a observação de manutenção para encerrar a inspeção!')
        formInspecao.setError('observacao', {
          type: "required",
          message: "Observação de manutenção é obrigatória",
        })
      }
      else {
        await salvarInspecao(dados)
      }

      setAlertOpen(false)
    }
  }

  return (
    <Form {...formInspecao}>
      <form className="space-y-2">
        <div className="grid gap-2">
          <ScrollArea className="max-h-72 w-full">
            {
              pecas.map((peca, index) => (
                <div
                  key={index}
                  className="flex-1 flex-row justify-between gap-2 my-2 p-4 space-y-4 rounded-md border"
                >
                  <div>
                    <FormField
                      key={`${peca.id}.aprovacao`}
                      control={formInspecao.control}
                      name={`inspecaoPeca.${index}.aprovado`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked)
                                formInspecao.setValue(`inspecaoPeca.${index}.inspecionadoEm`, new Date())

                                setarItensAprovado(verificarTodosItensAprovados())

                                if (checked) {
                                  formInspecao.setValue(`inspecaoPeca.${index}.inspecionado`, true)
                                  formInspecao.trigger(`inspecaoPeca.${index}.inspecionado`)
                                  setarInspecionado(verificarTodosItensInspecionado())
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-0.5 leading-none">
                            <FormLabel className="text-base">
                              {
                                `Item ${pecasEquipamento.find(
                                  (pecaEquipamento) => pecaEquipamento.id === formInspecao.getValues(`inspecaoPeca.${index}.pecaEquipamentoId`)
                                )?.nome ?? ''} aprovado`
                              }
                            </FormLabel>
                            <FormDescription>
                              Se aprovado na inspeção, marque para aprovar
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      key={`${peca.id}.inspecao`}
                      control={formInspecao.control}
                      name={`inspecaoPeca.${index}.inspecionado`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked)
                                if (checked) {
                                  formInspecao.setValue(`inspecaoPeca.${index}.inspecionadoEm`, new Date())
                                }
                                else {
                                  formInspecao.setValue(`inspecaoPeca.${index}.inspecionadoEm`, null)
                                  formInspecao.setValue(`inspecaoPeca.${index}.aprovado`, false)
                                  formInspecao.trigger(`inspecaoPeca.${index}.aprovado`)
                                }

                                setarInspecionado(verificarTodosItensInspecionado())
                              }}
                            />
                          </FormControl>
                          <div className="space-y-0.5 leading-none">
                            <FormLabel className="text-base">
                              Item inspecionado
                            </FormLabel>
                            <FormDescription>
                              Se o item foi inspecionado marque para validar
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))
            }
          </ScrollArea>
          {
            todosItensInspecionado && !todosItensAprovado && (
              <FormField
                control={formInspecao.control}
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
                      Mencione os motivos e problemas do equipamento para o setor de manutenção
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          }
        </div>
        <DialogFooter>
          <Button
            onClick={formInspecao.handleSubmit(pausarInspecao)}
            disabled={pecasEquipamento.length === 0 || todosItensInspecionado}
            type="button"
            className="shadow-md text-sm uppercase leading-none bg-yellow-500 rounded text-white hover:bg-yellow-700"
          >
            Pausar inspeção
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => formInspecao.reset()}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
                type="button"
                disabled={pecasEquipamento.length === 0 || !todosItensInspecionado}
              >
                Encerrar inspeção
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Salvar inspeção
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {verificaDadosInspecao()}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-red-200 text-red-700 hover:bg-red-300 shadow border-0">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={formInspecao.handleSubmit(encerrarInspecao)
                } className="bg-emerald-200 text-emerald-700 hover:bg-emerald-300 shadow">
                  Encerrar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </form>
    </Form>
  )
}
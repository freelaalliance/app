'use client'

import { salvarFinalizacaoInspecaoEquipamento } from '@/app/modulo/manutencao/api/InspecaoEquipamentoAPI'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLayoutEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { DadosInspecoesEquipamentoType } from '../../../schemas/EquipamentoSchema'
import {
  type DadosFinalizacaoInspecaoType,
  type PontosInspecaoType,
  schemaFormFinalizacaoInspecao,
} from '../../../schemas/InspecaoSchema'

interface RetomadaInspecaoFormProps {
  dadosInspecao: DadosInspecoesEquipamentoType
  pontosInspecao: PontosInspecaoType
}

export function RetomadaInspecaoForm({
  dadosInspecao,
  pontosInspecao,
}: RetomadaInspecaoFormProps) {
  const queryClient = useQueryClient()

  const [todosItensInspecionado, setarInspecionado] = useState(false)
  const [todosItensAprovado, setarItensAprovado] = useState(false)

  const formFinalizacaoInspecao = useForm<DadosFinalizacaoInspecaoType>({
    resolver: zodResolver(schemaFormFinalizacaoInspecao),
    defaultValues: {
      id: dadosInspecao.id,
      iniciadoEm: new Date(dadosInspecao.iniciadoEm),
      equipamentoId: dadosInspecao.equipamentoId,
      inspecaoPeca: pontosInspecao.map(ponto => ({
        pecaEquipamentoId: ponto.pecasEquipamento.id,
        aprovado: ponto.aprovado,
        inspecionadoEm: ponto.inspecionadoEm
          ? new Date(ponto.inspecionadoEm)
          : new Date(),
        inspecionado: !!ponto.inspecionadoEm,
      })),
    },
    mode: 'onChange',
  })

  const { fields: pecas } = useFieldArray({
    control: formFinalizacaoInspecao.control,
    name: 'inspecaoPeca',
  })

  function verificarTodosItensInspecionado() {
    const todosItensInspecionado =
      !(
        formFinalizacaoInspecao
          .getValues('inspecaoPeca')
          .filter(peca => !peca.inspecionado).length > 0)

    todosItensInspecionado
      ? formFinalizacaoInspecao.setValue('finalizadoEm', new Date())
      : formFinalizacaoInspecao.setValue('finalizadoEm', undefined)

    return todosItensInspecionado
  }

  function verificarTodosItensAprovados() {
    return !formFinalizacaoInspecao
      .getValues('inspecaoPeca')
      .find(inspecao => !inspecao.aprovado)
  }

  const { mutateAsync: salvarFinalizacaoInspecao } = useMutation({
    mutationFn: salvarFinalizacaoInspecaoEquipamento,
    onError: error => {
      toast.error('Erro ao salvar inspeção do equipamento', {
        description: error.message,
      })
    },
    onSuccess: () => {
      const listaInspecaoEquipamento:
        | Array<DadosInspecoesEquipamentoType>
        | undefined = queryClient.getQueryData([
          'listaInspecoesEquipamento',
          dadosInspecao.equipamentoId,
        ])

      const dataHoraFinalizado =
        formFinalizacaoInspecao.getValues('finalizadoEm')

      queryClient.setQueryData(
        ['listaInspecoesEquipamento', dadosInspecao.equipamentoId],
        listaInspecaoEquipamento?.map(inspecao => {
          if (inspecao.id === dadosInspecao.id) {
            return {
              equipamentoId: inspecao.equipamentoId,
              statusInspecao: todosItensAprovado ? 'aprovado' : 'reprovado',
              id: inspecao.id,
              usuario: {
                pessoa: {
                  nome: inspecao.usuario.pessoa.nome,
                },
              },
              iniciadoEm: new Date(inspecao.iniciadoEm),
              finalizadoEm: dataHoraFinalizado
                ? new Date(dataHoraFinalizado)
                : new Date(),
              PontosInspecaoEquipamento: formFinalizacaoInspecao
                .getValues('inspecaoPeca')
                .map(pontos => {
                  return {
                    pecaEquipamentoId: pontos.pecaEquipamentoId,
                    inspecionadoEm: pontos.inspecionadoEm
                      ? new Date(pontos.inspecionadoEm)
                      : null,
                  }
                }),
            }
          }

          return inspecao
        })
      )

      if (!verificarTodosItensAprovados()) {
        toast.info('Equipamento enviado para manutenção com sucesso!')
      } else {
        toast.success('Inspeção salva com sucesso!')
      }

      formFinalizacaoInspecao.reset()
    },
  })

  async function encerrarInspecao(dados: DadosFinalizacaoInspecaoType) {
    if (!todosItensInspecionado) {
      toast.warning(
        'Necessário marcar todos os itens como inspecionado para salvar!'
      )
    } else {
      formFinalizacaoInspecao.setValue('finalizadoEm', new Date())

      const observacaoManutencao =
        formFinalizacaoInspecao.getValues('observacao')

      if (
        !todosItensAprovado &&
        (observacaoManutencao === '' || !observacaoManutencao)
      ) {
        toast.warning(
          'Necessário preencher a observação de manutenção para encerrar a inspeção!'
        )
        formFinalizacaoInspecao.setError('observacao', {
          type: 'required',
          message: 'Observação de manutenção é obrigatória',
        })
      } else {
        await salvarFinalizacaoInspecao(dados)
      }
    }
  }

  useLayoutEffect(() => {
    setarItensAprovado(verificarTodosItensAprovados())
    setarInspecionado(verificarTodosItensInspecionado())
  })

  return (
    <>
      <Form {...formFinalizacaoInspecao}>
        <form
          className="space-y-2"
          onSubmit={formFinalizacaoInspecao.handleSubmit(encerrarInspecao)}
        >
          <div className="grid gap-2">
            <ScrollArea className="max-h-72 w-full">
              {pecas.map((peca, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className="flex-1 flex-row justify-between gap-2 my-2 p-4 space-y-4 rounded-md border"
                >
                  <FormField
                    key={`${peca.id}.aprovacao`}
                    control={formFinalizacaoInspecao.control}
                    name={`inspecaoPeca.${index}.aprovado`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked)
                              formFinalizacaoInspecao.setValue(
                                `inspecaoPeca.${index}.inspecionadoEm`,
                                new Date()
                              )

                              setarItensAprovado(
                                verificarTodosItensAprovados()
                              )

                              if (checked) {
                                formFinalizacaoInspecao.setValue(
                                  `inspecaoPeca.${index}.inspecionado`,
                                  true
                                )
                                formFinalizacaoInspecao.trigger(
                                  `inspecaoPeca.${index}.inspecionado`
                                )
                                setarInspecionado(
                                  verificarTodosItensInspecionado()
                                )
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-0.5 leading-none">
                          <FormLabel className="text-base">
                            {`Item ${pontosInspecao.find(
                              pecaEquipamento =>
                                pecaEquipamento.pecasEquipamento.id ===
                                formFinalizacaoInspecao.getValues(
                                  `inspecaoPeca.${index}.pecaEquipamentoId`
                                )
                            )?.pecasEquipamento.nome ?? ''
                              } aprovado`}
                          </FormLabel>
                          <FormDescription>
                            Se aprovado na inspeção, marque para aprovar
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={`${peca.id}.inspecao`}
                    control={formFinalizacaoInspecao.control}
                    name={`inspecaoPeca.${index}.inspecionado`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked)
                              if (checked) {
                                formFinalizacaoInspecao.setValue(
                                  `inspecaoPeca.${index}.inspecionadoEm`,
                                  new Date()
                                )
                              } else {
                                formFinalizacaoInspecao.setValue(
                                  `inspecaoPeca.${index}.inspecionadoEm`,
                                  undefined
                                )
                                formFinalizacaoInspecao.setValue(
                                  `inspecaoPeca.${index}.aprovado`,
                                  false
                                )
                                formFinalizacaoInspecao.trigger(
                                  `inspecaoPeca.${index}.aprovado`
                                )
                              }

                              setarInspecionado(
                                verificarTodosItensInspecionado()
                              )
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
                  <FormField
                    key={`${peca.id}.observacao`}
                    control={formFinalizacaoInspecao.control}
                    name={`inspecaoPeca.${index}.observacao`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-base">
                          Observação do item
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observação do item ..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mencione os motivos e problemas do item para o setor
                          de manutenção, caso tenha algo a relatar sobre o item inspecionado
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </ScrollArea>
            {todosItensInspecionado && !todosItensAprovado && (
              <FormField
                control={formFinalizacaoInspecao.control}
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
                      Mencione os motivos e problemas do equipamento para o
                      setor de manutenção
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <DialogFooter className="gap-2 md:gap-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant={'destructive'}
                onClick={() => formFinalizacaoInspecao.reset()}
                className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600  hover:bg-sky-700"
              disabled={pontosInspecao.length === 0 || !todosItensInspecionado}
            >
              Encerrar inspeção
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

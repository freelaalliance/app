'use client'

import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMutation } from "@tanstack/react-query"
import { Trash } from "lucide-react"
import { useLayoutEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { salvarNovasPecas } from "../../api/EquipamentoAPi"
import { toast } from "sonner"

export interface NovaPecaEquipamentoProps {
  idEquipamento: string
}

const schemaNovaPecaEquipamento = z.object({
  pecas: z.array(z.object({
    nome: z.string({
      required_error: 'Necessário informar o nome da peça'
    }).min(1, {
      message: 'Necessário informar o nome da peça'
    }),
    descricao: z.string().optional(),
    equipamentoId: z.string()
  }))
})

export function FormularioNovaPeca({ idEquipamento }: NovaPecaEquipamentoProps) {

  const formNovaPecaEquipamento = useForm<z.infer<typeof schemaNovaPecaEquipamento>>({
    resolver: zodResolver(schemaNovaPecaEquipamento),
    defaultValues: {
      pecas: []
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
      toast.error('Erro ao salvar peças do equipamento', {
        description: error.message,
      })
    },
    onSuccess: () => {
      toast.success('Peças do equipamento salvas com sucesso!')
      formNovaPecaEquipamento.reset()
    }
  })

  useLayoutEffect(() => {
    const pecasEquipamento = formNovaPecaEquipamento.getValues('pecas')

    if (pecasEquipamento.length === 0) {
      adicionarPeca({
        nome: '',
        descricao: '',
        equipamentoId: idEquipamento
      })
    }
  })

  return (
    <Form {...formNovaPecaEquipamento}>
      <form className="space-y-4" onSubmit={formNovaPecaEquipamento.handleSubmit(async (data: z.infer<typeof schemaNovaPecaEquipamento>) => {
        await salvarPecasEquipamento(data)
      })}>
        <div className="grid">
          <div className="flex flex-col gap-2">
            <Button
              className="shadow-md text-sm uppercase leading-none rounded text-white bg-green-600  hover:bg-green-700"
              type="button"
              onClick={() =>
                adicionarPeca({ nome: '', descricao: '', equipamentoId: idEquipamento })
              }
            >
              Adicionar peça
            </Button>
            <ScrollArea className="max-h-72 w-full rounded-md border px-2">
              {pecas.map((peca, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between gap-2 my-2"
                >
                  <div className="flex flex-col w-full gap-2">
                    <FormField
                      key={peca.id}
                      control={formNovaPecaEquipamento.control}
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
                      control={formNovaPecaEquipamento.control}
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
              ))}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
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
              Salvar peças
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}
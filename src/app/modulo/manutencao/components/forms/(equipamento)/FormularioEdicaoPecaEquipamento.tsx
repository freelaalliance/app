'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { atualizarPecaEquipamento } from "@/app/modulo/manutencao/api/EquipamentoAPi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DadosPecasEquipamentoType } from "../../../schemas/EquipamentoSchema";

export interface EdicaoPecaProps {
  idPeca: string;
  idEquipamento: string;
  nome: string;
  descricao?: string;
}

const schemaEdicaoPecaEquipamento = z.object({
  id: z.string(),
  equipamentoId: z.string(),
  nome: z.string({
    required_error: 'Necessário informar o nome do item'
  }).min(1, {
    message: 'Necessário informar o nome do item'
  }),
  descricao: z.string().optional(),
})

export function FormularioEdicaoPeca({ idPeca, idEquipamento, nome, descricao }: EdicaoPecaProps) {

  const queryClient = useQueryClient()
  const formEdicaoPecaEquipamento = useForm<z.infer<typeof schemaEdicaoPecaEquipamento>>({
    resolver: zodResolver(schemaEdicaoPecaEquipamento),
    defaultValues: {
      id: idPeca,
      equipamentoId: idEquipamento,
      nome: nome,
      descricao: descricao,
    },
    mode: 'onChange',
  })

  const { mutateAsync: atualizarPeca } = useMutation({
    mutationFn: atualizarPecaEquipamento,
    onError: (error) => {
      toast.error('Erro ao atualizar o item do equipamento', {
        description: error.message,
      })
    },
    onSuccess: (data) => {
      const listaPecasEquipamento: Array<DadosPecasEquipamentoType> | undefined = queryClient.getQueryData([
        'listaPecasEquipamento', idEquipamento
      ])

      queryClient.setQueryData(
        ['listaPecasEquipamento', idEquipamento],
        listaPecasEquipamento?.map((pecaEquipamento) => {
          if(pecaEquipamento.id === idPeca){
            return data
          }

          return pecaEquipamento
        })
      )

      toast.success('Item do equipamento atualizado com sucesso!')
      formEdicaoPecaEquipamento.reset()
    }
  })

  return (
    <Form {...formEdicaoPecaEquipamento}>
      <form className="space-y-4" onSubmit={formEdicaoPecaEquipamento.handleSubmit(async (data: z.infer<typeof schemaEdicaoPecaEquipamento>) => {
        await atualizarPeca(data)
      })}>
        <div className="grid gap-2">
          <FormField
            control={formEdicaoPecaEquipamento.control}
            name={`nome`}
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
            control={formEdicaoPecaEquipamento.control}
            name={`descricao`}
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
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => formEdicaoPecaEquipamento.reset()}
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
              Salvar item
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}
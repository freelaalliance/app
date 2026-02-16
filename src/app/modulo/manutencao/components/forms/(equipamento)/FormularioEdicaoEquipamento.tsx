'use client'

import { atualizarEquipamento } from "@/app/modulo/manutencao/api/EquipamentoAPi";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schemaEdicaoEquipamentoProps = z.object({
  id: z.string().uuid(),
  codigo: z.coerce.string({
    required_error: 'Necessário informar o código do equipamento'
  }).min(1, {
    message: 'Necessário informar o código do equipamento'
  }).trim(),
  nome: z.coerce.string({
    required_error: 'Necessário informar o nome do equipamento'
  }).min(1, {
    message: 'Necessário informar o nome do equipamento'
  }),
  tempoOperacao: z.coerce.number({
    required_error: 'Necessário informar o tempo de operação do equipamento'
  }).min(1, {
    message: 'Necessário informar o tempo mínimo de operação do equipamento'
  }),
  especificacao: z.string().optional(),
  frequencia: z.coerce.number({
    required_error: 'Necessário informar a frequência de inspeção para o equipamento'
  }).min(1, {
    message: 'Necessário informar a frequência de inspeção para o equipamento'
  }),
})

export type FormEdicaoEquipamentoType = z.infer<typeof schemaEdicaoEquipamentoProps>

export interface FormEdicaoEquipamentoProps {
  id: string;
  codigo: string;
  nome: string;
  especificacao?: string;
  tempoOperacao: number;
  frequencia: number;
}

export function EdicaoEquipamentoForm({ id, codigo, nome, especificacao, frequencia, tempoOperacao }: FormEdicaoEquipamentoProps) {

  const queryClient = useQueryClient()
  const formEdicaoEquipamento = useForm<FormEdicaoEquipamentoType>({
    resolver: zodResolver(schemaEdicaoEquipamentoProps),
    defaultValues: {
      id: id,
      codigo: codigo,
      nome: nome,
      especificacao: especificacao,
      tempoOperacao: tempoOperacao,
      frequencia: frequencia,
    },
    mode: 'onChange',
  })

  const { mutateAsync: salvarEdicaoEquipamento } = useMutation({
    mutationFn: atualizarEquipamento,
    onError: (error) => {
      toast.error('Erro ao salvar equipamento', {
        description: error.message,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listaEquipamentosEmpresa'] })

      toast.success('Equipamento salvo com sucesso!')
      formEdicaoEquipamento.reset()
    }
  })

  const processarFormulario = async (data: FormEdicaoEquipamentoType) => {
    await salvarEdicaoEquipamento(data)
  }

  return (
    <Form {...formEdicaoEquipamento}>
      <form className="space-y-4" onSubmit={formEdicaoEquipamento.handleSubmit(processarFormulario)}>
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
              control={formEdicaoEquipamento.control}
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
              control={formEdicaoEquipamento.control}
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
              control={formEdicaoEquipamento.control}
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
              control={formEdicaoEquipamento.control}
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
          <div className="grid gap-2">
            <FormField
              control={formEdicaoEquipamento.control}
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
        <DialogFooter className="gap-2 md:gap-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => formEdicaoEquipamento.reset()}
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
              Salvar equipamento
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  )
}
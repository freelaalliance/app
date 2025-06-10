
'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { produtoServicoSchema } from '../../../_schemas/produtoServico.schema'
import {
  useCriarProdutoServico,
  useEditarProdutoServico,
} from '../../../_servicos/useProdutoServico'

export type ProdutoServicoInput = z.infer<typeof produtoServicoSchema>

type Props = {
  defaultValues?: ProdutoServicoInput
  id?: string
}

export function FormularioProdutoServico({ defaultValues, id }: Props) {
  const form = useForm<ProdutoServicoInput>({
    resolver: zodResolver(produtoServicoSchema),
    defaultValues: defaultValues || {
      nome: '',
      descricao: '',
      tipo: 'PRODUTO',
      preco: 0,
    },
  })

  const mutation = id ? useEditarProdutoServico(id) : useCriarProdutoServico()

  function onSubmit(data: ProdutoServicoInput) {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset()
        toast.success(
          id ? 'Produto/Serviço atualizado com sucesso!' : 'Produto/Serviço criado com sucesso!')
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-xl"
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                >
                  <option value="PRODUTO">Produto</option>
                  <option value="SERVICO">Serviço</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
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
                form.reset()
              }}
              className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

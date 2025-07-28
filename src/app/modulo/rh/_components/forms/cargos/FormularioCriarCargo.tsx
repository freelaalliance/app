'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useCriarCargo } from '../../../_hooks/cargos/useCargos'
import { useTreinamentosIntegracao } from '../../../_hooks/treinamentos/useTreinamentos'
import type { CriarCargoRequest } from '../../../_types/cargos/CargoType'

const criarCargoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  atribuicoes: z.string().min(1, 'Atribuições são obrigatórias'),
  superior: z.boolean().optional(),
  experienciaMinima: z.string().optional(),
  escolaridadeMinima: z.string().optional(),
  treinamentos: z.array(z.object({ id: z.string() })).optional(),
})

interface FormularioCriarCargoProps {
  children: React.ReactNode
}

export function FormularioCriarCargo({
  children,
}: FormularioCriarCargoProps) {
  const [open, setOpen] = useState(false)
  const { mutate: criarCargo, isPending } = useCriarCargo()
  const { data: treinamentosIntegracao = [], isLoading: carregandoTreinamentos } = useTreinamentosIntegracao()

  const form = useForm<CriarCargoRequest>({
    resolver: zodResolver(criarCargoSchema),
    defaultValues: {
      nome: '',
      atribuicoes: '',
      superior: false,
      experienciaMinima: '',
      escolaridadeMinima: '',
      treinamentos: [],
    },
  })

  const treinamentosSelecionados = form.watch('treinamentos') || []

  const onSubmit = (data: CriarCargoRequest) => {
    criarCargo(data, {
      onSuccess: () => {
        toast.success('Cargo criado com sucesso!')
        form.reset()
        setOpen(false)
      },
      onError: (error) => {
        console.error('Erro ao criar cargo:', error)
        toast.error('Erro ao criar cargo. Tente novamente.')
      },
    })
  }

  const handleClose = () => {
    setOpen(false)
    form.reset()
  }

  const adicionarTreinamento = (treinamentoId: string) => {
    const treinamentosAtuais = form.getValues('treinamentos') || []
    if (!treinamentosAtuais.some(t => t.id === treinamentoId)) {
      form.setValue('treinamentos', [...treinamentosAtuais, { id: treinamentoId }])
    }
  }

  const removerTreinamento = (treinamentoId: string) => {
    const treinamentosAtuais = form.getValues('treinamentos') || []
    form.setValue('treinamentos', treinamentosAtuais.filter(t => t.id !== treinamentoId))
  }

  const getTreinamentoNome = (id: string) => {
    return treinamentosIntegracao.find(t => t.id === id)?.nome || 'Treinamento não encontrado'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cargo</DialogTitle>
          <DialogDescription>
            Crie um novo cargo definindo suas atribuições e treinamentos necessários.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cargo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Analista de Sistemas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="superior"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Exige educação Superior
                      </FormLabel>
                      <FormDescription>
                        Marque se este cargo vai exigir educação superior dos colaboradores na contratação
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="atribuicoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atribuições do Cargo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva as principais responsabilidades e atividades do cargo..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Descreva detalhadamente as responsabilidades do cargo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experienciaMinima"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiência Mínima</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 2 anos em análise de sistemas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="escolaridadeMinima"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escolaridade Mínima</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Superior completo em TI"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormLabel>Treinamentos de Integração</FormLabel>

                <div className="space-y-3">
                  <Select
                    disabled={carregandoTreinamentos}
                    onValueChange={(value) => adicionarTreinamento(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um treinamento para adicionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {treinamentosIntegracao
                        .filter(t => !treinamentosSelecionados.some(ts => ts.id === t.id))
                        .map(treinamento => (
                          <SelectItem key={treinamento.id} value={treinamento.id}>
                            {treinamento.nome}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>

                  {treinamentosSelecionados.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Treinamentos Selecionados:</p>
                      <div className="space-y-2">
                        {treinamentosSelecionados.map((treinamento) => (
                          <div
                            key={treinamento.id}
                            className="flex items-center justify-between p-2 border rounded-md bg-blue-50"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Integração
                              </Badge>
                              <span className="text-sm">
                                {getTreinamentoNome(treinamento.id)}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removerTreinamento(treinamento.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {carregandoTreinamentos && (
                    <p className="text-sm text-gray-500">Carregando treinamentos...</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="shadow-md text-sm uppercase leading-none bg-padrao-red rounded text-white hover:bg-red-800"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
              >
                {isPending ? 'Criando...' : 'Criar Cargo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

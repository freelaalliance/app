'use client'

import { Button } from '@/components/ui/button'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCriarTreinamento } from '../../../_hooks/treinamentos/useTreinamentos'
import {
  type CriarTreinamentoFormData,
  criarTreinamentoSchema,
} from '../../../_schemas/treinamentos/criarTreinamento.schema'

interface FormularioCriarTreinamentoProps {
  children: React.ReactNode
}

export function FormularioCriarTreinamento({
  children,
}: FormularioCriarTreinamentoProps) {
  const [open, setOpen] = useState(false)
  const { mutate: criarTreinamento, isPending } = useCriarTreinamento()

  const form = useForm<CriarTreinamentoFormData>({
    resolver: zodResolver(criarTreinamentoSchema),
    defaultValues: {
      nome: '',
      tipo: 'integracao',
      planos: [{ nome: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'planos',
  })

  const onSubmit = (data: CriarTreinamentoFormData) => {
    criarTreinamento(data, {
      onSuccess: () => {
        toast.success('Treinamento criado com sucesso!')
        form.reset()
        setOpen(false)
      },
      onError: (error) => {
        console.error('Erro ao criar treinamento:', error)
        toast.error('Erro ao criar treinamento. Tente novamente.')
      },
    })
  }

  const handleClose = () => {
    setOpen(false)
    form.reset()
  }

  const adicionarPlano = () => {
    if (fields.length < 10) {
      append({ nome: '' })
    }
  }

  const removerPlano = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Treinamento</DialogTitle>
          <DialogDescription>
            Crie um novo treinamento de capacitação ou integração com seus
            planos de ação.
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
                    <FormLabel>Nome do Treinamento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Treinamento de Segurança no Trabalho"
                        {...field}
                      />
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
                    <FormLabel>Tipo de Treinamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="integracao">Integração</SelectItem>
                        <SelectItem value="capacitacao">Capacitação</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Integração: para novos funcionários. Capacitação: para
                      desenvolvimento de habilidades.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Planos de Treinamento</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={adicionarPlano}
                    disabled={fields.length >= 10}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Plano
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`planos.${index}.nome`}
                      render={({ field: inputField }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormControl className="flex-1">
                              <Input
                                placeholder={`Nome do plano ${index + 1}`}
                                {...inputField}
                              />
                            </FormControl>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removerPlano(index)}
                                className="h-10 w-10 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {fields.length === 10 && (
                  <p className="text-sm text-muted-foreground">
                    Máximo de 10 planos por treinamento atingido.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className='gap-2'>
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
                className="shadow-md text-sm uppercase leading-none rounded text-white bg-sky-600 hover:bg-sky-700"
                disabled={isPending}
              >
                {isPending ? 'Criando...' : 'Criar Treinamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent, CardHeader,
  CardTitle
} from '@/components/ui/card'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarIcon, GraduationCap, Trash2,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import UploadForm from '../../../../documentos/[id]/novo/_components/upload/upload-documentos'
import { useColaboradoresCargo } from '../../../_hooks/cargos/useCargos'
import { useCargos } from '../../../_hooks/cargos/useCargos'
import {
  useCadastrarTreinamentoRealizado,
  useTreinamentosPorCargo,
} from '../../../_hooks/colaborador/useTreinamentosColaborador'
import type { CadastrarTreinamentoRealizadoRequest } from '../../../_types/colaborador/ContratacaoType'

const realizadoItemSchema = z.object({
  contratacaoColaboradorId: z.string().uuid('Colaborador inválido'),
  nomeColaborador: z.string().optional(),
  iniciadoEm: z.coerce.date({
    required_error: 'Data de início é obrigatória',
  }),
  finalizadoEm: z.coerce.date({
    required_error: 'Data de finalização é obrigatória',
  }).optional(),
  certificado: z.string().optional(),
})

const formSchema = z.object({
  cargoId: z.string().uuid('Selecione um cargo'),
  modo: z.enum(['existente', 'novo']),
  treinamentosId: z.string().optional(),
  novoTreinamento: z
    .object({
      nome: z
        .string()
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome não pode ter mais de 100 caracteres'),
      tipo: z.enum(['integracao', 'capacitacao', 'reciclagem'], {
        required_error: 'Tipo é obrigatório',
      }),
      grupo: z.enum(['interno', 'externo']).default('interno'),
    })
    .optional(),
  realizados: z
    .array(realizadoItemSchema)
    .min(1, 'Informe pelo menos um colaborador'),
}).refine(
  (data) => {
    if (data.modo === 'existente') return !!data.treinamentosId
    return true
  },
  { message: 'Selecione um treinamento', path: ['treinamentosId'] }
).refine(
  (data) => {
    if (data.modo === 'novo') return !!data.novoTreinamento?.nome
    return true
  },
  { message: 'Preencha os dados do novo treinamento', path: ['novoTreinamento.nome'] }
)

type FormData = z.infer<typeof formSchema>

interface FormularioCadastrarTreinamentoRealizadoProps {
  children: React.ReactNode
}

export function FormularioCadastrarTreinamentoRealizado({
  children,
}: FormularioCadastrarTreinamentoRealizadoProps) {
  const [open, setOpen] = useState(false)
  const { mutate: cadastrar, isPending } = useCadastrarTreinamentoRealizado()
  const { data: listaCargos } = useCargos()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cargoId: '',
      modo: 'existente',
      treinamentosId: '',
      novoTreinamento: {
        nome: '',
        tipo: 'integracao',
        grupo: 'interno',
      },
      realizados: [],
    },
  })

  const cargoId = form.watch('cargoId')
  const modo = form.watch('modo')

  const { data: treinamentosCargo, isFetching: carregandoTreinamentos } =
    useTreinamentosPorCargo(cargoId)
  const { data: colaboradoresCargo, isFetching: carregandoColaboradores } =
    useColaboradoresCargo(cargoId)

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'realizados',
  })

  // Reseta campos dependentes quando cargo muda
  useEffect(() => {
    if (cargoId) {
      form.setValue('treinamentosId', '')
      form.setValue('realizados', [])
    }
  }, [cargoId, form])

  const adicionarColaborador = (contratacaoId: string) => {
    const contratacao = colaboradoresCargo?.find((c) => c.id === contratacaoId)
    if (!contratacao) return

    append({
      contratacaoColaboradorId: contratacao.id,
      nomeColaborador: contratacao.colaborador?.nome ?? '',
      iniciadoEm: new Date(),
      finalizadoEm: undefined,
      certificado: '',
    })
  }

  const adicionarTodosColaboradores = () => {
    for (const c of colaboradoresCargo || []) {
      append({
        contratacaoColaboradorId: c.id,
        nomeColaborador: c.colaborador?.nome ?? '',
        iniciadoEm: new Date(),
        finalizadoEm: undefined,
        certificado: '',
      })
    }
  }

  const onSubmit = (data: FormData) => {
    const payload: CadastrarTreinamentoRealizadoRequest = {
      cargoId: data.cargoId,
      realizados: data.realizados.map((r) => ({
        contratacaoColaboradorId: r.contratacaoColaboradorId,
        iniciadoEm: r.iniciadoEm.toISOString(),
        finalizadoEm: r?.finalizadoEm?.toISOString(),
        certificado: r.certificado || undefined,
      })),
    }

    if (data.modo === 'existente' && data.treinamentosId) {
      payload.treinamentosId = data.treinamentosId
    } else if (data.modo === 'novo' && data.novoTreinamento) {
      payload.treinamento = {
        nome: data.novoTreinamento.nome,
        tipo: data.novoTreinamento.tipo,
        grupo: data.novoTreinamento.grupo,
      }
    }

    cadastrar(payload, {
      onSuccess: (response) => {
        const msg = response.data.msg || 'Treinamento(s) cadastrado(s) com sucesso!'
        toast.success(msg)
        form.reset()
        setOpen(false)
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { msg?: string } } }
        toast.error(
          err?.response?.data?.msg ??
          'Erro ao cadastrar treinamento. Tente novamente.'
        )
      },
    })
  }

  const handleClose = () => {
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Treinamento Realizado</DialogTitle>
          <DialogDescription>
            Registre um treinamento realizado para colaboradores de um cargo
            específico.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Seleção de Cargo */}
            <FormField
              control={form.control}
              name="cargoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {listaCargos?.map((cargo) => (
                        <SelectItem key={cargo.id} value={cargo.id}>
                          {cargo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione o cargo dos colaboradores que realizaram o
                    treinamento.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {cargoId && (
              <>
                <Separator />

                {/* Modo: existente ou novo */}
                <FormField
                  control={form.control}
                  name="modo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treinamento</FormLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={
                            field.value === 'existente' ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => field.onChange('existente')}
                        >
                          Selecionar existente
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === 'novo' ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => field.onChange('novo')}
                        >
                          Criar novo
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {modo === 'existente' ? (
                  <FormField
                    control={form.control}
                    name="treinamentosId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treinamento do Cargo</FormLabel>
                        {carregandoTreinamentos ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o treinamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {treinamentosCargo?.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{t.nome}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {t.tipo === 'integracao'
                                        ? 'Integração'
                                        : t.tipo === 'capacitacao'
                                          ? 'Capacitação'
                                          : 'Reciclagem'}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {treinamentosCargo?.length === 0 &&
                          !carregandoTreinamentos && (
                            <p className="text-sm text-muted-foreground">
                              Nenhum treinamento vinculado a esse cargo. Crie um
                              novo.
                            </p>
                          )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-4 rounded-lg border p-4">
                    <h4 className="text-sm font-medium">Novo Treinamento</h4>
                    <FormField
                      control={form.control}
                      name="novoTreinamento.nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: NR-12 Segurança"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="novoTreinamento.tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="integracao">
                                  Integração
                                </SelectItem>
                                <SelectItem value="capacitacao">
                                  Capacitação
                                </SelectItem>
                                <SelectItem value="reciclagem">
                                  Reciclagem
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="novoTreinamento.grupo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grupo</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Grupo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="interno">Interno</SelectItem>
                                <SelectItem value="externo">Externo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Colaboradores */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Colaboradores</h4>
                      <p className="text-xs text-muted-foreground">
                        Selecione os colaboradores que realizaram o treinamento
                      </p>
                    </div>
                    {colaboradoresCargo && colaboradoresCargo.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={fields.length === colaboradoresCargo.length}
                        onClick={adicionarTodosColaboradores}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Adicionar todos
                      </Button>
                    )}
                  </div>

                  {carregandoColaboradores ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : colaboradoresCargo && colaboradoresCargo.length > 0 ? (
                    <Select onValueChange={adicionarColaborador}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {colaboradoresCargo?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.colaborador?.nome ?? 'Sem nome'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : fields.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum colaborador ativo neste cargo.
                    </p>
                  ) : null}

                  {/* Lista de colaboradores selecionados */}
                  {fields.length > 0 && (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card key={field.id} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4" />
                                  {field.nomeColaborador || 'Colaborador'}
                                </div>
                              </CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <FormField
                                control={form.control}
                                name={`realizados.${index}.iniciadoEm`}
                                render={({ field: dateField }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs">
                                      Início
                                    </FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              'w-full pl-3 text-left font-normal text-xs',
                                              !dateField.value &&
                                              'text-muted-foreground'
                                            )}
                                          >
                                            {dateField.value
                                              ? format(
                                                dateField.value,
                                                'dd/MM/yyyy',
                                                { locale: ptBR }
                                              )
                                              : 'Selecione'}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={dateField.value}
                                          onSelect={dateField.onChange}
                                          locale={ptBR}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`realizados.${index}.finalizadoEm`}
                                render={({ field: dateField }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs">
                                      Finalização
                                    </FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              'w-full pl-3 text-left font-normal text-xs',
                                              !dateField.value &&
                                              'text-muted-foreground'
                                            )}
                                          >
                                            {dateField.value
                                              ? format(
                                                dateField.value,
                                                'dd/MM/yyyy',
                                                { locale: ptBR }
                                              )
                                              : 'Selecione'}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={dateField.value}
                                          onSelect={dateField.onChange}
                                          locale={ptBR}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`realizados.${index}.certificado`}
                                render={() => (
                                  <FormItem className='sm:col-span-2'>
                                    <FormLabel className="text-xs">
                                      Certificado
                                    </FormLabel>
                                    <FormControl>
                                      <UploadForm
                                        prefixo="certificados/treinamento-realizado"
                                        onUploadSuccess={(_uuid, keyCompleta) => {
                                          form.setValue(`realizados.${index}.certificado`, keyCompleta)
                                        }}
                                        arquivoSelecionado={() => { }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {form.formState.errors.realizados?.root && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.realizados.root.message}
                    </p>
                  )}
                </div>
              </>
            )}

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
                className="shadow-md text-sm uppercase leading-none rounded"
                disabled={isPending || fields.length === 0}
              >
                {isPending ? 'Cadastrando...' : 'Cadastrar Treinamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

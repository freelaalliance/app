import { z } from 'zod'

const realizadoItemSchema = z.object({
  contratacaoColaboradorId: z.string().uuid('Colaborador inválido'),
  iniciadoEm: z.coerce.date({
    required_error: 'Data de início é obrigatória',
  }),
  finalizadoEm: z.coerce.date({
    required_error: 'Data de finalização é obrigatória',
  }),
  certificado: z.string().optional(),
})

const treinamentoExistenteSchema = z.object({
  modo: z.literal('existente'),
  treinamentosId: z.string().uuid('Treinamento inválido'),
  treinamento: z.undefined().optional(),
})

const novoTreinamentoSchema = z.object({
  modo: z.literal('novo'),
  treinamentosId: z.undefined().optional(),
  treinamento: z.object({
    nome: z
      .string()
      .min(1, 'Nome do treinamento é obrigatório')
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome não pode ter mais de 100 caracteres'),
    tipo: z.enum(['integracao', 'capacitacao', 'reciclagem'], {
      required_error: 'Tipo de treinamento é obrigatório',
    }),
    grupo: z.enum(['interno', 'externo']).default('interno'),
  }),
})

export const cadastrarTreinamentoRealizadoSchema = z
  .discriminatedUnion('modo', [treinamentoExistenteSchema, novoTreinamentoSchema])
  .and(
    z.object({
      cargoId: z.string().uuid('Cargo inválido'),
      realizados: z
        .array(realizadoItemSchema)
        .min(1, 'É necessário informar pelo menos um colaborador'),
    })
  )

export type CadastrarTreinamentoRealizadoFormData = z.infer<
  typeof cadastrarTreinamentoRealizadoSchema
>

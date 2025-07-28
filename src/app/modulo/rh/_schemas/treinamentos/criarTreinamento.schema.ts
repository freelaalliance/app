import { z } from 'zod'

export const criarTreinamentoSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome do treinamento é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  tipo: z.enum(['integracao', 'capacitacao'], {
    required_error: 'Tipo de treinamento é obrigatório',
  }),
  planos: z
    .array(
      z.object({
        nome: z
          .string()
          .min(1, 'Nome do plano é obrigatório')
          .min(3, 'Nome do plano deve ter pelo menos 3 caracteres')
          .max(100, 'Nome do plano não pode ter mais de 100 caracteres'),
      })
    )
    .min(1, 'Pelo menos um plano de treinamento é obrigatório')
    .max(10, 'Máximo de 10 planos por treinamento'),
})

export type CriarTreinamentoFormData = z.infer<typeof criarTreinamentoSchema>

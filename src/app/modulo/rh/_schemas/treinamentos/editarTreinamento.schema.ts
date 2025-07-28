import { z } from 'zod'

export const editarTreinamentoSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome do treinamento é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  tipo: z.enum(['integracao', 'capacitacao'], {
    required_error: 'Tipo de treinamento é obrigatório',
  }),
})

export type EditarTreinamentoFormData = z.infer<typeof editarTreinamentoSchema>

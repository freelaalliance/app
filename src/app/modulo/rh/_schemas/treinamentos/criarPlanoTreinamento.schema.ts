import { z } from 'zod'

export const criarPlanoTreinamentoSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome do plano é obrigatório')
    .min(3, 'Nome do plano deve ter pelo menos 3 caracteres')
    .max(100, 'Nome do plano não pode ter mais de 100 caracteres'),
})

export type CriarPlanoTreinamentoFormData = z.infer<typeof criarPlanoTreinamentoSchema>

import { z } from 'zod'

export const adicionarTreinamentoCargoSchema = z.object({
  treinamentoId: z
    .string()
    .min(1, 'Seleção de treinamento é obrigatória'),
})

export type AdicionarTreinamentoCargoFormData = z.infer<typeof adicionarTreinamentoCargoSchema>

import { z } from 'zod'

export const editarCargoSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome do cargo é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  atribuicoes: z
    .string()
    .min(1, 'Atribuições são obrigatórias')
    .min(10, 'Atribuições devem ter pelo menos 10 caracteres')
    .max(500, 'Atribuições não podem ter mais de 500 caracteres'),
  superior: z.boolean().default(false),
  experienciaMinima: z
    .string()
    .min(1, 'Experiência mínima é obrigatória')
    .max(200, 'Experiência mínima não pode ter mais de 200 caracteres'),
  escolaridadeMinima: z
    .string()
    .min(1, 'Escolaridade mínima é obrigatória')
    .max(100, 'Escolaridade mínima não pode ter mais de 100 caracteres'),
})

export type EditarCargoFormData = z.infer<typeof editarCargoSchema>

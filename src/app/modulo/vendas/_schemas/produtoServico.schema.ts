import { z } from 'zod'

export const produtoServicoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  tipo: z.enum(['PRODUTO', 'SERVICO']),
  preco: z.coerce.number().positive({ message: 'Preço deve ser positivo' }),
})

export type ProdutoServicoFormType = z.infer<typeof produtoServicoSchema>
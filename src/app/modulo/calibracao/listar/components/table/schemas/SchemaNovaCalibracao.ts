import { z } from 'zod'

export const calibracaoEsquema = z.object({
  id: z.string(),
  idInstrumento: z.string(),
  nome: z.string().trim(),
  localizacao: z.string().trim(),
  marca: z.string().trim(),
  codigo: z.string().trim(),
  data: z.date(),
  status: z.string(),
  certificado: z.string().trim(),
})

export type Calibracao = z.infer<typeof calibracaoEsquema>

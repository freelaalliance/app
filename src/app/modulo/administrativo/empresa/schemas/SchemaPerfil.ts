import { z } from 'zod'

export const schemaPerfil = z.object({
  id: z.string(),
  nome: z.string().trim(),
  administrativo: z.boolean(),
  empresaId: z.string().uuid(),
})

export type PerfilType = z.infer<typeof schemaPerfil>

export const schemaFormularioPerfil = z.object({
  nome: z
    .string({
      required_error: 'Necessário informar o nome do perfil',
    })
    .trim(),
  administrativo: z.boolean().default(false),
  empresa: z.string().uuid(),
})

export type FormularioPerfilType = z.infer<typeof schemaFormularioPerfil>

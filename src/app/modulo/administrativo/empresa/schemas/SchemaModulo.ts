import { z } from 'zod'

export const schemaModulo = z.object({
  id: z.string().uuid(),
  nome: z.string().trim(),
  url: z.string(),
})

export const schemaFuncoesModulo = z.object({
  id: z.string().uuid(),
  nome: z.string().trim(),
  url: z.string(),
})

export const schemaPermissoesPerfil = z.object({
  id: z.string().uuid(),
  nome: z.string().trim(),
  url: z.string(),
  moduloId: z.string().uuid(),
  moduloNome: z.string().trim(),
})

export const schemaPermissaoVinculadoPerfil = z.object({
  id: z.string().uuid(),
  nome: z.string().trim(),
  moduloNome: z.string().trim(),
})

export type ModuloType = z.infer<typeof schemaModulo>

export type FuncaoModuloType = z.infer<typeof schemaFuncoesModulo>

export type PermissaoPerfilType = z.infer<typeof schemaPermissoesPerfil>

export type PermissaoVinculadoPerfilType = z.infer<
  typeof schemaPermissaoVinculadoPerfil
>

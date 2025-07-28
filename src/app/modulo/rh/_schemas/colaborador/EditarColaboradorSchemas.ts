import { z } from 'zod'

export const schemaEndereco = z.object({
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  cep: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido'),
})

export const schemaTelefone = z.object({
  numero: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
})

export const schemaEmail = z.object({
  email: z.string().email('Email inválido'),
})

export const schemaEditarColaborador = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  documento: z.string().min(11, 'CPF deve ter 11 dígitos').max(11, 'CPF deve ter 11 dígitos'),
  endereco: schemaEndereco.optional(),
  telefones: z.array(schemaTelefone).optional(),
  emails: z.array(schemaEmail).optional(),
})

export type EditarColaboradorData = z.infer<typeof schemaEditarColaborador>

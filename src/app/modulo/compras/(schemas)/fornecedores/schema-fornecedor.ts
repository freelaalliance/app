import { z } from 'zod'

import { validarDocumento } from '@/lib/utils'

export const schemaCadastroFornecedorForm = z.object({
  nome: z.string(),
  documento: z
    .string({
      required_error: 'O documento da empresa é obrigatório',
    })
    .min(14, {
      message: 'O documento precisa ter no mínimo 14 caractéres',
    })
    .refine(validarDocumento, {
      message: 'Documento da fornecedor inválido',
    }),
  critico: z.boolean().default(false),
  cep: z
    .string({
      required_error: 'Necessário informar o cep',
    })
    .min(8, {
      message: 'O cep precisa ter 8 caractéres',
    })
    .trim(),
  logradouro: z
    .string({
      required_error: 'Necessário informar o logradouro da empresa',
    })
    .trim(),
  numero: z
    .string({
      required_error: 'Obrigatório informar o número do endereço',
    })
    .min(1, {
      message: 'Obrigatório informar o número do endereço',
    }),
  bairro: z.string({
    required_error: 'Obrigatório informar o bairro do endereço',
  }),
  cidade: z.string({
    required_error: 'Obrigatório informar o nome da cidade',
  }),
  estado: z.string({
    required_error: 'Necessário informar o estado da cidade',
  }),
  complemento: z.string().optional(),
  aprovado: z.boolean(),
  nota: z.coerce
    .number()
    .min(0)
    .max(100, {
      message: 'A nota precisa ser entre 0 e 100',
    })
    .default(0),
  validade: z.date().optional(),
  telefones: z.array(
    z.object({
      codigoArea: z
        .string({
          required_error: 'Código área (DDD) obrigatório',
        })
        .max(2, {
          message: 'Código área (DDD) inválido',
        }),
      numero: z
        .string({
          required_error: 'Número do contato obrigatório',
        })
        .max(9, {
          message: 'Número do contato inválido',
        }),
    }),
  ),
  emails: z.array(
    z.object({
      email: z
        .string({
          required_error: 'Email obrigatório',
        })
        .email({
          message: 'Email inválido',
        }),
    }),
  ),
  documentos: z.array(
    z.object({
      nome: z.string(),
      arquivo: z.string(),
    }),
  ),
})

export const schemaFornecedorForm = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  documento: z
    .string({
      required_error: 'O documento da empresa é obrigatório',
    })
    .min(14, {
      message: 'O documento precisa ter no mínimo 14 caractéres',
    })
    .refine(validarDocumento, {
      message: 'Documento da fornecedor inválido',
    }),
  critico: z.boolean().default(false),
})

export const schemaEnderecoForm = z.object({
  id: z.string().uuid().optional(),
  cep: z
    .string({
      required_error: 'Necessário informar o cep',
    })
    .min(8, {
      message: 'O cep precisa ter 8 caractéres',
    })
    .trim(),
  logradouro: z
    .string({
      required_error: 'Necessário informar o logradouro da empresa',
    })
    .trim(),
  numero: z
    .string({
      required_error: 'Obrigatório informar o número do endereço',
    })
    .min(1, {
      message: 'Obrigatório informar o número do endereço',
    }),
  bairro: z.string({
    required_error: 'Obrigatório informar o bairro do endereço',
  }),
  cidade: z.string({
    required_error: 'Obrigatório informar o nome da cidade',
  }),
  estado: z.string({
    required_error: 'Necessário informar o estado da cidade',
  }),
  complemento: z.string().optional(),
})

export type EnderecoFornecedorType = z.infer<typeof schemaEnderecoForm>

export const schemaTelefoneForm = z.object({
  id: z.string().uuid().optional(),
  codigoArea: z
    .string({
      required_error: 'Código área (DDD) obrigatório',
    })
    .max(3, {
      message: 'Código área (DDD) inválido',
    }),
  numero: z
    .string({
      required_error: 'Número do contato obrigatório',
    })
    .max(9, {
      message: 'Número do contato inválido',
    }),
})

export const schemaEmailForm = z.object({
  id: z.string().uuid().optional(),
  email: z
    .string({
      required_error: 'Email obrigatório',
    })
    .email({
      message: 'Email inválido',
    }),
})

export const schemaDocumentoForm = z.object({
  id: z.string().uuid().optional(),
  nome: z.string(),
  arquivo: z.string(),
  observacao: z.string().nullable().optional(),
})

export const schemaAvaliacaoFornecedor = z.object({
  idFornecedor: z.string().uuid(),
  critico: z.boolean().default(false),
  aprovado: z.boolean(),
  nota: z.coerce
    .number()
    .min(0)
    .max(100, {
      message: 'A nota precisa ser entre 0 e 100',
    })
    .default(0),
  validade: z.date(),
})

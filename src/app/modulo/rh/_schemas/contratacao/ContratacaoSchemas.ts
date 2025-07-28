import { validarDocumento } from '@/lib/utils'
import { z } from 'zod'

// Schema para criação de nova contratação
export const schemaCriarContratacao = z.object({
  admitidoEm: z.coerce.date({
    required_error: 'Data de admissão é obrigatória',
  }),
  cargoId: z.string({
    required_error: 'Cargo é obrigatório',
  }).uuid({
    message: 'Cargo inválido',
  }),
  colaborador: z.object({
    documento: z.string({
      required_error: 'Documento (CPF) é obrigatório',
    }).min(11, {
      message: 'Documento deve ter no mínimo 11 caracteres',
    }).max(11, {
      message: 'Documento deve ter no máximo 11 caracteres',
    }).length(11)
    .refine(validarDocumento, {
        message: 'Documento da pessoa inválido',
      }),
    pessoa: z.object({
      nome: z.string({
        required_error: 'Nome é obrigatório',
      }).min(2, {
        message: 'Nome deve ter no mínimo 2 caracteres',
      }).trim(),
      EmailPessoa: z.array(
        z.object({
          email: z.string({
            required_error: 'Email é obrigatório',
          }).email({
            message: 'Email inválido',
          }),
        })
      ).optional(),
      TelefonePessoa: z.array(
        z.object({
          codigoArea: z.string({
            required_error: 'DDD é obrigatório',
          }).min(2, {
            message: 'DDD deve ter 2 dígitos',
          }).max(2, {
            message: 'DDD deve ter 2 dígitos',
          }),
          numero: z.string({
            required_error: 'Número é obrigatório',
          }).min(8, {
            message: 'Número deve ter no mínimo 8 dígitos',
          }).max(9, {
            message: 'Número deve ter no máximo 9 dígitos',
          }),
        })
      ).optional(),
      Endereco: z.object({
        logradouro: z.string({
          required_error: 'Logradouro é obrigatório',
        }).min(1, {
          message: 'Logradouro é obrigatório',
        }),
        numero: z.string({
          required_error: 'Número é obrigatório',
        }).min(1, {
          message: 'Número é obrigatório',
        }),
        bairro: z.string({
          required_error: 'Bairro é obrigatório',
        }).min(1, {
          message: 'Bairro é obrigatório',
        }),
        cidade: z.string({
          required_error: 'Cidade é obrigatória',
        }).min(1, {
          message: 'Cidade é obrigatória',
        }),
        estado: z.string({
          required_error: 'Estado é obrigatório',
        }).min(2, {
          message: 'Estado deve ter 2 caracteres',
        }).max(2, {
          message: 'Estado deve ter 2 caracteres',
        }),
        cep: z.string({
          required_error: 'CEP é obrigatório',
        }).min(8, {
          message: 'CEP deve ter 8 dígitos',
        }).max(8, {
          message: 'CEP deve ter 8 dígitos',
        }),
        complemento: z.string().optional(),
      }).optional(),
    }),
  }),
  documentosContrato: z.array(
    z.object({
      id: z.string().optional(), // ID único gerado no frontend
      documento: z.string({
        required_error: 'Nome do documento é obrigatório',
      }).min(1, {
        message: 'Nome do documento é obrigatório',
      }),
      arquivo: z.instanceof(File).optional(), // Arquivo para upload
      chaveArquivo: z.string().optional(), // Chave do arquivo no S3
      urlArquivo: z.string().optional(), // URL do arquivo após upload
      uploading: z.boolean().optional(), // Estado de upload
    })
  ).optional(),
})

export type CriarContratacaoFormType = z.infer<typeof schemaCriarContratacao>

// Valores padrão do formulário
export const valoresFormPadrao: Partial<CriarContratacaoFormType> = {
  admitidoEm: new Date(),
  cargoId: '',
  colaborador: {
    documento: '',
    pessoa: {
      nome: '',
      EmailPessoa: [{ email: '' }],
      TelefonePessoa: [{ codigoArea: '', numero: '' }],
      Endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: '',
      },
    },
  },
  documentosContrato: [],
}

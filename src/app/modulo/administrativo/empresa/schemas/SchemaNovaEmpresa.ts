import { z } from 'zod'

import { validaCNPJ } from '@/lib/utils'

const empresaFormSchema = z.object({
  nome: z
    .string({
      required_error: 'O nome da empresa é obrigatório',
    })
    .trim(),
  cnpj: z
    .string({
      required_error: 'O documento da empresa é obrigatório',
    })
    .min(14, {
      message: 'O documento precisa ter no mínimo 14 caractéres',
    })
    .refine(validaCNPJ, {
      message: 'Documento da empresa inválido',
    }),
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

export type EmpresaFormType = z.infer<typeof empresaFormSchema>
export type empresaType = {
    id: string;
    nome: string;
    idPessoa: string;
    cnpj: string;
    idEndereco: string | undefined;
    logradouro: string | undefined;
    numero: string | undefined;
    bairro: string | undefined;
    cidade: string | undefined;
    estado: string | undefined;
    cep: string | undefined;
    complemento: string | undefined;
}

const valoresFormPadrao: Partial<EmpresaFormType> = {
  nome: '',
  cnpj: '',
  cep: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  complemento: '',
}

export { empresaFormSchema, valoresFormPadrao }

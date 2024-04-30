import { z } from 'zod'

const calibracaoFormSchema = z.object({
  nomeInstrumento: z.coerce
    .string({
      required_error: 'Obrigatório informar o nome do instrumento!',
    })
    .min(1, {
      message: 'Obrigatório informar o nome do instrumento!',
    })
    .trim(),
  localizacaoInstrumento: z.coerce
    .string({
      required_error: 'Obrigatório informar a localização do instrumento!',
    })
    .min(1, {
      message: 'Obrigatório informar a localização do instrumento!',
    })
    .trim(),
  marcaInstrumento: z.coerce
    .string({
      required_error: 'Obrigatório informar a marca do instrumento!',
    })
    .min(1, {
      message: 'Obrigatório informar a marca do instrumento!',
    })
    .trim(),
  resolucao: z.coerce
    .string({
      required_error: 'Obrigatório informar a resolução do instrumento!',
    })
    .min(1, {
      message: 'Obrigatório informar a resolução do instrumento!',
    })
    .trim(),
  codigoInstrumento: z.coerce
    .string({
      required_error: 'Obrigatório informar o codigo do instrumento!',
    })
    .min(1, {
      message: 'Obrigatório informar o codigo do instrumento!',
    })
    .trim(),
  numeroCertificado: z.coerce
    .string({
      required_error:
        'Obrigatório informar o numero do certificado do instrumento!',
    })
    .min(1, {
      message: 'Obrigatório informar o numero do certificado do instrumento!',
    })
    .trim(),
  dataCalibracao: z.coerce.date({
    required_error: 'Obrigatório informar a data de calibração!',
  }),
  frequenciaCalibracao: z.coerce
    .number({
      required_error:
        'Obrigatório informar a quantidade de meses de intervalo da calibração!',
      invalid_type_error: 'Tipo inserido inválido, informe apenas numero!',
    })
    .positive({
      message: 'Valor da frequencia precisa ser maior que zero!',
    }),
  repeticaoCalibracao: z.coerce
    .number({
      required_error: 'Obrigatório informar a quantidade de repetições!',
      invalid_type_error: 'Tipo inserido inválido, informe apenas número!',
    })
    .positive({
      message: 'Valor de repetições precisa ser maior que zero!',
    }),
  erroEncontrado: z.coerce
    .string({
      required_error: 'Obrigatório informar o erro encontrado!',
      invalid_type_error: 'Tipo inserido inválido, informe apenas numero!',
    })
    .transform((val) => parseFloat(val.replace(',', '.')))
    .refine((val) => !isNaN(val), {
      message: 'Deve ser um número válido',
    })
    .refine((val) => val > 0, {
      message: 'Deve ser maior que zero',
    }),
  incertezaTendenciaEncontrado: z.coerce
    .string({
      required_error: 'Obrigatório informar a incerteza/tendência encontrado!',
      invalid_type_error: 'Tipo inserido inválido, informe apenas numero!',
    })
    .transform((val) => parseFloat(val.replace(',', '.')))
    .refine((val) => val > 0, {
      message: 'Deve ser maior que zero',
    }),
  tolerancia: z.coerce
    .string({
      required_error: 'Obrigatório informar a tolerância!',
      invalid_type_error: 'Tipo inserido inválido, informe apenas numero!',
    })
    .transform((val) => parseFloat(val.replace(',', '.')))
    .refine((val) => !isNaN(val), {
      message: 'Deve ser um número válido',
    })
    .refine((val) => val > 0, {
      message: 'Deve ser maior que zero',
    }),
  observacaoCalibracao: z.optional(z.string()),
})

export type CalibracaoInstrumentoValores = z.infer<typeof calibracaoFormSchema>

const valoresPadroes: Partial<CalibracaoInstrumentoValores> = {
  codigoInstrumento: '',
  nomeInstrumento: '',
  localizacaoInstrumento: '',
  marcaInstrumento: '',
  resolucao: '',
  numeroCertificado: '',
  observacaoCalibracao: '',
  dataCalibracao: new Date(),
  frequenciaCalibracao: 1,
  repeticaoCalibracao: 0,
  erroEncontrado: 0,
  incertezaTendenciaEncontrado: 0,
  tolerancia: 0,
}

export { valoresPadroes, calibracaoFormSchema }

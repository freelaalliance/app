import { z } from 'zod'

export const schemaFormEditCalibracao = z.object({
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
  erroEncontrado: z.coerce
    .number({
      required_error: 'Obrigatório informar o erro encontrado!',
      invalid_type_error: 'Tipo inserido inválido, informe apenas numero!',
    })
    .gt(0, {
      message: 'Obrigatório informar o erro encontrado!',
    }),
  incertezaTendenciaEncontrado: z.coerce
    .number({
      required_error: 'Obrigatório informar a incerteza/tendência encontrado!',
      invalid_type_error: 'Tipo inserido inválido, informe apenas numero!',
    })
    .gt(0, {
      message: 'Obrigatório informar a incerteza/tendência encontrado!',
    }),
  tolerancia: z.coerce
    .number({
      required_error: 'Obrigatório informar a tolerância!',
      invalid_type_error: 'Tipo inserido inválido, informe apenas numero!',
    })
    .gt(0, {
      message: 'Obrigatório informar a tolerância!',
    }),
  observacaoCalibracao: z.optional(z.coerce.string()),
})

export type EditCalibracaoFormType = z.infer<typeof schemaFormEditCalibracao>

export const formValoresPadrao: Partial<EditCalibracaoFormType> = {
  numeroCertificado: '',
  dataCalibracao: new Date(),
  erroEncontrado: 0,
  incertezaTendenciaEncontrado: 0,
  tolerancia: 0,
  observacaoCalibracao: '',
}

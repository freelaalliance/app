import { z } from 'zod'

export const schemaDadosEquipamento = z.object({
  id: z.string(),
  codigo: z.string(),
  nome: z.string(),
  especificacao: z.string().optional(),
  frequencia: z.number(),
  tempoOperacao: z.number(),
  inspecionadoEm: z.coerce.date().optional(),
  concertadoEm: z.coerce.date().optional(),
  status: z.enum(['operando', 'parado']),
})

export type DadosEquipamentoType = z.infer<typeof schemaDadosEquipamento>

export const schemaFormularioNovoEquipamento = z.object({
  codigo: z.coerce
    .string({
      required_error: 'Necessário informar o código do equipamento',
    })
    .min(1, {
      message: 'Necessário informar o código do equipamento',
    })
    .trim(),
  nome: z.coerce
    .string({
      required_error: 'Necessário informar o nome do equipamento',
    })
    .min(1, {
      message: 'Necessário informar o nome do equipamento',
    }),
  especificacao: z.string().optional(),
  tempoOperacao: z.coerce
    .number({
      required_error: 'Necessário informar o tempo de operação do equipamento',
    })
    .min(1, {
      message: 'Necessário informar o tempo mínimo de operação do equipamento',
    }),
  frequencia: z.coerce
    .number({
      required_error:
        'Necessário informar a frequência de inspeção para o equipamento',
    })
    .min(1, {
      message:
        'Necessário informar a frequência de inspeção para o equipamento',
    }),
  pecas: z.array(
    z.object({
      nome: z
        .string({
          required_error: 'Necessário informar o nome do item',
        })
        .min(1, {
          message: 'Necessário informar o nome do item',
        }),
      descricao: z.string().optional(),
    }),
  ),
})

export type FormularioNovoEquipamentoType = z.infer<
  typeof schemaFormularioNovoEquipamento
>

export const schemaDadosPecasEquipamento = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string().optional(),
  equipamentoId: z.string(),
})

export type DadosPecasEquipamentoType = z.infer<
  typeof schemaDadosPecasEquipamento
>

export type DadosAgendaEquipamentoType = {
  id: number
  agendadoPara: Date
  inspecaoRealizada: boolean
}

export type DadosInspecoesEquipamentoType = {
  iniciadoEm: Date
  finalizadoEm?: Date | null
  statusInspecao: string
  id: string
  equipamentoId: string
  PontosInspecaoEquipamento: Array<{
    pecaEquipamentoId: string
    inspecionadoEm: Date | null
    observacao?: string | null
  }>
  usuario: {
    pessoa: {
      nome: string
    }
  }
}

import { z } from "zod";

export const schemaDadosEquipamento = z.object({
  id: z.string(),
  codigo: z.string(),
  nome: z.string(),
  especificacao: z.string().optional(),
  frequencia: z.number()
})

export type DadosEquipamentoType = z.infer<typeof schemaDadosEquipamento>

export const schemaFormularioNovoEquipamento = z.object({
  codigo: z.coerce.string({
    required_error: 'Necessário informar o código do equipamento'
  }).min(1, {
    message: 'Necessário informar o código do equipamento'
  }).trim(),
  nome: z.coerce.string({
    required_error: 'Necessário informar o nome do equipamento'
  }).min(1, {
    message: 'Necessário informar o nome do equipamento'
  }),
  especificacao: z.string().optional(),
  frequencia: z.coerce.number({
    required_error: 'Necessário informar a frequência de inspeção para o equipamento'
  }).min(1, {
    message: 'Necessário informar a frequência de inspeção para o equipamento'
  }),
  pecas: z.array(z.object({
    nome: z.string({
      required_error: 'Necessário informar o nome da peça'
    }).min(1, {
      message: 'Necessário informar o nome da peça'
    }),
    descricao: z.string().optional(),
  }))
})

export type FormularioNovoEquipamentoType = z.infer<typeof schemaFormularioNovoEquipamento>

export const schemaDadosPecasEquipamento = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string().optional(),
  equipamentoId: z.string()
})

export type DadosPecasEquipamentoType = z.infer<typeof schemaDadosPecasEquipamento>

export type DadosAgendaEquipamentoType = {
  id: number,
  agendadoPara: Date,
  inspecaoRealizada: boolean
}
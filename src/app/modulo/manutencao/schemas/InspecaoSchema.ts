import { z } from "zod";

export const schemaPontosInspecao = z.array(
  z.object({
    pecasEquipamento: z.object({
      id: z.string().uuid(),
      nome: z.string(),
      descricao: z.string().optional().nullable(),
    }),
    aprovado: z.boolean().default(false),
    inspecionadoEm: z.date().nullable(),
    observacao: z.string().optional().nullable(),
  })
)

export type PontosInspecaoType = z.infer<typeof schemaPontosInspecao>

export const schemaFormInspecao = z.object({
  iniciadoEm: z.date().default(new Date()),
  finalizadoEm: z.date().optional(),
  equipamentoId: z.string().uuid(),
  observacao: z.string().optional(),
  inspecaoPeca: z.array(
    z.object({
      pecaEquipamentoId: z.string().uuid(),
      aprovado: z.boolean().default(false),
      inspecionadoEm: z.date().nullable(),
      inspecionado: z.boolean().default(false),
      observacao: z.string().optional(),
    })
  )
})

export type DadosInspecaoType = z.infer<typeof schemaFormInspecao>

export const schemaFormFinalizacaoInspecao = z.object({
  id: z.string().uuid(),
  iniciadoEm: z.coerce.date(),
  observacao: z.string().optional(),
  finalizadoEm: z.coerce.date().optional(),
  equipamentoId: z.string().uuid(),
  inspecaoPeca: z.array(
    z.object({
      pecaEquipamentoId: z.string().uuid(),
      aprovado: z.boolean().default(false),
      inspecionadoEm: z.coerce.date().optional(),
      inspecionado: z.boolean().default(false),
      observacao: z.string().optional(),
    })
  )
})

export type DadosFinalizacaoInspecaoType = z.infer<typeof schemaFormFinalizacaoInspecao>

export type AgendaInspecoesEmpresa = {
  id: number;
  equipamento: {
    id: string;
    nome: string;
    codigo: string;
    frequencia: number;
  };
  agendadoPara: Date;
  inspecaoRealizada: boolean;
}
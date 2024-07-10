import { z } from "zod";

export type DadosManutencaoEquipamentoType = {
  id: string;
  criadoEm: Date;
  iniciadoEm: Date | null;
  finalizadoEm: Date | null;
  equipamentoId: string;
  canceladoEm: Date | null;
  observacoes: string;
  duracao: Number | null;
  equipamentoParado: Number | null;
  usuario: {
    pessoa: {
      nome: string;
    };
  };
}

export type DuracaoManutencoesEquipamentoType = {
  duracao: number,
  inicioManutencao: string,
}

export const schemaFormNovaOrdemManutencao = z.object({
  observacao: z.string({
    required_error: 'Necessário informar a observação da ordem de manutenção'
  }).min(1, {
    message: 'Necessário informar a observação da ordem de manutenção'
  }),
  equipamentoId: z.string().uuid(),
})

export type DadosNovaOrdemManutencaoType = z.infer<typeof schemaFormNovaOrdemManutencao>
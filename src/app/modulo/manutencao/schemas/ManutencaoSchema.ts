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
  tempoMaquinaOperacao: Number;
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

export type estatisticasEquipamentoType = {
  qtd_equipamentos_parados: number
  qtd_equipamentos_funcionando: number
}

export type estatisticasManutencaoType = {
  qtd_equipamentos_manutencao_em_dia: number
  qtd_manutencoes_em_andamento: number
}

export type dadosIndicadoresManutencaoEquipamentoType = {
  total_tempo_parado: number
  qtd_manutencoes: number
  total_tempo_operacao: number
}

export type dadosIndicadoresManutencaoEquipamentoEmpresaType = {
  nome: string
  total_tempo_parado: number
  qtd_manutencoes: number
  total_tempo_operacao: number
}

export type indicadoresFalhasEquipamentoType = { 
  mtbf: number
  mttr: number 
}

export type indicadoresFalhasEquipamentosEmpresaType = { 
  equipamento: string
  mttr: number
  mtbf: number 
}
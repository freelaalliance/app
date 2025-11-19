/**
 * Tipos para Configurações de Empresa
 * Baseado nos endpoints de configuração de Compras e Vendas
 */

/**
 * Interface base para uma configuração
 */
export interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  empresaId: string;
}

/**
 * Array de configurações retornado pelos endpoints
 */
export type ConfiguracoesResponse = Configuracao[];

/**
 * Response de erro dos endpoints
 */
export interface ConfiguracaoErrorResponse {
  status: false;
  msg: string;
  error?: string;
}

/**
 * Tipos de módulos que possuem configurações
 */
export type ModuloConfiguracao = 'compras' | 'vendas';

/**
 * Chaves conhecidas para configurações de Compras
 */
export type ChaveConfiguracaoCompras =
  | 'compras_frete_padrao'
  | 'compras_forma_pagamento_padrao'
  | 'compras_local_entrega'
  | 'compras_armazenamento'
  | 'compras_imposto_padrao'
  | 'compras_prazo_entrega_dias';

/**
 * Chaves conhecidas para configurações de Vendas
 */
export type ChaveConfiguracaoVendas =
  | 'vendas_frete_padrao'
  | 'vendas_forma_pagamento_padrao'
  | 'vendas_local_entrega_padrao'
  | 'vendas_imposto'
  | 'vendas_prazo_entrega_padrao'
  | 'vendas_observacoes_padrao';

/**
 * Union type de todas as chaves de configuração
 */
export type ChaveConfiguracao = ChaveConfiguracaoCompras | ChaveConfiguracaoVendas;

/**
 * Objeto mapeado de configurações (chave -> valor)
 * Útil para fácil acesso aos valores
 */
export type ConfiguracaoMap = Record<string, string>;

/**
 * Interface para o hook de configurações
 */
export interface UseConfiguracaoReturn {
  configuracoes: Configuracao[];
  loading: boolean;
  error: ConfiguracaoErrorResponse | null;
  getConfig: (chave: string) => string | undefined;
  configMap: ConfiguracaoMap;
}

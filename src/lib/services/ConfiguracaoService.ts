/**
 * Service para gerenciar configurações de empresa
 * Endpoints: /pedido/configuracao e /vendas/configuracao
 */

import { axiosInstance } from '@/lib/AxiosLib';
import type {
  Configuracao,
  ConfiguracaoErrorResponse,
  ConfiguracoesResponse,
  ModuloConfiguracao,
} from '@/types/ConfiguracaoType';

/**
 * Endpoints para cada módulo
 */
const ENDPOINTS: Record<ModuloConfiguracao, string> = {
  compras: '/pedido/configuracao',
  vendas: '/vendas/configuracao',
};

/**
 * Busca todas as configurações da empresa para um módulo específico
 * @param modulo - Módulo de configuração ('compras' ou 'vendas')
 * @returns Array de configurações da empresa
 * @throws ConfiguracaoErrorResponse em caso de erro
 */
export async function buscarConfiguracoes(
  modulo: ModuloConfiguracao
): Promise<ConfiguracoesResponse> {
  try {
    const endpoint = ENDPOINTS[modulo];
    const response = await axiosInstance.get<ConfiguracoesResponse>(endpoint);

    // Se o response for vazio ou não for array, retorna array vazio
    if (!Array.isArray(response.data)) {
      return [];
    }

    return response.data;
  } catch (error: unknown) {
    // Trata erros do backend
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: ConfiguracaoErrorResponse } };
      if (axiosError.response?.data) {
        throw axiosError.response.data;
      }
    }

    // Trata erros genéricos
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw {
      status: false,
      msg: 'Erro ao buscar configurações',
      error: errorMessage,
    } as ConfiguracaoErrorResponse;
  }
}

/**
 * Busca configurações de compras
 * @returns Array de configurações de compras
 */
export async function buscarConfiguracoesCompras(): Promise<ConfiguracoesResponse> {
  return buscarConfiguracoes('compras');
}

/**
 * Busca configurações de vendas
 * @returns Array de configurações de vendas
 */
export async function buscarConfiguracoesVendas(): Promise<ConfiguracoesResponse> {
  return buscarConfiguracoes('vendas');
}

/**
 * Busca o valor de uma configuração específica por chave
 * @param modulo - Módulo de configuração
 * @param chave - Chave da configuração a buscar
 * @returns Valor da configuração ou undefined se não encontrada
 */
export async function buscarConfiguracaoPorChave(
  modulo: ModuloConfiguracao,
  chave: string
): Promise<string | undefined> {
  const configuracoes = await buscarConfiguracoes(modulo);
  return configuracoes.find((c) => c.chave === chave)?.valor;
}

/**
 * Converte array de configurações em um objeto mapeado (chave -> valor)
 * @param configuracoes - Array de configurações
 * @returns Objeto com chaves e valores das configurações
 */
export function configuracaoParaMap(
  configuracoes: Configuracao[]
): Record<string, string> {
  return configuracoes.reduce((acc, config) => {
    acc[config.chave] = config.valor;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Helper para buscar configurações de compras e retornar como objeto mapeado
 * @returns Objeto com configurações de compras
 */
export async function buscarConfiguracoesComprasMap(): Promise<Record<string, string>> {
  const configuracoes = await buscarConfiguracoesCompras();
  return configuracaoParaMap(configuracoes);
}

/**
 * Helper para buscar configurações de vendas e retornar como objeto mapeado
 * @returns Objeto com configurações de vendas
 */
export async function buscarConfiguracoesVendasMap(): Promise<Record<string, string>> {
  const configuracoes = await buscarConfiguracoesVendas();
  return configuracaoParaMap(configuracoes);
}

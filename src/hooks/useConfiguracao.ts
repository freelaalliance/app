/**
 * Hooks customizados para gerenciar configurações de empresa
 * Utiliza React Query para cache e gerenciamento de estado
 */

'use client';

import {
  buscarConfiguracoes,
  buscarConfiguracoesCompras,
  buscarConfiguracoesVendas,
  configuracaoParaMap,
} from '@/lib/services/ConfiguracaoService';
import type {
  Configuracao,
  ConfiguracaoErrorResponse,
  ConfiguracaoMap,
  ModuloConfiguracao,
  UseConfiguracaoReturn,
} from '@/types/ConfiguracaoType';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * Tempo de cache padrão: 5 minutos
 * Configurações são relativamente estáveis e não mudam frequentemente
 */
const STALE_TIME = 5 * 60 * 1000;
const CACHE_TIME = 10 * 60 * 1000;

/**
 * Hook principal para buscar configurações de um módulo
 * @param modulo - Módulo de configuração ('compras' ou 'vendas')
 * @param options - Opções do React Query
 * @returns Objeto com configurações, loading, erro e helpers
 */
export function useConfiguracoes(
  modulo: ModuloConfiguracao,
  options?: {
    enabled?: boolean;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
  }
): UseConfiguracaoReturn {
  const {
    data: configuracoes = [],
    isLoading: loading,
    error,
  } = useQuery<Configuracao[], ConfiguracaoErrorResponse>({
    queryKey: ['configuracoes', modulo],
    queryFn: () => buscarConfiguracoes(modulo),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: options?.enabled ?? true,
    refetchOnMount: options?.refetchOnMount ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
  });

  // Cria um mapa de configurações para acesso fácil
  const configMap = useMemo<ConfiguracaoMap>(
    () => configuracaoParaMap(configuracoes),
    [configuracoes]
  );

  // Helper para buscar valor de uma configuração específica
  const getConfig = (chave: string): string | undefined => {
    return configMap[chave];
  };

  return {
    configuracoes,
    loading,
    error: error ?? null,
    getConfig,
    configMap,
  };
}

/**
 * Hook específico para configurações de Compras
 * @param options - Opções do React Query
 * @returns Objeto com configurações de compras
 */
export function useConfiguracoesCompras(options?: {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}): UseConfiguracaoReturn {
  const {
    data: configuracoes = [],
    isLoading: loading,
    error,
  } = useQuery<Configuracao[], ConfiguracaoErrorResponse>({
    queryKey: ['configuracoes', 'compras'],
    queryFn: buscarConfiguracoesCompras,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: options?.enabled ?? true,
    refetchOnMount: options?.refetchOnMount ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
  });

  const configMap = useMemo<ConfiguracaoMap>(
    () => configuracaoParaMap(configuracoes),
    [configuracoes]
  );

  const getConfig = (chave: string): string | undefined => {
    return configMap[chave];
  };

  return {
    configuracoes,
    loading,
    error: error ?? null,
    getConfig,
    configMap,
  };
}

/**
 * Hook específico para configurações de Vendas
 * @param options - Opções do React Query
 * @returns Objeto com configurações de vendas
 */
export function useConfiguracoesVendas(options?: {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}): UseConfiguracaoReturn {
  const {
    data: configuracoes = [],
    isLoading: loading,
    error,
  } = useQuery<Configuracao[], ConfiguracaoErrorResponse>({
    queryKey: ['configuracoes', 'vendas'],
    queryFn: buscarConfiguracoesVendas,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: options?.enabled ?? true,
    refetchOnMount: options?.refetchOnMount ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
  });

  const configMap = useMemo<ConfiguracaoMap>(
    () => configuracaoParaMap(configuracoes),
    [configuracoes]
  );

  const getConfig = (chave: string): string | undefined => {
    return configMap[chave];
  };

  return {
    configuracoes,
    loading,
    error: error ?? null,
    getConfig,
    configMap,
  };
}

/**
 * Hook helper para buscar uma configuração específica por chave
 * @param modulo - Módulo de configuração
 * @param chave - Chave da configuração a buscar
 * @returns Objeto com valor da configuração e loading
 */
export function useConfiguracaoPorChave(
  modulo: ModuloConfiguracao,
  chave: string
): {
  valor: string | undefined;
  loading: boolean;
  error: ConfiguracaoErrorResponse | null;
} {
  const { getConfig, loading, error } = useConfiguracoes(modulo);

  return {
    valor: getConfig(chave),
    loading,
    error,
  };
}

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { treinamentosColaboradorApi } from '../../_api/colaborador/TreinamentosColaboradorService'
import type {
    AtualizarTreinamentoRealizadoRequest,
    FinalizarTreinamentoRequest,
} from '../../_types/colaborador/ContratacaoType'

export const useTreinamentosColaborador = (
  status?: 'pendentes' | 'finalizados' | 'todos'
) => {
  return useQuery({
    queryKey: ['treinamentos-colaborador', { status }],
    queryFn: async () => {
      const { data } = await treinamentosColaboradorApi.listar(status)
      return data.dados || []
    },
  })
}

export const useTreinamentoRealizado = (id: string) => {
  return useQuery({
    queryKey: ['treinamentos-colaborador', id],
    queryFn: async () => {
      const { data } = await treinamentosColaboradorApi.buscar(id)
      return data.dados
    },
    enabled: !!id,
  })
}

export const useIniciarTreinamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treinamentosColaboradorApi.iniciar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos-colaborador'] })
    },
  })
}

export const useAtualizarTreinamentoRealizado = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: AtualizarTreinamentoRealizadoRequest }) =>
      treinamentosColaboradorApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos-colaborador'] })
    },
  })
}

export const useFinalizarTreinamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: FinalizarTreinamentoRequest }) =>
      treinamentosColaboradorApi.finalizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos-colaborador'] })
    },
  })
}

export const useCancelarTreinamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treinamentosColaboradorApi.cancelar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos-colaborador'] })
    },
  })
}

export const useTreinamentosPorColaborador = (contratacaoId: string) => {
  return useQuery({
    queryKey: ['treinamentos-colaborador', 'colaborador', contratacaoId],
    queryFn: async () => {
      const { data } =
        await treinamentosColaboradorApi.listarPorColaborador(contratacaoId)
      return data.dados || []
    },
    enabled: !!contratacaoId,
  })
}

export const useIniciarTreinamentosObrigatorios = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treinamentosColaboradorApi.iniciarObrigatorios,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos-colaborador'] })
    },
  })
}

export const useTreinamentosPendentes = () => {
  return useQuery({
    queryKey: ['treinamentos-colaborador', 'pendentes'],
    queryFn: async () => {
      const { data } = await treinamentosColaboradorApi.listarPendentes()
      return data.dados || []
    },
  })
}

export const useTreinamentosFinalizados = () => {
  return useQuery({
    queryKey: ['treinamentos-colaborador', 'finalizados'],
    queryFn: async () => {
      const { data } = await treinamentosColaboradorApi.listarFinalizados()
      return data.dados || []
    },
  })
}

export const useTreinamentosNaoRealizados = (
  contratacaoId: string, 
  tipo?: 'integracao' | 'capacitacao'
) => {
  return useQuery({
    queryKey: ['treinamentos-colaborador', 'nao-realizados', contratacaoId, tipo],
    queryFn: async () => {
      const { data } = await treinamentosColaboradorApi.listarNaoRealizados(contratacaoId, tipo)
      return data.dados || []
    },
    enabled: !!contratacaoId,
  })
}

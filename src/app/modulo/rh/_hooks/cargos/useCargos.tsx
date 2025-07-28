'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cargosApi } from '../../_api/cargos/CargoService'
import type {
  AdicionarTreinamentoCargoRequest,
  AtualizarCargoRequest,
} from '../../_types/cargos/CargoType'

export const useCargos = () => {
  return useQuery({
    queryKey: ['cargos'],
    queryFn: async () => {
      const { data } = await cargosApi.listar()
      return data.dados || []
    },
    initialData: [],
  })
}

export const useCargo = (id: string) => {
  return useQuery({
    queryKey: ['cargos', id],
    queryFn: async () => {
      const { data } = await cargosApi.buscar(id)
      return data.dados
    },
    enabled: !!id,
  })
}

export const useCriarCargo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cargosApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
    },
  })
}

export const useAtualizarCargo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AtualizarCargoRequest }) =>
      cargosApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
    },
  })
}

export const useDeletarCargo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cargosApi.deletar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
    },
  })
}

export const useTreinamentosCargo = (cargoId: string) => {
  return useQuery({
    queryKey: ['cargos', cargoId, 'treinamentos'],
    queryFn: async () => {
      const { data } = await cargosApi.listarTreinamentos(cargoId)
      return data.dados || []
    },
    enabled: !!cargoId,
  })
}

export const useAdicionarTreinamentoCargo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      cargoId,
      data,
    }: { cargoId: string; data: AdicionarTreinamentoCargoRequest }) =>
      cargosApi.adicionarTreinamento(cargoId, data),
    onSuccess: (_, { cargoId }) => {
      queryClient.invalidateQueries({
        queryKey: ['cargos', cargoId, 'treinamentos'],
      })
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
    },
  })
}

export const useRemoverTreinamentoCargo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      cargoId,
      treinamentoId,
    }: { cargoId: string; treinamentoId: string }) =>
      cargosApi.removerTreinamento(cargoId, treinamentoId),
    onSuccess: (_, { cargoId }) => {
      queryClient.invalidateQueries({
        queryKey: ['cargos', cargoId, 'treinamentos'],
      })
      queryClient.invalidateQueries({ queryKey: ['cargos'] })
    },
  })
}

export const useColaboradoresCargo = (cargoId: string) => {
  return useQuery({
    queryKey: ['cargos', cargoId, 'colaboradores'],
    queryFn: async () => {
      const { data } = await cargosApi.listarColaboradores(cargoId)
      return data.dados || []
    },
    enabled: !!cargoId,
  })
}

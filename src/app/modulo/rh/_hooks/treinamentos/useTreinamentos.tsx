
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    type AtualizarTreinamentoRequest,
    type CriarPlanoTreinamentoRequest,
    treinamentosApi,
} from '../../_api/treinamentos/TreinamentoService'

export const useTreinamentos = () => {
  return useQuery({
    queryKey: ['treinamentos'],
    queryFn: async () => {
      const { data } = await treinamentosApi.listar()
      return data.dados || []
    },
    initialData: [],
  })
}

export const useTreinamentosIntegracao = () => {
  return useQuery({
    queryKey: ['treinamentos', 'integracao'],
    queryFn: async () => {
      const { data } = await treinamentosApi.listarIntegracao()
      return data.dados || []
    },
    initialData: [],
  })
}

export const useTreinamentosIntegracaoPorCargo = (cargoId: string) => {
  return useQuery({
    queryKey: ['treinamentos', 'integracao', 'cargo', cargoId],
    queryFn: async () => {
      const { data } = await treinamentosApi.listarIntegracaoPorCargo(cargoId)
      return data.dados || []
    },
    enabled: !!cargoId,
    initialData: [],
  })
}

export const useTreinamentosCapacitacao = () => {
  return useQuery({
    queryKey: ['treinamentos', 'capacitacao'],
    queryFn: async () => {
      const { data } = await treinamentosApi.listarCapacitacao()
      return data.dados || []
    },
    initialData: [],
  })
}

export const useCriarTreinamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treinamentosApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos'] })
    },
  })
}

export const useAtualizarTreinamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: AtualizarTreinamentoRequest }) =>
      treinamentosApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos'] })
    },
  })
}

export const useDeletarTreinamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treinamentosApi.deletar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos'] })
    },
  })
}

export const usePlanosTreinamento = (treinamentoId: string) => {
  return useQuery({
    queryKey: ['treinamentos', treinamentoId, 'planos'],
    queryFn: async () => {
      const { data } = await treinamentosApi.listarPlanos(treinamentoId)
      return data.dados || []
    },
    enabled: !!treinamentoId,
  })
}

export const useCriarPlanoTreinamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      treinamentoId,
      data,
    }: { treinamentoId: string; data: CriarPlanoTreinamentoRequest }) =>
      treinamentosApi.criarPlano(treinamentoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['treinamentos'],
      })
    },
  })
}

export const useDeletarPlanoTreinamento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treinamentosApi.deletarPlano,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos'] })
    },
  })
}

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { contratacaoApi } from '../../_api/colaborador/ContratacaoService'
import type { EditarColaboradorData } from '../../_schemas/colaborador/EditarColaboradorSchemas'
import type {
  AtualizarContratacaoRequest,
  DemitirColaboradorRequest,
  TransferirColaboradorRequest,
} from '../../_types/colaborador/ContratacaoType'

export const useContratacoes = (ativas?: boolean) => {
  return useQuery({
    queryKey: ['contratacoes', { ativas }],
    queryFn: async () => {
      const { data } = await contratacaoApi.listar(ativas)
      return data.dados || []
    },
    initialData: [],
  })
}

export const useContratacao = (id: string) => {
  return useQuery({
    queryKey: ['contratacoes', id],
    queryFn: async () => {
      const { data } = await contratacaoApi.buscar(id)
      return data.dados
    },
    enabled: !!id,
  })
}

export const useCriarContratacao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: contratacaoApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacoes'] })
    },
  })
}

export const useAtualizarContratacao = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: AtualizarContratacaoRequest }) =>
      contratacaoApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacoes'] })
    },
  })
}

export const useDemitirColaborador = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: DemitirColaboradorRequest }) =>
      contratacaoApi.demitir(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacoes'] })
    },
  })
}

export const useTransferirColaborador = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: TransferirColaboradorRequest }) =>
      contratacaoApi.transferir(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacoes'] })
    },
  })
}

export const useColaboradoresPorCargo = (cargoId: string) => {
  return useQuery({
    queryKey: ['contratacoes', 'cargo', cargoId],
    queryFn: async () => {
      const { data } = await contratacaoApi.listarPorCargo(cargoId)
      return data.dados || []
    },
    enabled: !!cargoId,
  })
}

export const useDocumentosContrato = (contratacaoId: string) => {
  return useQuery({
    queryKey: ['contratacoes', contratacaoId, 'documentos'],
    queryFn: async () => {
      const { data } = await contratacaoApi.listarDocumentos(contratacaoId)
      return data.dados || []
    },
    enabled: !!contratacaoId,
  })
}

export const useAdicionarDocumentoContrato = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      contratacaoId,
      documento,
      chaveArquivo,
    }: { contratacaoId: string; documento: string; chaveArquivo?: string }) =>
      contratacaoApi.adicionarDocumento(contratacaoId, documento, chaveArquivo),
    onSuccess: (_, { contratacaoId }) => {
      queryClient.invalidateQueries({
        queryKey: ['contratacoes', contratacaoId, 'documentos'],
      })
    },
  })
}

export const useRemoverDocumentoContrato = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: contratacaoApi.removerDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacoes'] })
    },
  })
}

export const useAtualizarDadosColaborador = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: EditarColaboradorData }) =>
      contratacaoApi.atualizarDadosColaborador(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['contratacoes', id] })
      queryClient.invalidateQueries({ queryKey: ['contratacoes'] })
    },
  })
}

export const useAtualizarArquivoDocumento = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      documentoId,
      chaveArquivo,
    }: { documentoId: number; chaveArquivo: string }) =>
      contratacaoApi.atualizarArquivoDocumento(documentoId, chaveArquivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacoes'] })
    },
  })
}

export const useHistoricoContratacao = (contratacaoId: string) => {
  return useQuery({
    queryKey: ['contratacoes', contratacaoId, 'historico'],
    queryFn: async () => {
      const { data } = await contratacaoApi.listarHistorico(contratacaoId)
      return data.dados || []
    },
    enabled: !!contratacaoId,
  })
}

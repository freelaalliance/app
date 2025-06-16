'use client'

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { buscarItensAvaliativosExpedicao } from '../../_api/ItensAvaliacoesExpedicao'
import {
  FormularioExpedicao,
  type FormularioExpedicaoProps,
} from '../forms/expedicao-form'


export function ExpedicaoDialog({ dadosVenda }: Pick<FormularioExpedicaoProps, 'dadosVenda'>) {
  const itensAvalicoes = useQuery({
      queryKey: ['itens-avaliacoes'],
      queryFn: buscarItensAvaliativosExpedicao,
      initialData: [],
    })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Expedir venda</DialogTitle>
      </DialogHeader>
      {
        itensAvalicoes.isFetching ? (
          <div className="flex items-center justify-center h-32">
            <span>Carregando itens avaliativos...</span>
          </div>
        ) : (
          <FormularioExpedicao
            dadosVenda={dadosVenda}
            itensAvaliacaoExpedicao={itensAvalicoes.data}
          />
        )
      }
    </DialogContent>
  )
}

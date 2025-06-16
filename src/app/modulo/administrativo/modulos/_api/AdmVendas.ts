import { axiosInstance } from '@/lib/AxiosLib'
import type { ItemAvaliativoExpedicaoFormType } from '../vendas/components/forms/atualizacao-item-avaliativo-expedicao'
import type { ItensAvaliativoExpedicaoFormType } from '../vendas/components/forms/cadastro-itens-avaliativos-expedicao'

export interface ItemAvaliacaoExpedicao {
  id: number
  pergunta: string
  empresaId: string
}

export type ItemAvaliacaoExpedicaoEmpresaType = Omit<
  ItemAvaliacaoExpedicao,
  'empresaId'
>

export type ItemAvaliacaoExpedicaoType = Pick<
  ItemAvaliacaoExpedicao,
  'id' | 'pergunta'
>

export type AtualizarStatusItemAvaliacaoExpedicaoType = Pick<
  ItemAvaliacaoExpedicao,
  'id'
>

export async function buscarItensAvaliativosExpedicaoEmpresa(
  empresaId: string
) {
  return await axiosInstance
    .get<{ status: boolean; dados: Array<ItemAvaliacaoExpedicaoEmpresaType> }>(
      `admin/vendas/expedicao/itens-avaliacao/empresa/${empresaId}`
    )
    .then(({ data }) => data)
}

export async function cadastrarItensAvaliativosExpedicao({
  empresaId,
  itens,
}: ItensAvaliativoExpedicaoFormType) {
  await axiosInstance.post(
    `admin/vendas/expedicao/itens-avaliacao/empresa/${empresaId}`,
    {
      itens,
    }
  )
}

export async function atualizarDescricaoItemAvaliativosExpedicao({
  id,
  pergunta,
}: ItemAvaliativoExpedicaoFormType) {
  await axiosInstance.put(`admin/vendas/expedicao/itens-avaliacao/${id}`, {
    pergunta,
  })
}

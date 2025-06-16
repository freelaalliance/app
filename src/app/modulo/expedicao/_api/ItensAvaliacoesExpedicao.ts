import { axiosInstance } from '@/lib/AxiosLib';
import type { ItemAvaliacaoExpedicaoEmpresaType } from '../../administrativo/modulos/_api/AdmVendas';

export async function buscarItensAvaliativosExpedicao() {
  return await axiosInstance
    .get<{ status: boolean; dados: Array<ItemAvaliacaoExpedicaoEmpresaType> }>(
      'admin/vendas/expedicao/itens-avaliacao'
    )
    .then(({ data }) => data.dados)
}

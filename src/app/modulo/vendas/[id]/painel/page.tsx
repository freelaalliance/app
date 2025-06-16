'use client'

import { Package, Star, UserCheck, Users } from 'lucide-react'
import { useTopCliente, useTopProduto, useTotalClientes, useTotalProdutos } from '../../_servicos/useEstatisticas'
import { IndicadorInformativo } from '@/components/IndicadorInfo'

export default function PainelVendasPage() {
  const { data: topCliente, isFetching: loadingCliente } = useTopCliente()
  const { data: topProduto, isFetching: loadingProduto } = useTopProduto()
  const { data: totalClientes, isFetching: loadingTotalClientes } = useTotalClientes()
  const { data: totalProdutos, isFetching: loadingTotalProdutos } = useTotalProdutos()

  return (
    <div className="mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-padrao-gray-800">Dashboard de Vendas</h1>
        <p className="text-muted-foreground text-sm">Acompanhe os principais dados de desempenho da empresa.</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <IndicadorInformativo
          titulo="Clientes Cadastrados"
          info={String(totalClientes?.toLocaleString() ?? 0)}
          icon={Users}
          carregandoInformacao={loadingTotalClientes}
        />
        <IndicadorInformativo
          titulo="Produtos Cadastrados"
          info={String(totalProdutos?.toLocaleString() ?? 0)}
          icon={Package}
          carregandoInformacao={loadingTotalProdutos}
        />
        <IndicadorInformativo
          titulo={'Top Produto'}
          subtitulo={`${topProduto?.totalVendido ?? 0} unidades vendidas`}
          info={String(topProduto?.nome ?? '')}
          icon={Star}
          carregandoInformacao={loadingProduto}
        />
        <IndicadorInformativo
          titulo={'Top Cliente'}
          subtitulo={`${topCliente?.totalVendas ?? 0} vendas realizadas`}
          info={
            topCliente
              ? `${topCliente.cliente}`
              : 'Nenhum cliente encontrado'
          }
          icon={UserCheck}
          carregandoInformacao={loadingCliente}
        />
      </section>
    </div>
  )
}

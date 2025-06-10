'use client'

import { Package, Star, UserCheck, Users } from 'lucide-react'
import { DashboardCard } from '../../_components/painel/dashboard-card'
import { useTopCliente, useTopProduto, useTotalClientes, useTotalProdutos } from '../../_servicos/useEstatisticas'

export default function PainelVendasPage() {
  const { data: topCliente, isFetching: loadingCliente } = useTopCliente()
  const { data: topProduto, isFetching: loadingProduto } = useTopProduto()
  const { data: totalClientes, isFetching: loadingTotalClientes } = useTotalClientes()
  const { data: totalProdutos, isFetching: loadingTotalProdutos } = useTotalProdutos()

  return (
    <section className="mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-padrao-gray-800">Dashboard de Vendas</h1>
        <p className="text-muted-foreground text-sm">Acompanhe os principais dados de desempenho da empresa.</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon={<Users className="text-primary" size={28} />}
          title="Clientes Cadastrados"
          value={totalClientes?.toLocaleString() ?? 0}
          loading={loadingTotalClientes}
        />
        <DashboardCard
          icon={<Package className="text-primary" size={28} />}
          title="Produtos/Serviços"
          value={totalProdutos?.toLocaleString() ?? 0}
          loading={loadingTotalProdutos}
        />
        <DashboardCard
          icon={<UserCheck className="text-green-600" size={28} />}
          title="Top Cliente"
          value={
            loadingCliente ? null :
            topCliente
              ? `${topCliente.cliente} (${topCliente.totalVendas} vendas)`
              : 'Nenhum cliente encontrado'
          }
          loading={loadingCliente}
        />
        <DashboardCard
          icon={<Star className="text-yellow-500" size={28} />}
          title="Produto Mais Vendido"
          value={
            loadingProduto ? null :
            topProduto
              ? `${topProduto.nome} (${topProduto.totalVendido} und.)`
              : 'Nenhum produto vendido'
          }
          loading={loadingProduto}
        />
      </section>
    </section>
  )
}
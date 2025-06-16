"use client"

import { columnsVendasPendenteExpediente } from "@/app/modulo/vendas/_components/vendas/tabelas/colunas-tabela-vendas-realizadas-expedicao"
import { TabelaVendasCliente } from "@/app/modulo/vendas/_components/vendas/tabelas/vendas-realizadas"
import { useVendasPendentes } from "@/app/modulo/vendas/_servicos/useVendas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExpedicoesPage() {

  const {
    data: listaVendas,
    isFetching: carregandoVendas
  } = useVendasPendentes()

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Pendentes para Expedição</CardTitle>
          <CardDescription>Lista de pedidos aguardando expedição</CardDescription>
        </CardHeader>
        <CardContent>
          <TabelaVendasCliente
            listaVendas={listaVendas}
            carregandoVendas={carregandoVendas}
            colunasVenda={columnsVendasPendenteExpediente}
          />
        </CardContent>
      </Card>
    </section>
  )
}
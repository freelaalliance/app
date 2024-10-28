'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarClock, FilePlus2, PackageOpen } from 'lucide-react'

import { IndicadorInformativo } from '@/components/IndicadorInfo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { buscarPedidosPendentesEmpresa } from '../fornecedor/(api)/ComprasApi'
import { ColunasPedidosEmpresaRecebimento } from '../fornecedor/components/tabelas/pedidos/colunas-tabela-pedidos-recebimento'
import { TabelaPedidos } from '../fornecedor/components/tabelas/pedidos/tabela-pedidos'

export default function RecebimentoPedidos() {
  const listaPedidosEmpresa = useQuery({
    queryKey: ['pedidosFornecedorRecebimento'],
    queryFn: () => buscarPedidosPendentesEmpresa(),
    staleTime: 60 * 60 * 24,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos da empresa</CardTitle>
        <CardDescription>
          {'Pedidos pendentes de recebimento do fornecedor'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <section className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <IndicadorInformativo
              carregandoInformacao={listaPedidosEmpresa.isLoading}
              titulo={'Compras realizadas hoje'}
              info={String(
                listaPedidosEmpresa.data?.dados?.filter(
                  (compra) =>
                    new Date(
                      compra.cadastro.dataCadastro,
                    ).toLocaleDateString() ===
                      new Date().toLocaleDateString() && !compra.cancelado,
                ).length,
              )}
              icon={FilePlus2}
            />
            <IndicadorInformativo
              carregandoInformacao={listaPedidosEmpresa.isLoading}
              titulo={'Recebimentos para hoje'}
              info={String(
                listaPedidosEmpresa.data?.dados?.filter(
                  (compra) =>
                    new Date(compra.prazoEntrega).toLocaleDateString() ===
                      new Date().toLocaleDateString() && !compra.recebido,
                ).length,
              )}
              icon={CalendarClock}
            />
            <IndicadorInformativo
              carregandoInformacao={listaPedidosEmpresa.isLoading}
              titulo={'Entregas recebidas'}
              info={String(
                listaPedidosEmpresa.data?.dados?.filter(
                  (compra) =>
                    new Date(compra.prazoEntrega).toLocaleDateString() ===
                      new Date().toLocaleDateString() && compra.recebido,
                ).length,
              )}
              icon={PackageOpen}
            />
          </div>
          <TabelaPedidos
            novoPedido={false}
            carregandoPedidos={listaPedidosEmpresa.isLoading}
            listaPedidos={
              listaPedidosEmpresa.data?.dados?.filter(
                (compra) => !compra.cancelado && !compra.recebido,
              ) ?? []
            }
            colunasTabela={ColunasPedidosEmpresaRecebimento}
          />
        </section>
      </CardContent>
    </Card>
  )
}

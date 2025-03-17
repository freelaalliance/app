'use client'

import { useQuery } from '@tanstack/react-query'
import { CalendarClock, PackageOpen } from 'lucide-react'

import { IndicadorInformativo } from '@/components/IndicadorInfo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { buscarPedidosPorStatusEmpresa } from '@/app/modulo/compras/[id]/fornecedor/(api)/ComprasApi'
import { TabelaPedidos } from '@/app/modulo/compras/[id]/fornecedor/components/tabelas/pedidos/tabela-pedidos'
import { ColunasPedidosEmpresaRecebimento } from '@/app/modulo/compras/[id]/fornecedor/components/tabelas/pedidos/colunas-tabela-pedidos-recebimento'

export default function RecebimentoPedidos() {
  const listaPedidosPendentesEmpresa = useQuery({
    queryKey: ['pedidosPendenteFornecedor'],
    queryFn: () => buscarPedidosPorStatusEmpresa('pendentes'),
    staleTime: 60 * 60 * 24,
  })

  const listaPedidosRecebidosEmpresa = useQuery({
    queryKey: ['pedidosRecebidosFornecedor'],
    queryFn: () => buscarPedidosPorStatusEmpresa('recebidos'),
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
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <IndicadorInformativo
              carregandoInformacao={listaPedidosPendentesEmpresa.isLoading}
              titulo={'Compras Pendentes'}
              info={String(
                listaPedidosPendentesEmpresa.data?.dados?.length
              )}
              icon={CalendarClock}
            />
            <IndicadorInformativo
              carregandoInformacao={listaPedidosPendentesEmpresa.isLoading}
              titulo={'Compras Recebidas'}
              info={String(
                listaPedidosRecebidosEmpresa.data?.dados?.length
              )}
              icon={PackageOpen}
            />
          </div>
          <Card>
            <CardContent className='py-4'>
              <Tabs defaultValue="pendentes">
                <TabsList>
                  <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                  <TabsTrigger value="recebidos">Recebidos</TabsTrigger>
                </TabsList>
                <TabsContent value="pendentes">
                  <TabelaPedidos
                    novoPedido={false}
                    carregandoPedidos={listaPedidosPendentesEmpresa.isLoading}
                    listaPedidos={
                      listaPedidosPendentesEmpresa.data?.dados ?? []
                    }
                    colunasTabela={ColunasPedidosEmpresaRecebimento}
                  />
                </TabsContent>
                <TabsContent value="recebidos">
                  <TabelaPedidos
                    novoPedido={false}
                    carregandoPedidos={listaPedidosRecebidosEmpresa.isLoading}
                    listaPedidos={
                      listaPedidosRecebidosEmpresa.data?.dados ?? []
                    }
                    colunasTabela={ColunasPedidosEmpresaRecebimento}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </CardContent>
    </Card>
  )
}

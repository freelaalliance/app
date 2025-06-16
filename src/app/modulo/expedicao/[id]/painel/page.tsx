"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Blocks, Boxes, Package, PackageCheck, TrendingUp } from "lucide-react"
import { useEstatisticasExpedicao, useMediaAvaliacaoExpedicao, useVendasExpedidas } from "../../_services/ServicoExpedicao"
import { IndicadorInformativo } from "@/components/IndicadorInfo"


export default function PainelExpedicaoPage() {

  const vendasExpedidasMes = useVendasExpedidas()
  const estatisticasExpedicao = useEstatisticasExpedicao()
  const mediaAvaliacaoExpedicao = useMediaAvaliacaoExpedicao()


  return (
    <section className="space-y-4">
      <div className="min-h-screen p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel de Expedição</h1>
              <p className="text-gray-600">Gerencie pedidos pendentes e expedidos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <IndicadorInformativo
              titulo="Vendas Pendentes"
              subtitulo="Pedidos aguardando expedição"
              info={String(estatisticasExpedicao.data?.pendentes.toLocaleString() ?? 0)}
              icon={Blocks}
              carregandoInformacao={estatisticasExpedicao.isFetching}
            />
            <IndicadorInformativo
              titulo="Vendas Expedidos"
              subtitulo="Pedidos expedidos no ultimo mês"
              info={String(estatisticasExpedicao.data?.realizadas.toLocaleString() ?? 0)}
              icon={PackageCheck}
              carregandoInformacao={estatisticasExpedicao.isFetching}
            />
            <IndicadorInformativo
              titulo="Total Vendas"
              subtitulo="Total de pedidos no sistema"
              info={String(estatisticasExpedicao.data?.total.toLocaleString() ?? 0)}
              icon={Boxes}
              carregandoInformacao={estatisticasExpedicao.isFetching}
            />
            <IndicadorInformativo
              titulo="Media Avaliação"
              subtitulo="Média de avaliação dos pedidos"
              info={String(mediaAvaliacaoExpedicao.data ? Number(mediaAvaliacaoExpedicao.data.media).toFixed(1) : 0)}
              icon={TrendingUp}
              carregandoInformacao={mediaAvaliacaoExpedicao.isFetching}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos Expedidos Recentemente</CardTitle>
              <CardDescription>Últimos pedidos que foram expedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendasExpedidasMes.data?.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-4">
                      <PackageCheck className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium">
                          {`#${order.venda.numeroVenda} - ${order.venda.cliente.nome}`}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Expedido
                    </Badge>
                  </div>
                ))}
                {vendasExpedidasMes.data.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma venda foi expedida ainda hoje</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const VisualizarDadosFornecedor = dynamic(
  () => import('./(views)/FornecedoresView'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

const VisualizarDadosCompras = dynamic(() => import('./(views)/ComprasView'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

const VisualizarDadosRecebimento = dynamic(
  () => import('./(views)/RecebimentosView'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

export default function PagePainelCompras() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Painel</CardTitle>
        <CardDescription>
          Visualize as estatisticas de todas as compras realizadas e dos seus
          fornecedores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recebimentos">
          <TabsList className="w-full">
            <TabsTrigger value="recebimentos">Recebimentos</TabsTrigger>
            <TabsTrigger value="compras">Compras</TabsTrigger>
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          </TabsList>
          <TabsContent value="recebimentos">
            <VisualizarDadosRecebimento />
          </TabsContent>
          <TabsContent value="compras">
            <VisualizarDadosCompras />
          </TabsContent>
          <TabsContent value="fornecedores">
            <VisualizarDadosFornecedor />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
